require "securerandom"

module BxBlockAppointmentManagement
  class CreateMeeting

    # Legacy dashboard-style JWT (same apikey as below). Used only for crawler auth when ENV keys are missing.
    FALLBACK_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhcGlrZXkiOiI0YzkwZWUwOS0xMjRmLTRjMjktYjkyZS00NzVlOTBlMDBiMjQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIiwiYWxsb3dfbW9kIiwiYXNrX2pvaW4iXX0.3URufcS0zoLE6Emo9BLUZqF6hvfoqWor6QJDvIJtwRQ".freeze
    FALLBACK_API_KEY = "4c90ee09-124f-4c29-b92e-475e90e00b24".freeze

    def call
      generate_meeting_data
    end

    # Token for mobile/web clients joining a room.
    def token(room_id: nil)
      participant_access_token(room_id: room_id)
    end

    private

    # Prefer v2 /rooms (same product surface as rtc+roomId join tokens). v1 /meetings + v2 participant tokens can mismatch.
    def generate_meeting_data
      parsed, auth_mode = create_room_v2
      meeting_id = parsed[:roomId].presence || parsed[:meetingId].presence

      if meeting_id.blank?
        Rails.logger.warn(
          "videosdk v2/rooms failed status=#{parsed[:_http_status]} body=#{parsed[:_http_body].to_s.truncate(800)} auth_mode=#{auth_mode}"
        )
        return { token: nil, meetingId: nil, roomId: nil }.merge(parsed.except(:_http_status, :_http_body))
      end

      client_token =
        case auth_mode
        when :env
          participant_access_token(room_id: meeting_id)
        when :fallback
          # Room was created with FALLBACK_TOKEN; join JWT must be signed for that apikey + roomId.
          if videosdk_fallback_secret.present?
            participant_access_token(room_id: meeting_id, api_key: FALLBACK_API_KEY, secret: videosdk_fallback_secret)
          else
            Rails.logger.error(
              "videosdk room created with fallback auth but VIDEOSDK_FALLBACK_SECRET_KEY is unset — cannot mint room-scoped join token"
            )
            nil
          end
        else
          nil
        end

      if client_token.blank?
        Rails.logger.error("videosdk abandoning room_id=#{meeting_id} — no join token minted")
        return { token: nil, meetingId: nil, roomId: nil }.merge(parsed.except(:_http_status, :_http_body))
      end

      Rails.logger.info(
        "videosdk v2/rooms meeting_id_present=#{meeting_id.present?} auth_mode=#{auth_mode} " \
        "client_token_present=#{client_token.present?} client_token_len=#{client_token.to_s.length}"
      )

      parsed.except(:_http_status, :_http_body).merge(
        meetingId: meeting_id,
        roomId: meeting_id,
        token: client_token
      )
    end

    # Returns [parsed_hash_including_http_meta, :env | :fallback | :failed]
    def create_room_v2
      base = ENV["VIDEOSDK_API_BASE"].presence || "https://api.videosdk.live/v2"
      uri = URI("#{base.to_s.chomp('/')}/rooms")

      unless using_fallback_api_token?
        parsed = post_json_rooms(uri, api_access_token)
        meeting_id = parsed[:roomId].presence || parsed[:meetingId].presence
        return [parsed, :env] if meeting_id.present?

        Rails.logger.warn(
          "videosdk v2/rooms primary failed status=#{parsed[:_http_status]} body=#{parsed[:_http_body].to_s.truncate(500)}"
        )
        return [parsed, :failed]
      end

      parsed = post_json_rooms(uri, FALLBACK_TOKEN)
      meeting_id = parsed[:roomId].presence || parsed[:meetingId].presence
      return [parsed, :fallback] if meeting_id.present?

      [parsed, :failed]
    end

    def post_json_rooms(uri, authorization)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_PEER
      request = Net::HTTP::Post.new(uri)
      request["Content-Type"] = "application/json"
      request["Authorization"] = authorization
      region = ENV["VIDEOSDK_REGION"].presence
      request.body = region.present? ? { region: region }.to_json : "{}"
      response = http.request(request)
      parsed = JSON.parse(response.body, symbolize_names: true) rescue {}
      parsed.merge(_http_status: response.code, _http_body: response.body.to_s)
    end

    def using_fallback_api_token?
      ENV["API_KEY"].blank? || videosdk_secret.blank?
    end

    # VideoSDK secret must NOT use ENV['SECRET_KEY'] — that variable is used for app user JWTs (HS512).
    def videosdk_secret
      ENV["VIDEOSDK_SECRET_KEY"].presence || ENV["VIDEO_SDK_SECRET"].presence
    end

    def videosdk_fallback_secret
      ENV["VIDEOSDK_FALLBACK_SECRET_KEY"].presence || ENV["VIDEO_SDK_FALLBACK_SECRET"].presence
    end

    def token_exp
      Time.now.to_i + (24 * 60 * 60)
    end

    # For VideoSDK REST (e.g. POST /v2/rooms) — crawler role, not rtc.
    def api_access_token
      return FALLBACK_TOKEN if using_fallback_api_token?

      payload = {
        apikey: ENV["API_KEY"],
        permissions: ["allow_join"],
        version: 2,
        roles: ["crawler"],
        exp: token_exp
      }
      JWT.encode(payload, videosdk_secret, "HS256")
    end

    # For MeetingProvider / native SDK join (rtc + roomId when room_id present), per VideoSDK server examples.
    def participant_access_token(room_id: nil, api_key: nil, secret: nil)
      key = api_key.presence || ENV["API_KEY"]
      sec = secret.presence || videosdk_secret

      if key.blank? || sec.blank?
        return FALLBACK_TOKEN if using_fallback_api_token? && room_id.blank?

        Rails.logger.warn("videosdk participant_access_token missing key or secret")
        return nil
      end

      payload = {
        apikey: key,
        permissions: ["allow_join", "allow_mod"],
        exp: token_exp,
        jti: SecureRandom.uuid
      }
      if room_id.present?
        payload[:version] = 2
        payload[:roles] = ["rtc"]
        payload[:roomId] = room_id.to_s
      end

      Rails.logger.info(
        "videosdk participant_access_token v2_rtc=#{room_id.present?} api_key_suffix=#{key.to_s[-4, 4]}"
      )
      JWT.encode(payload, sec, "HS256")
    end
  end
end
