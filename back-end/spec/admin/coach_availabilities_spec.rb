require 'rails_helper'

RSpec.describe Admin::CoachAvailabilitiesController, type: :controller do
  render_views
  STRFTIME_FORMAT="%d/%m/%Y"
  PASS = "Rails@321"

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    # @account=Support::SharedHelper.new.get_coach_user
    sign_in @admin_user 
    coachrole = BxBlockRolesPermissions::Role.find_by(name: "coach")
    @coach_account = AccountBlock::EmailAccount.new(full_name: "test", email: "ram1#{rand(0000..9999)}shree@gmail.com", full_phone_number: "91#{rand(10**10)}", password: PASS, password_confirmation: PASS, expertise: ["tata"]) 
      @coach_account&.save(validate: false)
      @coach_account.update(role_id: coachrole.id)
      @leave = BxBlockAppointmentManagement::CoachLeave.create(start_date: '12/11/2023', end_date: '14/11/2023', account_id: @coach_account.id)
      @avail = BxBlockAppointmentManagement::CoachParAvail.create(start_date: '18/11/2023', end_date: '20/11/2023', account_id: @coach_account.id)
      @availability = BxBlockAppointmentManagement::Availability.new(start_time: "06:00", end_time: "23:00", availability_date: Date.today.strftime(STRFTIME_FORMAT), service_provider_id: @coach_account.id)
     @availability.save(validate: false)

     slot = BxBlockSharecalendar::BookedSlot.new(start_time: "06:00" , end_time: "06:59", service_provider_id: @coach_account.id, booking_date: Date.today.strftime(STRFTIME_FORMAT), meeting_code: "as12s3")
      slot.save(validate: false)
  end
  describe "GET #index" do
    it "listing index successfully" do
      get :index
      expect(response).to have_http_status(:ok)
    end
  end 

  describe "GET #show" do
    it "returns a success show response" do
      get :show ,params:{id: @coach_account.id}
      expect(response).to have_http_status(:success)
    end    
  end

  describe "PUT #update" do
    context 'update time slots' do 
      let (:time_params) do {"from(4i)"=>"06",
                  "from(5i)"=>"00",
                  "to(4i)"=>"07",
                  "to(5i)"=>"00"}
                end
      let(:update_params) do
        {
          id: @coach_account.id,
          account: {
            coach_leaves_attributes: {'0' => {
              start_date: '30/11/2023'}},
            coach_par_avails_attributes: { '0' => {
              start_date: '19/11/2023',
              end_date: '28/11/2023',
              week_days: ['Sunday','Monday', 'Tuesday'],
              account_id: @coach_account.id,
              coach_par_times_attributes: {
                "0"=>
                  time_params
              },
            },
            '1' => {
              start_date: '16/11/2023',
              end_date: '19/11/2023',
              week_days: ['Sunday','Monday','Tuesday', 'Wednesday'],
              account_id: @coach_account.id,
              coach_par_times_attributes: { '0' => 
                time_params 
              }
            },
            '2' => {
              start_date: '17/11/2023',
              end_date: '19/11/2023',
              week_days: 'Sunday',
              account_id: @coach_account.id,
              coach_par_times_attributes: { '0' => 
                time_params 
              }
            } }
          }
        }
      end

      it 'it will update time slots' do
          put :update, params: update_params
          expect(response).to have_http_status(302)
      end
    end
  end

  describe "GET #new" do
    it 'wil intialize new object of coach' do
      get :edit, params: {id: @coach_account}
      expect(response).to have_http_status(200)
    end
  end
end
