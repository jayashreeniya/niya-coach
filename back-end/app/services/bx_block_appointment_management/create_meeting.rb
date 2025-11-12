module BxBlockAppointmentManagement
	class CreateMeeting

		def call
			generate_meeting_data
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
     meeting_data= eval(response.read_body).merge(token: request['authorization'])
     return meeting_data
   end

   def generate_token
     payload = {
       apikey: ENV['API_KEY'],
       permissions: ["allow_join", "allow_mod", "ask_join"]
     }
     token = JWT.encode(payload, ENV['SECRET_KEY'], 'HS256')
     return token
   end
	end
end
