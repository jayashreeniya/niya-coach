require 'rails_helper'

RSpec.describe Admin::WellBeingCategoriesController, type: :controller do
  render_views

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @wc=WellBeingCategory.create(id: 5, category_name: "Financial Wellbeing")
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
  
  describe "GET #show" do
    it "returns a success response" do
      # @ans = UserAnswerResult.find_or_create_by(id: 2)
      get :show ,params:{id: @wc.id}
      expect(response).to have_http_status(:success)
    end
  end
end