require 'rails_helper'

RSpec.describe "AccountBlock::RatingsController", type: :request do
 before(:each) do
    admin_role = Support::SharedHelper.new.admin_role
    coach_role = Support::SharedHelper.new.coach_role
    hrrole = Support::SharedHelper.new.hr_role
    emprole = BxBlockRolesPermissions::Role.find_by(name: 'employee')
    # hrrole = FactoryBot.create(:role, name: 'hr')
    @token = Support::SharedHelper.new.get_token
    @admin_token =   Support::SharedHelper.new.get_admin_token
    account = Support::SharedHelper.new.admin_user
    company = FactoryBot.create(:company, id: rand(1..1000))
    @account_hr = FactoryBot.create(:hr_account, role_id: hrrole.id, access_code: company.hr_code, id: rand(1..1000))
    @account_emp = FactoryBot.create(:hr_account, role_id: emprole.id,access_code: company.employee_code)
    @account_coach = FactoryBot.create(:hr_account, role_id: coach_role.id,access_code: company.employee_code, id: rand(100..1000))
    @token1 = BuilderJsonWebToken.encode(@account_hr.id)
    @token2 = BuilderJsonWebToken.encode(@account_emp.id)
   end
   let(:create_param){{
    rating:{
   	coach_rating: 3.5,
    coach_id: @account_coach.id
   }
  }
 }

 let(:update_param){{
    account:{
    email: "test@mail.com",
    first_name: "test"
   }
  }
 }
 let(:create_error_param){{
    rating:{
    coach_rating: 3.5
   }
  }
 }
 let(:coach_rating_param){{rating: {

    coach_id: 2,
    coach_rating: 7,
    app_rating: 7
   }
  }
 }
  let(:all_user_feedbacks_params){{rating: {
    coach_id: 2,
    account_id: 2,
    app_rating: 7
   }
  }
 }
  describe "#create" do
    create = '/account_block/ratings'
    it 'should create ' do
      post create, params: create_param, headers: {token: @token2}
      expect(response).to have_http_status(200)   
    end

    it 'should show error' do
      post create, params: create_error_param, headers: {token: @token}
      expect(response).to have_http_status(422)
      expect(JSON.parse(response.body).dig('errors')).to eq("coach_id must be present")
    end

    it 'should check if coach and rating is present' do
     post create, params: coach_rating_param, headers: {token: @token}
     expect(response).to have_http_status(200)
    end
  end

  describe "#all_users_feedbacks" do
   it 'should show all user ' do
    get '/account_block/all_users_feedbacks', params: all_user_feedbacks_params, headers: {token: @token}
    expect(response).to have_http_status(200)
   end
  end

  describe "#user_feedback" do
   it 'should show user feedback' do
    get '/account_block/user_feedback', headers: {token: @token}
    expect(response).to have_http_status(200)
   end
  end
  
  describe "#update" do
   it 'should update user feedback' do
    put '/account_block/accounts', headers: {token: @token}, params: update_param
    expect(response).to have_http_status(200)
   end
  end

  describe "#get_hr_details" do
   it 'should show hr details' do
    get '/account_block/accounts/get_hr_details', headers: {token: @token1}
    expect(response).to have_http_status(200)
   end
  end

  describe "#delete_ratings" do
    it "should delete users ratings" do 
      delete '/account_block/delete_ratings', headers: {token: @token}
      expect(response).to have_http_status(200)
    end
  end
end