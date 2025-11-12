require 'rails_helper'

RSpec.describe "BxBlockAdmin::Admins", type: :request do
  hr_role = Support::SharedHelper.new.hr_role
  account = Support::SharedHelper.new.get_coach_user
  hr_account = Support::SharedHelper.new.create_company_hr

  before(:all) do
    admin_role = Support::SharedHelper.new.admin_role
    coach_role = Support::SharedHelper.new.coach_role
    @token = Support::SharedHelper.new.get_token
    @admin_token = Support::SharedHelper.new.get_admin_token
  end

  let(:create_param){{account: {
    type: "email_account",
    full_name: "demo",
    email: "hhh@gmail.com",
    full_phone_number: "917878785643",
    password: "Rails@1234",
    password_confirmation: "Rails@1234",
    expertise: "1,2",
    image: nil
  }

}}

let(:update_param){{account: {
  id: account.id,
  full_name: "demo",
  email: "coach11@gmail.com",
  full_phone_number: "917878785643",
  password: "Rails@123",
  password_confirmation: "Rails@123",
  expertise: "1,2",
  image: nil
}

}}


let(:update_param_error){{account: {
  id: 300,
  full_name: "demo",
  email: account.email,
  full_phone_number: "917878785643",
  password: "Rails@12345",
  password_confirmation: "Rails@12345",
  expertise: "1,2",
  image: nil
}

}}


let(:get_param) {{
  id: 300
}}

let(:delete_hr_param) {{
  hr_id: 112
}}

let(:get_hr_param) {{
  hr_id: hr_account.id
}}

let(:update_hr_param) {{
   account: {
        hr_id: hr_account.id,
        full_name: "sds",
        email: 'hr2@gmail.com',
        full_phone_number:"917901817917"
    }
}}

let(:update_hr_param_error) {{
  account: {
       hr_id: hr_account.id,
       full_name: "sds",
       email: 'hr1@gmail.com',
       full_phone_number:"917901817917"
   }
}}

  # describe '#create_coach' do
  #   it 'should create coach successfully' do
  #     post '/bx_block_admin/create_coach', params: create_param, headers: { token: @token}
  #     expect(response).to have_http_status :created
  #   end
  # end

  describe '#get_coach' do
    it 'should get coach successfully' do
      get '/bx_block_admin/get_coach', params: get_param, headers: { token: @token}
      expect(response).to have_http_status(200)
    end
  end

  describe '#update_coach' do
    it 'should update coach successfully' do
      put '/bx_block_admin/update_coach', params: update_param, headers: { token: @token}
      expect(response).to have_http_status(200)
    end

    it 'should not coach updated' do
      put '/bx_block_admin/update_coach', params: update_param_error, headers: { token: @token}
      expect(response).to have_http_status(422)
    end
  end

  # describe '#get_hr' do
  #   it 'should get hr successfully' do
  #     get '/bx_block_admin/get_hr?', params: get_param, headers: { token: @admin_token}
  #     expect(response).to have_http_status(200)
  #   end
  # end

  # describe '#update_hr' do
  #   it 'should update hr successfully' do
  #     post '/bx_block_admin/update_hr', params: update_hr_param, headers: { token: @admin_token}
  #     expect(response).to have_http_status(200)
  #   end
  # end

  describe '#delete_hr' do
    it 'should delete the hr successfully' do
      delete '/bx_block_admin/delete_hr', params: delete_hr_param, headers: { token: @admin_token}
      expect(response).to have_http_status(200)
    end
  end

end
