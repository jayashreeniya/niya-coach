require 'rails_helper'

RSpec.describe Admin::EmotionQuestionsController, type: :controller do
  render_views

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @motion = BxBlockAssessmenttest::Motion.find_or_create_by(motion_title: "hello")
    @motion_question = BxBlockAssessmenttest::MotionQuestion.find_or_create_by(emo_question: "hello test?", motion_id: @motion.id)
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
      get :show ,params:{id: @motion_question.id}
      expect(response).to have_http_status(:success)
    end
  end
end