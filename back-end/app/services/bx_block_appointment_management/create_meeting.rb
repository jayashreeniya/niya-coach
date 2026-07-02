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

    # Join token for mobile SDK — always produces a v2 JWT with roomId embedded.
    # Tries env credentials first, then fallback secret for proper token generation.
    def token(room_id: nil)
      unless using_fallback_api_token?
        t = mint_join_token(:env, room_id)
        return t if t.present? && t != FALLBACK_TOKEN
      end

      if videosdk_fallback_secret.present?
        return participant_access_token(api_key: FALLBACK_API_KEY, secret: videosdk_fallback_secret, room_id: room_id)
      end

      mint_join_token(:fallback, room_id)
    end

    def room_exists?(room_id)
      return false if room_id.blank?

      room_valid_for_token?(room_id, auth_mode: :env) ||
        room_valid_for_token?(room_id, auth_mode: :fallback)
    end

    private

    def generate_meeting_data
      parsed, auth_mode = create_room
      meeting_id = parsed[:meetingId].presence || parsed[:roomId].presence
      client_token = mint_join_token(auth_mode, meeting_id)

      if meeting_id.blank? || client_token.blank?
        Rails.logger.error(
          "videosdk create_room failed auth_mode=#{auth_mode} status=#{parsed[:_http_status]} " \
          "body=#{parsed[:_http_body].to_s.truncate(400)}"
        )
        return { token: nil, meetingId: nil, roomId: nil }
      end

      Rails.logger.info(
        "videosdk ready meeting_id=#{meeting_id} auth_mode=#{auth_mode} token_len=#{client_token.length} " \
        "token_apikey_last4=#{jwt_claim(client_token, 'apikey').to_s[-4, 4]}"
      )

      { meetingId: meeting_id, roomId: meeting_id, token: client_token }
    end

    def mint_join_token(auth_mode, meeting_id = nil)
      case auth_mode
      when :env
        participant_access_token(room_id: meeting_id)
      when :fallback
        if videosdk_fallback_secret.present?
          participant_access_token(api_key: FALLBACK_API_KEY, secret: videosdk_fallback_secret, room_id: meeting_id)
        else
          FALLBACK_TOKEN
        end
      else
        nil
      end
    end

    # Create rooms using the same project credentials that will be used for join tokens.
    # Room + token MUST be from the same VideoSDK project, otherwise SDK rejects the join.
    def create_room
      if using_fallback_api_token?
        create_room_with_auth(FALLBACK_TOKEN, :fallback)
      else
        create_room_with_auth(api_access_token, :env)
      end
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

    # Validate room exists using crawler/admin token (v2 validate API rejects rtc role tokens).
    def room_valid_for_token?(room_id, auth_mode: :env)
      return false if room_id.blank?

      authorization = authorization_for_auth_mode(auth_mode)
      return false if authorization.blank?

      uri = URI("https://api.videosdk.live/v2/rooms/validate/#{room_id}")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.read_timeout = 10
      http.open_timeout = 10
      request = Net::HTTP::Get.new(uri)
      request["Authorization"] = authorization
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

    def authorization_for_auth_mode(auth_mode)
      case auth_mode
      when :fallback
        FALLBACK_TOKEN
      when :env
        api_access_token
      else
        nil
      end
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
      ENV["VIDEOSDK_SECRET_KEY"].presence || ENV["VIDEO_SDK_SECRET"].presence || ENV["SECRET_KEY"].presence
    end

    def videosdk_fallback_secret
      ENV["VIDEOSDK_FALLBACK_SECRET_KEY"].presence || ENV["VIDEO_SDK_FALLBACK_SECRET"].presence || ENV["SECRET_KEY"].presence
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

    # Participant JWT for SDK join. When room_id is present, include v2 rtc + roomId (required by current VideoSDK project).
    def participant_access_token(api_key: nil, secret: nil, room_id: nil)
      key = api_key.presence || ENV["API_KEY"]
      sec = secret.presence || videosdk_secret

      if key.blank? || sec.blank?
        return FALLBACK_TOKEN if using_fallback_api_token?

        Rails.logger.warn("videosdk participant_access_token missing key or secret")
        return nil
      end

      payload = {
        apikey: key,
        permissions: ["allow_join", "allow_mod"],
        exp: token_exp
      }
      if room_id.present?
        payload[:version] = 2
        payload[:roles] = ["rtc"]
        payload[:roomId] = room_id.to_s
      end
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
