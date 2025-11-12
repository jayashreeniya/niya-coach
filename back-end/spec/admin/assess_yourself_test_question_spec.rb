require 'rails_helper'

RSpec.describe Admin::AssessYourselfTestQuestionsController, type: :controller do
  render_views

  before do
    Support::SharedHelper.new.create_data
    @admin_user = FactoryBot.create(:admin_user)
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
      que = BxBlockAssessmenttest::AssessYourselfQuestion.find_or_create_by(id: 1, question_title: "Which test do you want to take?") 
      get :show ,params:{id: que.id}
      expect(response).to have_http_status(:success)
    end
  end
end