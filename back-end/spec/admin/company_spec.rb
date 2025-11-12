require 'rails_helper'

RSpec.describe Admin::CompaniesController, type: :controller do
  render_views

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @company = Company.create(id: rand(1..1000), name: [*('A'..'Z')].sample(6).join, email: "itc#{rand(0.99)}@gmail.com", address: "newDelhi12", hr_code: SecureRandom.alphanumeric(6), employee_code: SecureRandom.alphanumeric(7))
    @emp_role = BxBlockRolesPermissions::Role.find_by_name(:employee)
    BxBlockRolesPermissions::Role.create(id: 3,name: "employee") if @emp_role.nil?
    @hr_role = BxBlockRolesPermissions::Role.find_by_name(:hr)
    BxBlockRolesPermissions::Role.create(id: 2,name: "hr") if @hr_role.nil?

    # AccountBlock::Account.create(id: 112, first_name: nil, last_name: nil, full_phone_number: "917907617765", country_code: 91, phone_number: 7901817765, email: "hr1@gmail.com", activated: true, device_id: nil, unique_auth_id: nil, password_digest: "sdfasfefqwr3wr3fwf", type: "EmailAccount", created_at: CREATED_AT, updated_at: UPDATED_AT, user_name: nil, platform: nil, user_type: nil, app_language_id: nil, last_visit_at: nil, is_blacklisted: false, suspend_until: nil, status: "regular", stripe_id: nil, stripe_subscription_id: nil, stripe_subscription_date: nil, role_id: 5, full_name: "coach2222", gender: nil, date_of_birth: nil, age: nil, is_paid: false, access_code: comp.hr_code, rating: nil, city: nil, expertise: "[\"Stress\"]", education: nil) 
    @account = AccountBlock::Account.create(full_name: "assess user",email:"assess1@gmail.com",full_phone_number: "919068083863", password: "Admin@1234",password_confirmation: "Admin@1234", activated: true,access_code: @company&.employee_code,role_id: BxBlockRolesPermissions::Role.find_by_name(:employee).id)
    @hr=AccountBlock::Account.create(full_name: "assess user",email:"assess2@gmail.com",full_phone_number: "919098083864", password: "Admin@123",password_confirmation: "Admin@123", activated: true,access_code: @company&.hr_code,role_id: BxBlockRolesPermissions::Role.find_by_name(:hr).id)
    sign_in @admin_user 
  end
  describe "GET #index" do
    it "listing index successfully" do
      get :index
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #new" do
    it "new successfully" do
      get :new
      expect(response).to have_http_status(:ok)
    end

  end

  describe "DELETE #destroy" do
  it "delete" do
    delete :destroy ,params: {id: @company.id}
    expect(response).to have_http_status(:found)
  end

end

  describe "GET #show" do
    it "returns a success response" do
      get :show ,params:{id: @company.id}
      expect(response).to have_http_status(:success)
    end
    it "returns a success response" do
      get :show ,params:{id: @company.id ,hr_name: "assess" ,employee_name: "assess"}
      expect(response).to have_http_status(:success)
    end
    
  end
  
end