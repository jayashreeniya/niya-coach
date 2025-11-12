require 'rails_helper'

RSpec.describe Admin::CoachesController, type: :controller do
  render_views
  STRFTIME_FORMAT="%d/%m/%Y"
  PASS = "Rails@321"
  Type = 'email_account'

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    # @account=Support::SharedHelper.new.get_coach_user
    sign_in @admin_user 
    coachrole = BxBlockRolesPermissions::Role.find_by(name: "coach")
    @coach_account = AccountBlock::EmailAccount.new(full_name: "test", email: "ram1#{rand(0000..9999)}shree@gmail.com", full_phone_number: "91#{rand(10**10)}", password: PASS, password_confirmation: PASS, expertise: ["tata"]) 
      @coach_account&.save(validate: false)
      @coach_account.update(role_id: coachrole.id)
      @coach_account1 = AccountBlock::EmailAccount.new(full_name: "test", email: "ram1#{rand(0000..9999)}shree@gmail.com", full_phone_number: "91#{rand(10**10)}", password: PASS, password_confirmation: PASS, expertise: ["tata"], role_id: coachrole.id)
      @coach_account1.save(validate: false)
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

  describe "post #new" do
    it "new successfully" do
      post :new
      expect(response).to have_http_status(:ok)
    end
    it "returns a success when edit" do
      put :edit ,params:{id: @coach_account.id}
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #show" do
    it "returns a success show response" do
      get :show ,params:{id: @coach_account.id}
      expect(response).to have_http_status(:success)
    end    
  end

  describe "delete #delete" do
    it "returns a success response" do
      delete :destroy ,params:{id: @coach_account.id}
      expect(response).to have_http_status(302)
    end
  end

  describe '#create' do
    context 'when account type is email account' do
      let(:valid_params) do
        {
          account: {
            type: Type,
            full_name: 'John Doe',
            email: 'john@example.com',
            full_phone_number: '911234567890',
            password: PASS,
            password_confirmation: PASS,
            expertise: ['expertise1', 'expertise2'],
            user_languages_attributes: { '0': {
             language:   "english" } }
          }
        }
      end

      let(:invalid_params) do
        {
          account: {
            type: Type,
            full_name: 'John',
            email: 'john@example.com',
            full_phone_number: @coach_account.full_phone_number,
            password: PASS,
            password_confirmation: PASS
          }
        }
      end

      it 'create a new email account' do
          post :create, params: valid_params
          expect(response).to have_http_status(302)
      end
      
      it 'showing an validation faild message' do
          post :create, params: invalid_params
          expect(response).to have_http_status(422)
      end

      it "delete successfully" do
        delete :destroy ,params:{id: @coach_account.id}
        expect(response).to have_http_status(302)
      end
    end

    describe '#update' do
      context 'update time slots' do
        let(:update_params) do
          {
            id: @coach_account1.id,
            account: {
              email: @coach_account.email
            }
          }
        end
          let(:updt_params) do
          {
            id: @coach_account.id,
            account: {
              email: @coach_account.email
            }
          }
        end

        it 'it will render error message ' do
            put :update, params: update_params
            expect(response).to have_http_status(422)
        end

        it 'it will update time slots' do
            put :update, params: updt_params
            expect(response).to have_http_status(422)
        end
      end
    end
  end
end
