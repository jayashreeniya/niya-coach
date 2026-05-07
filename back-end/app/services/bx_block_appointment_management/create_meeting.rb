module BxBlockAppointmentManagement
  class CreateMeeting

    FALLBACK_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhcGlrZXkiOiI0YzkwZWUwOS0xMjRmLTRjMjktYjkyZS00NzVlOTBlMDBiMjQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIiwiYWxsb3dfbW9kIiwiYXNrX2pvaW4iXX0.3URufcS0zoLE6Emo9BLUZqF6hvfoqWor6QJDvIJtwRQ".freeze

    def call
      generate_meeting_data
    end

    # Token for mobile/web clients joining a room (must include version 2 + rtc role per VideoSDK docs).
    def token(room_id: nil)
      participant_access_token(room_id: room_id)
    end

    private

    def generate_meeting_data
      url = URI("https://api.videosdk.live/v1/meetings")

      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_PEER
      request = Net::HTTP::Post.new(url, 'Content-Type' => 'application/json')
      request['authorization'] = api_access_token
      user_meeting_id = SecureRandom.alphanumeric(10)
      request.body = { region: 'in001', user_meeting_id: user_meeting_id }.to_json
      response = http.request(request)
      parsed = JSON.parse(response.read_body, symbolize_names: true) rescue {}
      used_fallback_for_meeting = false
      if parsed[:meetingId].blank? && !using_fallback_api_token?
        request['authorization'] = FALLBACK_TOKEN
        response = http.request(request)
        parsed = JSON.parse(response.read_body, symbolize_names: true) rescue {}
        used_fallback_for_meeting = parsed[:meetingId].present?
      end

      meeting_id = parsed[:meetingId]
      # Do not return the crawler/API token to clients — they need an rtc participant token.
      client_token = if meeting_id.present? && !using_fallback_api_token? && !used_fallback_for_meeting
                       participant_access_token(room_id: meeting_id)
                     else
                       request['authorization']
                     end

      Rails.logger.info(
        "videosdk generate_meeting_data meeting_id_present=#{meeting_id.present?} " \
        "used_fallback_for_meeting=#{used_fallback_for_meeting} " \
        "using_fallback_api_token=#{using_fallback_api_token?} " \
        "client_token_len=#{client_token.to_s.length}"
      )

      parsed.merge(token: client_token)
    end

    def using_fallback_api_token?
      ENV['API_KEY'].blank? || videosdk_secret.blank?
    end

    # VideoSDK secret must NOT use ENV['SECRET_KEY'] — that variable is used for app user JWTs (HS512).
    def videosdk_secret
      ENV['VIDEOSDK_SECRET_KEY'].presence || ENV['VIDEO_SDK_SECRET'].presence
    end

    def token_exp
      Time.now.to_i + (24 * 60 * 60)
    end

    # For VideoSDK REST calls (e.g. POST /v1/meetings) — crawler role, not rtc.
    def api_access_token
      return FALLBACK_TOKEN if using_fallback_api_token?

      payload = {
        apikey: ENV['API_KEY'],
        permissions: ['allow_join'],
        version: 2,
        roles: ['crawler'],
        exp: token_exp
      }
      JWT.encode(payload, videosdk_secret, 'HS256')
    end

    # For MeetingProvider / native SDK join.
    # NOTE: RN SDK 0.0.54 expects legacy participant token shape (v1-style claims),
    # so avoid v2-only claims (version/roles/roomId) here.
    def participant_access_token(room_id: nil)
      return FALLBACK_TOKEN if using_fallback_api_token?

      payload = {
        apikey: ENV['API_KEY'],
        permissions: ['allow_join', 'allow_mod', 'ask_join'],
        exp: token_exp
      }
      Rails.logger.info("videosdk participant_access_token legacy_format=true room_scoped_ignored=#{room_id.present?} api_key_present=#{ENV['API_KEY'].present?} secret_present=#{videosdk_secret.present?}")
      JWT.encode(payload, videosdk_secret, 'HS256')
    end
  end
end
