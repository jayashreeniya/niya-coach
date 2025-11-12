require 'rails_helper'

RSpec.describe "BxBlockProfile::ProfilesController", type: :request do
   before(:all) do
     @token = Support::SharedHelper.new.get_token
  end
  
  let(:update_params){{ profile_name: "raj"}}

  let(:update_bio){{ full_name: "test", email: "test@gmail.com", gender: "Male", full_phone_number: "919065032569", image: nil}}
  
    describe '#update_profile_name' do
        context 'update name' do
          it 'should pass  when update profile name successfully' do
            post "/profile_name_update", params: update_params, headers: { token: @token}
            expect(response).to have_http_status :ok
          end
       end 
   end
    describe '#profile_details' do
        context 'get profile data' do
          it 'should pass  when get  profile data successfully' do
            get '/profile_details',headers: { token: @token}
            expect(response).to have_http_status :ok
          end
       end 
   end

   describe '#profile_details' do
        context 'get profile data' do
          it 'should pass  when get  profile data successfully' do
            put '/update_profile',params: {profile: update_bio}, headers: { token: @token}
            expect(response).to have_http_status :ok
          end
       end 
   end
end

