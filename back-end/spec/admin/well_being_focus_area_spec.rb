require 'rails_helper'

RSpec.describe Admin::WellBeingFocusAreasController, type: :controller do
  render_views

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @wc=WellBeingCategory.create(id: 5, category_name: "Financial Wellbeing")
    @wsc = WellBeingSubCategory.create(id: 20,sub_category_name: "test string", well_being_category_id: @wc.id)
    @wfa = BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by( answers: "string", well_being_sub_categoryid: @wsc.id)
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
      get :show ,params:{id: @wfa.id}
      expect(response).to have_http_status(:success)
    end
  end
end