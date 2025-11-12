require 'rails_helper'

RSpec.describe AccountBlock::SmsAccount, type: :model do
  let!(:account) {AccountBlock::SmsAccount.create(full_name: 'Test User',full_phone_number: 917907617765)}
  it "include user with full_phone_number" do
    expect(account.full_phone_number.present?).to eq true
  end
end