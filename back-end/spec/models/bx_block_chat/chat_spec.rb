# require 'rails_helper'

# RSpec.describe BxBlockChat::Chat, type: :model do

#   before(:each) do
#     role = BxBlockRolesPermissions::Role.create(name:"hr")
#     company = Company.new(name:"google",email:"google@gmail.com")
#     company.hr_code = "a3lLl2"
#     company.employee_code = SecureRandom.alphanumeric(7)
#     company.save
#   end

#   describe "association" do
#     it "should have many accounts_chats" do
#       accounts_chat =  BxBlockChat::Chat.reflect_on_association(:accounts_chats)
#       expect(accounts_chat.macro).to eq(:has_many)
#     end
#     it "should have many accounts" do
#       account =  BxBlockChat::Chat.reflect_on_association(:accounts)
#       expect(account.macro).to eq(:has_many)
#     end
    
#     it "should have many messages" do
#       message =  BxBlockChat::Chat.reflect_on_association(:messages)
#       expect(message.macro).to eq(:has_many)
#     end
#   end

#   describe "when we are test the chat class" do
#     let(:accounts) {AccountBlock::Account.create(first_name: "Shrikant", last_name: "Dubey", full_phone_number: "918055859955", country_code: 91, phone_number: 8055859955, activated: true, device_id: "asdf12g", unique_auth_id: 12, password_digest: "$2a$12$lp", status: "regular", role_id: BxBlockRolesPermissions::Role.find_by_name("hr").id, full_name: "Demoname", access_code: "a3lLl2")}

#     let(:chat) {BxBlockChat::Chat.create(name:"This is the Chat", chat_type: 1, is_notification_mute: true)}
#     let(:accounts_chat) {BxBlockChat::AccountsChatsBlock.create(account_id: accounts.id, chat_id: chat.id, status: :admin)}
#     it "when the call admin_accounts method" do
#       accounts_chat.reload
#       expect(chat.admin_accounts).to eq([accounts.id])
#     end

#     it "when we call the last_admin? method" do
#       acc = chat.last_admin?(accounts)
#       expect(acc).to eq false
#     end
#   end
# end

