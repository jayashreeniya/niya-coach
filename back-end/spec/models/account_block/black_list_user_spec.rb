require 'rails_helper'

RSpec.describe AccountBlock::BlackListUser, type: :model do
  let(:account) {AccountBlock::Account.new(full_phone_number:"1234567892")}
  let(:account_email) {AccountBlock::Account.new(email:"xyz@gmail.com")}
  let(:account_user_type) {AccountBlock::Account.new(user_type:"admin")}
  it "when calling the method user mobile" do
    block = account.full_phone_number
    expect(block).to eq "1234567892"
  end

  it "when calling the method user mobile number" do
    email = account_email.email
    expect(email).to eq "xyz@gmail.com"
  end

  it "when calling the method user mobile number" do
    user_type = account_user_type.user_type
    expect(user_type).to eq "admin"
  end
  
end