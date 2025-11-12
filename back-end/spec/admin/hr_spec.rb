require 'rails_helper'

RSpec.describe Admin::HrsController, type: :controller do
  render_views
  STRFTIME_FORMAT="%d/%m/%Y"
  PASS = "Rails@321"

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    sign_in @admin_user 
    @company = FactoryBot.create(:company, id: rand(1..1000))
    @hrrole = BxBlockRolesPermissions::Role.find_by(name: "hr")
    # @hr_account = AccountBlock::EmailAccount.new(full_name: "test", email: "ram1#{rand(0000..9999)}shree@gmail.com", full_phone_number: "91#{rand(10**10)}", password: PASS, password_confirmation: PASS, access_code: @company.hr_code) 
    # @hr_account&.save(validate: false)
    @hr_account = FactoryBot.create(:hr_account, role_id: @hrrole.id, access_code: @company.hr_code, id: rand(1..1000))
  end

  describe "GET #index" do
    it "listing index successfully" do
      get :index
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #edit" do
    it "returns a success when edit" do
      put :edit ,params:{id: @hr_account.id}
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #show" do
    it "returns a success show response" do
      get :show ,params:{id: @hr_account.id}
      expect(response).to have_http_status(:success)
    end    
  end

  describe "delete #delete" do
    it "returns a success response" do
      delete :destroy ,params:{id: @hr_account.id}
      expect(response).to have_http_status(302)
    end
  end

  describe '#create' do
    context 'when account type is email_account' do
      let(:valid_params) do
        {
          account: {
            type: 'email_account',
            full_name: 'John Doe',
            email: 'john@example.com',
            full_phone_number: "917987576898",
            access_code: @company.hr_code,
            password: PASS,
            password_confirmation: PASS
          }
        }
      end

      it 'create a new email account' do
          post :create, params: valid_params
          expect(response).to have_http_status(302)
      end

      it "delete successfully" do
        delete :destroy ,params:{id: @hr_account.id}
        expect(response).to have_http_status(302)
      end
    end

    context 'update time slots' do 
      let(:update_params) do
        {
          id: @hr_account.id,
          account: {
            type: 'email_account',
            full_name: 'John Doe',
            email: 'john@example.com',
            full_phone_number: "91#{rand(9999999999..7999999999)}",
            access_code: @company.hr_code,
            password: PASS,
            password_confirmation: PASS
          }
        }
      end

      it 'it will update time slots' do
          put :update, params: update_params
          expect(response).to have_http_status(422)
      end
    end
  end
end
