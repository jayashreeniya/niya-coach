require 'rails_helper'

RSpec.describe AccountBlock::EmailAccount, type: :model do
    account = Support::SharedHelper.new.get_coach_user

    it "include user with specific email" do
        account.save(validate: false)
        expect(AccountBlock::EmailAccount.get_user_email('COACH17@gmail.com').last.email).to eq(account&.email)
    end
end
