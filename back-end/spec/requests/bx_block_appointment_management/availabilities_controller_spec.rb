require 'rails_helper'

RSpec.describe "BxBlockAppointmentManagement::AvailabilitiesController", type: :request do
  let(:index_param){
    {
        service_provider_id: 142,
        availability_date: "09-01-2023"
    }
  } 
  
  let(:error_params){
   {
    service_provider_id: "349"
   }
  }
  
  let(:error_params_1){
    {
      availability_date: "01-01-2022"
    }
  }
  
  let(:create_param){
    { 
      availability: {
      service_provider_id: 300,
      start_time:"06:00",
      end_time: "23:00",
      availability_date: "08-12-2023"
    }
   }
  }
  
  let(:create_error_params){
    { 
      availability: {
        service_provider_id: 142,
        availability_date: "09-01-2023"
      }
    }
  }
    let(:delete_params){
      {
        availability:{
        service_provider_id: 142,
        start_time:"06:00",
        end_time: "23:00",
        availability_date: "08-01-2023"
       } 
      }
    }
    let(:create_error_params){
    { availability: {
          service_provider_id: "",
          start_time:"",
          end_time: "",
          availability_date: "08-01-2023"
     }
    }
  }
  before(:each) do
      admin_role = Support::SharedHelper.new.admin_role
      coach_role = Support::SharedHelper.new.coach_role
      @token = Support::SharedHelper.new.get_token
      @admin_token =   Support::SharedHelper.new.get_admin_token
     end
  
  describe"#index" do
   it 'should show date or service provider id' do
      get '/bx_block_appointment_management/availabilities',params: index_param, headers: {token: @token}
      expect(response).to have_http_status(200)
    end
    it 'should not show the require data' do
      get '/bx_block_appointment_management/availabilities',params: error_params, headers: {token: @token}
      expect(response).to have_http_status(422)
    end
  end
  
  describe "#create" do
    # it 'should create availability' do
    #    post '/bx_block_appointment_management/availabilities', params: create_param, headers: {token: @token}
    #    expect(response).to have_http_status(200)
    # end
    it 'should not create availability and show error' do
       post '/bx_block_appointment_management/availabilities',params: create_error_params,headers: {token: @token}
       expect(response).to have_http_status(422)
    end
  end
end
