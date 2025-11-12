require 'rails_helper'

RSpec.describe Admin::AdminUsersController, type: :controller do
  render_views

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @account=Support::SharedHelper.new.admin_user
    @role = BxBlockRolesPermissions::Role.create(id: 4 ,name: "admin")
    @account.update(role_id: @role.id)
    sign_in @admin_user 
  end
  describe "GET #index" do
    it "listing index successfully" do
      get :index
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #new" do
    it "new form successfully" do
      get :new
      expect(response).to have_http_status(:ok)
    end
  end
  describe "post #create" do
    let(:valid_params) do
        {
          account: {
            type: 'sms_account',
            full_name: 'Test Niya',
            email: "niya#{rand(0.99)}@example.com",
            full_phone_number: "9154321#{rand(11111..99999)}",
            password: 'Test@1234',
            password_confirmation: 'Test@1234'
          }
        }
      end
    let(:valid_params1) do
        {
          account: {
            type: 'email_account',
            full_name: 'John Does',
            email: "john#{rand(0..999)}@example.com",
            full_phone_number: "9112#{rand(11111111..99999999)}",
            password: 'Pass@1234',
            password_confirmation: 'Pass@1234'
          }
        }
      end
    it "create validation failed " do
      post :create ,params:{account:{email: @admin_user.email, password: 'password',password_confirmation: 'password',type: "email_account"}}
      expect(response).to have_http_status(422)
    end
    # it "new successfully" do
    #   post :create ,params: valid_params
    #   expect(response).to have_http_status(302)
    # end
    it "create failed when incorrect password" do
      post :create ,params:{account:{email: @admin_user.email, password: 'Password@1234',password_confirmation: 'Password@123',type: "email_account"}}
      expect(response).to have_http_status(422)
    end
    it "new admin user created successfully" do
      AccountBlock::Account.destroy_all
      post :create ,params: valid_params1
      expect(response).to have_http_status(302)
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      get :show ,params:{id: @account.id}
      expect(response).to have_http_status(:success)
    end
  end
end