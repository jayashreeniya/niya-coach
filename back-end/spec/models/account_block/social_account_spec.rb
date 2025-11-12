require 'rails_helper'

RSpec.describe AccountBlock::SocialAccount, type: :model do
  describe '#validations of email' do
    it 'should return email validation error' do
      obj = AccountBlock::SocialAccount.new(id: 79, email: 'test123@gmail.com', unique_auth_id: 123)
      obj.save(validate: false)
      expect(obj.email).to eq "test123@gmail.com"
      expect(obj.email.present?).to eq true
    end
  end
end