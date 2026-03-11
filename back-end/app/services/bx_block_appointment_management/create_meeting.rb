module BxBlockAppointmentManagement
	class CreateMeeting

    FALLBACK_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhcGlrZXkiOiI0YzkwZWUwOS0xMjRmLTRjMjktYjkyZS00NzVlOTBlMDBiMjQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIiwiYWxsb3dfbW9kIiwiYXNrX2pvaW4iXX0.3URufcS0zoLE6Emo9BLUZqF6hvfoqWor6QJDvIJtwRQ".freeze

		def call
			generate_meeting_data
		end

    def token
      generate_token
    end

		private

   def generate_meeting_data
     url = URI("https://api.videosdk.live/v1/meetings")

     http = Net::HTTP.new(url.host, url.port)
     http.use_ssl = true
     http.verify_mode = OpenSSL::SSL::VERIFY_PEER
     request = Net::HTTP::Post.new(url, 'Content-Type' => 'application/json')
     request['authorization'] = generate_token
     user_meeting_id = SecureRandom.alphanumeric(10)
     request.body = {region: 'in001', user_meeting_id: user_meeting_id}.to_json
     response = http.request(request)
     parsed = JSON.parse(response.read_body, symbolize_names: true) rescue {}
     if parsed[:meetingId].blank? && generate_token != FALLBACK_TOKEN
       request['authorization'] = FALLBACK_TOKEN
       response = http.request(request)
       parsed = JSON.parse(response.read_body, symbolize_names: true) rescue {}
     end
     parsed.merge(token: request['authorization'])
   end

   def generate_token
     if ENV['API_KEY'].present? && ENV['SECRET_KEY'].present?
       payload = {
         apikey: ENV['API_KEY'],
         permissions: ["allow_join", "allow_mod", "ask_join"]
       }
       JWT.encode(payload, ENV['SECRET_KEY'], 'HS256')
     else
       FALLBACK_TOKEN
     end
   end
	end
end
