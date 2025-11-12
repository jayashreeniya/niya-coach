require 'rails_helper'

RSpec.describe Admin::NiyaChatBoardTestTypesController, type: :controller do
  render_views

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @que=BxBlockAssessmenttest::AssesmentTestQuestion.create(id: 3,title:'hello')
    @ans=BxBlockAssessmenttest::AssesmentTestAnswer.create(id: 2 , assesment_test_question_id: @que.id, answers: "string", title: "string1")
    @test_type = BxBlockAssessmenttest::AssesmentTestType.create(id: 4 , question_title: "string", test_type: "string", sequence_number: 1, assesment_test_answer_id: @ans.id)
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
      get :show ,params:{id: @test_type.id}
      expect(response).to have_http_status(:success)
    end
  end
end