require 'rails_helper'

RSpec.describe Admin::AssessYourselfTestTypeQuestionsController, type: :controller do
  render_views
  let(:que) {BxBlockAssessmenttest::AssessYourselfQuestion.find_or_create_by( question_title: "Which test do you want to take?") }
  let(:ans) {BxBlockAssessmenttest::AssessYourselfAnswer.find_or_create_by( assess_yourself_question_id: que.id, answer_title: "nice")} 
  let(:test_type) {BxBlockAssessmenttest::AssessYourselfTestType.find_or_create_by( question_title: "how are you", sequence_number: 1, assess_yourself_answer_id: ans.id)}

  before do 
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

  describe "GET #edit" do
    it "new successfully" do
      get :edit, params: {id: test_type.id }
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      get :show ,params:{id: test_type.id}
      expect(response).to have_http_status(:success)
    end
  end
end