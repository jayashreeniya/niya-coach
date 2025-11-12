# require 'rails_helper'

# RSpec.describe BxBlockPushNotifications::PushNotification, type: :model do
  
#   describe "Associatoins" do
#     it { should belong_to(:push_notificable) }
#     it { should belong_to(:account) }
#   end
  
#   describe "#send push notification" do
#       before(:each) do
#         company = Company.new(name:"google",email:"google@gmail.com")
#         company.hr_code = "a3lLl2"
#         company.employee_code = SecureRandom.alphanumeric(7)
#         company.save
#         account = AccountBlock::Account.create(first_name: "Shrikant", last_name: "Dubey", full_phone_number: "918055859955", country_code: 91, phone_number: 8055859955, activated: true, device_id: "12983456", unique_auth_id: 12, password_digest: "$2a$12$lp", status: "regular", role_id: BxBlockRolesPermissions::Role.find_by_name("hr").id, full_name: "Demoname", access_code: "a3lLl2", privacy_setting: {:chat_message => "true"})

#         notify = BxBlockPushNotifications::PushNotification.new(account_id: account.id, push_notificable_type: "AccountBlock::Account", push_notificable_id: account.id, is_read: true, remarks: "this is a good chat", notify_type: "chat_message")
#         notify.save
#       end
      
#       let(:push_notification) {BxBlockPushNotifications::PushNotification.last}

#       context "With valid FCM key" do
#         it "returns success message" do          
#           ENV['FCM_SEVER_KEY'] = 'AAAAD0jZVj4:APA91bGItqEdU6D10bq_b0MfmXUq6r0gdI-7Q7qcGwjpN4VthfXSFK0-QMQugF4CqKRySYD09gL4lQziv2QTTAEdx1qzF0lkQ0Eca-uqd7yQuuFW1KlIs3m-xMnxwspkJBqlWNNB-anT'
#           reponse = push_notification.send_push_notification
#           expect(reponse[:response]).to eq("success")
#           expect(reponse[:status_code]).to eq(200)
#         end
#       end

#       context "With invalid FCM key" do
#         it "returns error message" do
#           ENV['FCM_SEVER_KEY'] = ''
#           reponse = push_notification.send_push_notification
#           expect(reponse[:response]).to eq("There was an error authenticating the sender account.")
#           expect(reponse[:status_code]).to eq(401)
#         end
#       end
#   end
# end
