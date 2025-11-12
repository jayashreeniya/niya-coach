require 'rails_helper'

RSpec.describe BxBlockForgotPassword::OtpsController, type: :request do
  let(:sms_otp) { instance_double(AccountBlock::SmsOtp, save: true) }
  before(:all) do
    @company = Company.new(name: "tata", email: "tata#{rand(100)}@gmail.com", address: "mumbai")
    @company.hr_code = SecureRandom.alphanumeric(6)
    @company.employee_code = SecureRandom.alphanumeric(7)
    @company.save
    @user = AccountBlock::Account.find_by(id: 1)
    @user = AccountBlock::Account.create(full_name: "user#{rand(100)}", email: "user#{rand(100)}@gmail.com", full_phone_number: "919198063968", password: "Test@123", password_confirmation: "Test@123", access_code: @company.employee_code) unless @user.present?
    @token = BuilderJsonWebToken::JsonWebToken.encode(@user.id)
  end

  SEND_OTP = "/bx_block_forgot_password/otps"

  describe "#create" do
    context "when sending OTP" do
      it "sends OTP via email if the email is valid" do
        post SEND_OTP, params: { email: @user.email }
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:ok)
        expect(data['message']).to eq("OTP sent successfully.")
      end

      it "returns an error if the email is invalid" do
        post SEND_OTP, params: { email: "invalid_email@example.com" }
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(data['errors'][0]['account']).to eq("Account not found")
      end

      it "will not sends OTP via SMS if the phone number is invalid" do
        allow(AccountBlock::SmsOtp).to receive(:new).and_return(sms_otp)
        allow(sms_otp).to receive(:save).and_return(false)

        post SEND_OTP, params: { full_phone_number: @user.full_phone_number }
        data = JSON.parse(response.body)
        expect(response).to have_http_status(422)
        expect(data.dig('errors')).to eq("Unable to sent otp due to invalid number")
      end

      it "sends OTP via SMS if the phone number is valid" do
        expect {post SEND_OTP, params: { full_phone_number: @user.full_phone_number } }.to change(AccountBlock::SmsOtp, :count).by(1)
        expect(response).to have_http_status(200)
        expect(response.parsed_body['message']).to eq("sms otp sent successfully.")
      end

      it "returns an error if the phone number is invalid" do
        post SEND_OTP, params: { full_phone_number: "123456789" }
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(data['errors'][0]['full_phone_number']).to eq("Invalid phone number format")
      end

      it "returns an error if neither email nor phone number is provided" do
        post SEND_OTP, params: {}
        data = JSON.parse(response.body)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(data['errors'][0]['otp']).to eq("Email or phone number are required")
      end
    end
  end
end
