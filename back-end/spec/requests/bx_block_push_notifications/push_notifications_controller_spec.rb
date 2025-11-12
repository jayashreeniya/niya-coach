require 'rails_helper'

RSpec.describe "BxBlockPushNotifications::PushNotifications", type: :request do

account = Support::SharedHelper.new.get_coach_user

    let(:device_token_param){
    {
        id: account.id,
        device_token: "12983456"
    }
   }
   let(:errors_params){
	   {
	   id: 17, account_id: 3, device_token: "12983456", created_at: "2022-12-29 05:02:56", updated_at: "2022-12-29 05:02:56"
	   }
     }
   let(:send_notification_params){
	   {
	   device_token: "12983456"
	   }
      }
   let(:send_notification_error){
	   {
	   device_token: nil
	   }
     }
	before(:each) do
	    admin_role = Support::SharedHelper.new.admin_role
	    coach_role = Support::SharedHelper.new.coach_role
	    @token = Support::SharedHelper.new.get_token
	    @admin_token =   Support::SharedHelper.new.get_admin_token
	end
   describe '#device_token' do
	   it 'should show device token' do
	      post '/bx_block_push_notifications/device_token', params: device_token_param, headers: {token: @token}
	      expect(response).to have_http_status(200)
	   end
	   it 'should create device token' do
	      post '/bx_block_push_notifications/device_token',params: errors_params, headers: {token: @token}
	      expect(response).to have_http_status(200)
	   end
   end
   describe '#send_notification' do
      it 'should send notification' do
         post '/bx_block_push_notifications/send_notifications', params: send_notification_params, headers: {token: @token}
         expect(response).to have_http_status(200)
      end
   end
end
