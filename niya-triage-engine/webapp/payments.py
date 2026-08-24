"""Payment: Razorpay when configured, simulated otherwise.

Razorpay is reached over its REST API with `urllib` rather than the SDK. The
only two operations needed are "create an order" and "verify a signature", and
the second is pure HMAC, so an extra dependency buys nothing.

The important property, in both modes, is that **the server decides the amount
and verifies the signature against it**. NIYA's live flow does neither: it
redirects to a hosted Payment Button whose price lives in the Razorpay
dashboard, then treats the presence of a URL parameter on `/payment-success` as
proof of payment.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import urllib.error
import urllib.request
import uuid
from dataclasses import dataclass
from typing import Optional

from . import settings

RAZORPAY_API = "https://api.razorpay.com/v1"
REQUEST_TIMEOUT_SECONDS = 15


class PaymentError(RuntimeError):
    pass


@dataclass
class Order:
    order_id: str
    amount_minor: int
    currency: str
    provider: str
    #: Only present in simulated mode - the client uses it to complete the
    #: payment without a gateway. Never produced when Razorpay is live.
    simulated_signature: Optional[str] = None


def _local_signature(order_id: str, payment_reference: str) -> str:
    """Simulated-mode stand-in, built the same shape as Razorpay's."""
    secret = (settings.SECRET_KEY or "niya-triage-dev-secret").encode("utf-8")
    payload = f"{order_id}|{payment_reference}".encode("utf-8")
    return hmac.new(secret, payload, hashlib.sha256).hexdigest()


def create_order(amount_minor: int, currency: str, receipt: str) -> Order:
    """Create a payment order before the user is asked for money."""
    if not settings.PAYMENTS_LIVE:
        order_id = f"order_sim_{uuid.uuid4().hex[:14]}"
        return Order(
            order_id=order_id,
            amount_minor=amount_minor,
            currency=currency,
            provider="simulated",
        )

    credentials = f"{settings.RAZORPAY_KEY_ID}:{settings.RAZORPAY_KEY_SECRET}".encode()
    request = urllib.request.Request(
        f"{RAZORPAY_API}/orders",
        data=json.dumps(
            {
                "amount": amount_minor,
                "currency": currency,
                "receipt": receipt,
                "payment_capture": 1,
            }
        ).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": "Basic " + base64.b64encode(credentials).decode(),
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")[:300]
        raise PaymentError(f"Razorpay rejected the order request: {detail}") from error
    except urllib.error.URLError as error:
        raise PaymentError(f"Could not reach Razorpay: {error.reason}") from error

    return Order(
        order_id=payload["id"],
        amount_minor=payload["amount"],
        currency=payload["currency"],
        provider="razorpay",
    )


def verify_payment(order_id: str, payment_reference: str, signature: str) -> bool:
    """Confirm the gateway really took this payment, for this order.

    Razorpay signs `order_id|payment_id` with the key secret. Recomputing it
    server-side is the whole point: without it, a client can claim any payment
    reference it likes.
    """
    if not signature:
        return False

    if settings.PAYMENTS_LIVE:
        expected = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
            f"{order_id}|{payment_reference}".encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
    else:
        expected = _local_signature(order_id, payment_reference)

    return hmac.compare_digest(expected, signature)


def simulate_successful_payment(order_id: str) -> dict:
    """Stand in for the gateway callback while Razorpay keys are absent.

    Refuses to run when Razorpay is configured, so a real deployment cannot be
    talked into accepting a fabricated payment through this path.
    """
    if settings.PAYMENTS_LIVE:
        raise PaymentError(
            "Razorpay is configured; payments must go through the gateway."
        )
    reference = f"pay_sim_{uuid.uuid4().hex[:14]}"
    return {
        "payment_reference": reference,
        "signature": _local_signature(order_id, reference),
    }


def describe_mode() -> str:
    return "Razorpay" if settings.PAYMENTS_LIVE else "Simulated (no Razorpay keys configured)"
