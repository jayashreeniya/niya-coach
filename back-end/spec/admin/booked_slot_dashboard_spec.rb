require 'rails_helper'

RSpec.describe Admin::SessionWiseDashboardsController, type: :controller do
  render_views
  PASS = "Rails@321"
  Type = 'email_account'

  let(:coach_role) { BxBlockRolesPermissions::Role.find_by(name: "coach") || create(:role, name: "coach") }
  let(:employee_role) { BxBlockRolesPermissions::Role.find_by(name: "employee") || create(:role, name: "employee") }
  let(:password) { "password123" }

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    sign_in @admin_user

    @coach_account = AccountBlock::EmailAccount.new(full_name: "test", email: "ram1#{rand(0000..9999)}shree@gmail.com", full_phone_number: "91#{rand(10**10)}", password: PASS, password_confirmation: PASS, expertise: ["tata"]) 
    @coach_account.save(validate: false)

    # Create coach leave and availability
    
    @avail = BxBlockAppointmentManagement::CoachParAvail.create(start_date: '18/11/2023', end_date: '20/11/2023', account_id: @coach_account.id)
    @availability = BxBlockAppointmentManagement::Availability.create(start_time: "06:00", end_time: "23:00", availability_date: Date.today.strftime("%d/%m/%Y"), service_provider_id: @coach_account.id)

    # Create a booked slot
    @booked_slot = BxBlockAppointmentManagement::BookedSlot.create(
      start_time: "#{Date.today.strftime("%d/%m/%Y")} 06:00", 
      end_time: "#{Date.today.strftime("%d/%m/%Y")} 06:59", 
      service_provider_id: @coach_account.id,
      service_user_id:  @coach_account.id,
      booking_date: Date.today.strftime("%d/%m/%Y"), 
      meeting_code: "as12s3"
    )
    @booked_slot.save(validate: false)
    # Create a video call detail associated with the booked slot
    @video_call = VideoCallDetail.create(booked_slot_id: @booked_slot.id)
    
  end

  describe "GET #index" do
    it "sets the status to 'Coach Unavailable' when the coach missed the call but the employee was present" do
      @video_call.update(coach_presence: false, employee_presence: true)

      get :index
      expect(@booked_slot.reload.status).to eq("Coach Unavailable")
      expect(response).to have_http_status(200)
    end

    it "sets the status to 'Completed (Employee did not join the video call)' when the coach was present but the employee missed the call" do
      @video_call.update(coach_presence: true, employee_presence: false)

      get :index
       expect(@booked_slot.reload.status).to eq("Completed (Employee did not join the video call)")
      expect(response).to have_http_status(200)
    end

    it "sets the status to 'Both missed the call' when both coach and employee missed the call" do
      @video_call.update(coach_presence: false, employee_presence: false)

      get :index
      expect(@booked_slot.reload.status).to eq("Both missed the call")
      expect(response).to have_http_status(:ok)
    end

    it "renders the index page successfully" do
      get :index

      expect(response).to have_http_status(:ok)
      expect(response.body).to include('Session Wise Dashboard Reports')
    end
  end
end
