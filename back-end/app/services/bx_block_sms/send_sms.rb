module BxBlockSms
  class SendSms
    attr_reader :to, :text_content

    def initialize(to, text_content)
      @to = to
      @text_content = text_content
    end
    
    # Sms Otp
    def call
      message = "<#> Your verification code is  #{@text_content}"
      client = Twilio::REST::Client.new(Rails.application.secrets.account_sid, Rails.application.secrets.auth_token)
      client.messages.create({
        from: '+18483060366',
        to: "#{@to}",
        body: message
      })
    end
  end
end
