require 'rails_helper'
require 'spec_helper'
# require 'active_admin_helper'

# include Warden::Test::Helpers

RSpec.describe  Admin::AvailabilitiesController, type: :controller do

  render_views
  before(:each) do
    @admin = AdminUser.find_or_create_by(email: 'admin@example.com')
    @admin.password = 'password'
    @coach = AccountBlock::Account.new(id: rand(1..1000), full_name: "idea coach", full_phone_number: "919098065325", activated: true, role_id: 4, expertise: ["Career Management"], password: "Rails@123")
    @coach.save(validate: false)
    @availability = BxBlockAppointmentManagement::Availability.create(service_provider_id: @coach.id, start_time: "11:00 AM", end_time: "11:59 AM", availability_date: "02/09/2024")
    # @slot =FactoryBot.create(:availability_slot) 
    @admin.save
    sign_in @admin
  end

  describe "Update#edit" do
    let(:params) do {
      service_provider_id: @coach.id,
      availability_date: "01/02/2023",
      timeslots: [{
         to: "06:59 AM",
         sno: "1",
         from: "06:00 AM",
         booked_status: false
       }]
     }
    end

    it "update availability_slot" do
      put :update, params: { id: @availability.id, availability: { service_provider_id: @coach.id, availability_date: '01/02/2023'}}
      
      expect(response).to have_http_status(:found)
    end
  end


  describe "Get#index" do
    it "show all data" do
      get :index
      expect(response).to have_http_status(200)
    end
  end

  describe "Get#show" do
    it "show profile details" do
      get :show, params: {id: @availability.id}
      expect(response).to have_http_status(200)
    end
  end
end



