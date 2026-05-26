require "securerandom"
require "base64"
require "json"

module BxBlockAppointmentManagement
  class CreateMeeting

    FALLBACK_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhcGlrZXkiOiI0YzkwZWUwOS0xMjRmLTRjMjktYjkyZS00NzVlOTBlMDBiMjQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIiwiYWxsb3dfbW9kIiwiYXNrX2pvaW4iXX0.3URufcS0zoLE6Emo9BLUZqF6hvfoqWor6QJDvIJtwRQ".freeze
    FALLBACK_API_KEY = "4c90ee09-124f-4c29-b92e-475e90e00b24".freeze

    def call
      generate_meeting_data
    end

    # Join token for mobile RN SDK — legacy shape (no roomId in JWT; meetingId is passed separately).
    def token(room_id: nil)
      participant_access_token
    end

    private

    def generate_meeting_data
      parsed, auth_mode = create_room
      meeting_id = parsed[:meetingId].presence || parsed[:roomId].presence
      client_token = mint_join_token(auth_mode)

      if meeting_id.blank? || client_token.blank?
        Rails.logger.error(
          "videosdk create_room failed auth_mode=#{auth_mode} status=#{parsed[:_http_status]} " \
          "body=#{parsed[:_http_body].to_s.truncate(400)}"
        )
        return { token: nil, meetingId: nil, roomId: nil }
      end

      unless room_valid_for_token?(meeting_id, client_token)
        Rails.logger.warn(
          "videosdk env credentials failed validate for room=#{meeting_id} — retrying with fallback project"
        )
        parsed, auth_mode = create_room_with_auth(FALLBACK_TOKEN, :fallback)
        meeting_id = parsed[:meetingId].presence || parsed[:roomId].presence
        client_token = FALLBACK_TOKEN
      end

      if meeting_id.blank? || client_token.blank?
        Rails.logger.error("videosdk abandoning — no valid room/token after fallback")
        return { token: nil, meetingId: nil, roomId: nil }
      end

      Rails.logger.info(
        "videosdk ready meeting_id=#{meeting_id} auth_mode=#{auth_mode} token_len=#{client_token.length} " \
        "token_apikey_last4=#{jwt_claim(client_token, 'apikey').to_s[-4, 4]}"
      )

      { meetingId: meeting_id, roomId: meeting_id, token: client_token }
    end

    def mint_join_token(auth_mode)
      case auth_mode
      when :env
        participant_access_token
      when :fallback
        if videosdk_fallback_secret.present?
          participant_access_token(api_key: FALLBACK_API_KEY, secret: videosdk_fallback_secret)
        else
          FALLBACK_TOKEN
        end
      else
        nil
      end
    end

    # v1 /meetings first (matches @videosdk.live/react-native-sdk 0.0.54), then v2 /rooms.
    def create_room
      return create_room_with_auth(FALLBACK_TOKEN, :fallback) if using_fallback_api_token?

      create_room_with_auth(api_access_token, :env)
    end

    def create_room_with_auth(authorization, auth_mode)
      parsed = create_room_v1(authorization)
      meeting_id = parsed[:meetingId].presence || parsed[:roomId].presence
      return [parsed, auth_mode] if meeting_id.present?

      Rails.logger.warn(
        "videosdk v1/meetings failed auth_mode=#{auth_mode} status=#{parsed[:_http_status]} " \
        "body=#{parsed[:_http_body].to_s.truncate(300)}"
      )

      parsed = create_room_v2(authorization)
      meeting_id = parsed[:roomId].presence || parsed[:meetingId].presence
      return [parsed, auth_mode] if meeting_id.present?

      [parsed, :failed]
    end

    def room_valid_for_token?(room_id, token)
      return false if room_id.blank? || token.blank?

      uri = URI("https://api.videosdk.live/v2/rooms/validate/#{room_id}")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.read_timeout = 10
      http.open_timeout = 10
      request = Net::HTTP::Get.new(uri)
      request["Authorization"] = token
      response = http.request(request)
      ok = response.code.to_i == 200
      Rails.logger.info(
        "videosdk validate room=#{room_id} ok=#{ok} status=#{response.code} body=#{response.body.to_s.truncate(200)}"
      )
      ok
    rescue StandardError => e
      Rails.logger.warn("videosdk validate error: #{e.class} - #{e.message}")
      false
    end

    def create_room_v1(authorization)
      uri = URI("https://api.videosdk.live/v1/meetings")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_PEER
      request = Net::HTTP::Post.new(uri)
      request["Content-Type"] = "application/json"
      request["authorization"] = authorization
      region = ENV["VIDEOSDK_REGION"].presence || "in001"
      request.body = { region: region, user_meeting_id: SecureRandom.alphanumeric(10) }.to_json
      response = http.request(request)
      parsed = JSON.parse(response.body, symbolize_names: true) rescue {}
      parsed.merge(_http_status: response.code, _http_body: response.body.to_s)
    end

    def create_room_v2(authorization)
      base = ENV["VIDEOSDK_API_BASE"].presence || "https://api.videosdk.live/v2"
      uri = URI("#{base.to_s.chomp('/')}/rooms")
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

    def videosdk_secret
      ENV["VIDEOSDK_SECRET_KEY"].presence || ENV["VIDEO_SDK_SECRET"].presence
    end

    def videosdk_fallback_secret
      ENV["VIDEOSDK_FALLBACK_SECRET_KEY"].presence || ENV["VIDEO_SDK_FALLBACK_SECRET"].presence
    end

    def token_exp
      Time.now.to_i + (24 * 60 * 60)
    end

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

    # Legacy participant JWT — do NOT embed roomId (RN SDK 0.0.54 + VideoSDK docs default).
    # Room is selected via meetingId on the client; room-scoped JWTs caused
    # "'token' is not valid for the provided meetingId" when claims drifted from config.
    def participant_access_token(api_key: nil, secret: nil)
      key = api_key.presence || ENV["API_KEY"]
      sec = secret.presence || videosdk_secret

      if key.blank? || sec.blank?
        return FALLBACK_TOKEN if using_fallback_api_token?

        Rails.logger.warn("videosdk participant_access_token missing key or secret")
        return nil
      end

      payload = {
        apikey: key,
        permissions: ["allow_join", "allow_mod", "ask_join"],
        exp: token_exp
      }
      JWT.encode(payload, sec, "HS256")
    end

    def jwt_claim(token, claim)
      return nil if token.blank?

      segment = token.to_s.split(".")[1]
      return nil if segment.blank?

      padded = segment + "=" * ((4 - segment.length % 4) % 4)
      JSON.parse(Base64.urlsafe_decode64(padded))[claim]
    rescue StandardError
      nil
    end
  end
end
