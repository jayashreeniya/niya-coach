require 'rails_helper'

RSpec.describe AccountBlock::SmsOtp, type: :model do
  let(:sms_otp) {AccountBlock::SmsOtp.create}
  it 'should return error ' do
    expect(sms_otp.errors.messages[:full_phone_number]).to eq (["Invalid or Unrecognized Phone Number", "can't be blank"])
  end
end