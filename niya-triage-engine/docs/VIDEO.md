# Video calls

The session runs on Twilio Programmable Video, which is what NIYA's web app
already uses. Nothing new to buy, and the same account serves both.

Twilio announced an end-of-life for Programmable Video in March 2024 and
[reversed it in October 2024](https://www.twilio.com/en-us/changelog/-twilio-video-will-remain-a-standalone-product).
It is a supported product with no forced migration.

## Configuration

Three variables, all on the web service:

```
TWILIO_ACCOUNT_SID=AC...
TWILIO_API_KEY_SID=SK...
TWILIO_API_KEY_SECRET=...
```

**Without them the session page stays a placeholder.** It says video is not
connected rather than showing a call surface that cannot connect, so the rest of
the booking journey can be run and tested without video credentials.

The API key pair is deliberately not the account auth token. An API key can be
revoked on its own; revoking the auth token breaks SMS and everything else on
the account at the same time.

In the Rails app these same values are read from `CHAT_API_KEY` and
`CHAT_API_SECRET`, named after an earlier use. They are named for what they are
here.

### Where to get the real values

**From the Render dashboard, on the `niya-backend` service, under Environment.**
Copy `ACCOUNT_SID`, `CHAT_API_KEY` and `CHAT_API_SECRET` from there.

Not from `back-end/.env.local`, and not from `back-end/config/secrets.yml`.
Both contain Twilio credentials, and as of August 2026 **every one of them is
dead** — checked against Twilio, all return 401. They are left over from
accounts or keys that have since been rotated. The same file also carried a
retired database host, so treat it as historical throughout.

The key pair must belong to the account in `TWILIO_ACCOUNT_SID`. An API key from
a different account authenticates but then fails to mint usable tokens.

### Checking the credentials work

Configured is not the same as working, and the difference only shows up when
somebody tries to join. So the app asks Twilio at startup and reports the answer
on `/healthz`:

| `video` value | Meaning |
| --- | --- |
| `not connected` | No credentials set. Session page shows the placeholder. |
| `twilio` | Twilio accepted the key pair. |
| `twilio BROKEN: ...` | Credentials are set but Twilio rejected them. Video will fail on join. |
| `twilio (unverified)` | The check has not run yet. |

A failure is also logged as an error in the deploy log. The check is one request
per boot, and a network problem while making it never stops the app starting.

## How access is decided

A Twilio access token is a JWT signed with the API key secret. `webapp/video.py`
mints it from the standard library rather than pulling in the Twilio SDK for one
HMAC.

Nothing is minted until the server has decided the person may join. The check is
`booking_service.authorise_connection`, the same one that governs the page
itself, so a token cannot be obtained by asking for it directly.

Two differences from how NIYA's Rails app issues these:

**Tokens expire when the joining window closes**, not four hours later. A token
is a bearer credential for a room where two people discuss something private, so
it should stop working when the session does. The Rails endpoint issues a
four-hour token to any authenticated caller with a booking id, at any hour.

**The room and identity are fixed server-side** from the booking and the signed-in
account. A token minted for one session names only that session's room, so it
cannot be replayed into another.

Identities carry the account id as well as the name, because Twilio treats two
participants with the same identity as the same person and evicts the first.

## Content Security Policy

The SDK is vendored at `webapp/static/vendor/` and served from our own origin, so
`script-src` stays `'self'`. This matches how NIYA's web app ships it, as a
bundled npm dependency rather than a CDN asset.

The policy is widened in exactly two places, and only when video credentials are
present:

- `connect-src` gains `https://*.twilio.com wss://*.twilio.com`, for the
  signalling WebSocket that negotiates the call.
- `media-src` gains `blob:`, which some browsers need to attach tracks.

Media itself is peer-to-peer SRTP and is not governed by CSP.

An instance without video credentials runs the same strict policy as before: a
capability nobody can use should not cost anybody a weaker header.

`Permissions-Policy` grants camera and microphone to this origin only, and denies
geolocation outright.

## Updating the SDK

The vendored file is pinned, which is the safer default for something in the
request path of a private conversation, but it means security patches need
applying by hand:

1. Download the new release from `https://sdk.twilio.com/js/video/releases/<version>/twilio-video.min.js`
2. Save it to `webapp/static/vendor/twilio-video-<version>.min.js`
3. Update the `<script src>` in `templates/session.html` and
   `templates/expert/session.html`
4. Delete the old file
5. `pytest tests/test_webapp.py -k sdk` checks the file is actually served

## What is not built

**No recording.** Nothing is captured or stored. Recording a counselling session
raises consent and retention questions that need answering deliberately rather
than arriving as a side effect of a configuration flag.

**No waiting room.** Whoever arrives first sees a waiting message until the other
joins. There is no screen for a counsellor to admit someone.

**No screen sharing, chat or virtual backgrounds.**

**No network quality indicator.** Twilio publishes one; a poor connection
currently shows only as the reconnecting message.

**Room type is set by `TWILIO_ROOM_TYPE`, default `go`.** Twilio's Go rooms are
peer-to-peer and free at low volume, which suits a two-person call. Group rooms
cost per participant-minute and are only worth it above two people.
