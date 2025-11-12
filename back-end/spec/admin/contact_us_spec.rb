require 'rails_helper'

RSpec.describe Admin::ContactUsController, type: :controller do
  render_views

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @current_user=Support::SharedHelper.new.current_user
    @contact=BxBlockContactUs::Contact.find_or_create_by(account_id: @current_user.id)
    sign_in @admin_user 
  end
  describe "GET #index" do
    it "listing index successfully" do
      get :index
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      get :show ,params:{id: @contact.id}
      expect(response).to have_http_status(:success)
    end
    
  end
end