require "twilio-ruby"

module BxBlockAppointmentManagement
  class TwilioVideoService
    def self.account_sid
      ENV["TWILIO_ACCOUNT_SID"].presence || ENV["ACCOUNT_SID"].presence
    end

    def self.api_key_sid
      ENV["TWILIO_API_KEY_SID"].presence || ENV["CHAT_API_KEY"].presence
    end

    def self.api_key_secret
      ENV["TWILIO_API_KEY_SECRET"].presence || ENV["CHAT_API_SECRET"].presence
    end

    def create_or_get_room(room_name)
      client = Twilio::REST::Client.new(self.class.api_key_sid, self.class.api_key_secret, self.class.account_sid)
      begin
        room = client.video.v1.rooms(room_name).fetch
        Rails.logger.info("twilio_video: reusing room=#{room.sid} name=#{room_name} status=#{room.status}")
        return room_name if room.status == "in-progress"

        new_room = client.video.v1.rooms.create(
          unique_name: "#{room_name}-#{Time.now.to_i}",
          type: "peer-to-peer",
          max_participants: 2
        )
        Rails.logger.info("twilio_video: created new room=#{new_room.sid} name=#{new_room.unique_name}")
        new_room.unique_name
      rescue Twilio::REST::RestError => e
        if e.code == 20404
          new_room = client.video.v1.rooms.create(
            unique_name: room_name,
            type: "peer-to-peer",
            max_participants: 2
          )
          Rails.logger.info("twilio_video: created room=#{new_room.sid} name=#{room_name}")
          room_name
        else
          Rails.logger.error("twilio_video: room error #{e.code} - #{e.message}")
          raise
        end
      end
    end

    def generate_token(identity:, room_name:)
      identity = identity.to_s.strip.presence || "participant-#{SecureRandom.hex(4)}"

      grant = Twilio::JWT::AccessToken::VideoGrant.new
      grant.room = room_name

      token = Twilio::JWT::AccessToken.new(
        self.class.account_sid,
        self.class.api_key_sid,
        self.class.api_key_secret,
        [grant],
        identity: identity,
        ttl: 14400
      )

      token.to_jwt
    end
  end
end
