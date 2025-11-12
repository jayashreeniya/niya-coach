require 'rails_helper'

RSpec.describe Admin::AssessmentScoresController, type: :controller do
  render_views

  before do
    Support::SharedHelper.new.create_data
    @admin_user = FactoryBot.create(:admin_user)
    sign_in @admin_user 
    @anxeity = BxBlockAssessmenttest::AnixetyCutoff.find_by(id: 1)
  end
  describe "GET #index" do
    it "listing index successfully" do
      get :index
      expect(response).to have_http_status(:ok)
    end 
  end

  describe "GET #show" do
    it "listing index successfully" do
      get :show, params: {id: @anxeity.id}
      expect(response).to have_http_status(:ok)
    end 
  end

  describe "GET #new" do
    it "new successfully" do
      get :new
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #edit" do
    it "new successfully" do
      get :edit, params: {id: @anxeity.id}
      expect(response).to have_http_status(:ok)
    end
  end
end