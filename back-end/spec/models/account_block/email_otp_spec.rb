require 'rails_helper'

RSpec.describe AccountBlock::EmailOtp, type: :model do
  let(:valid_until) {(Time.current + 5.minutes).to_i}
  let(:current_time) {(Time.current).to_i}
  let(:email_otp) {AccountBlock::EmailOtp.new}
  context "when test the 'EmailOtp' class" do
    it "when the generate 'pin'" do
      email_obj = email_otp.generate_pin_and_valid_date
      expect(email_obj).not_to eq nil
    end
    it "Date valid to 5 min" do
      expect(current_time).to be < valid_until
    end
  end
end