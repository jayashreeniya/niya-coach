require 'rails_helper'

RSpec.describe "BxBlockWellbeing::WellBeings", type: :request do  
  # @get_data = Support::SharedHelper.new.create_wellbeing
   # @category = Support::SharedHelper.new.create_wellbeing.category
   # let(:category) { WellBeingCategory.create(category_name: 'category_name') }
  before(:all) do

    @token = Support::SharedHelper.new.get_token
    @account=Support::SharedHelper.new.current_user
    @get_data = Support::SharedHelper.new.create_wellbeing
    @category =
    @wellbeing_report = WellbeingScoreReport.create(category_id: 1, account_id: @account.id, category_result: {"category_name"=>"Physical", "score"=>21, "question_count"=>5, "percentage"=>42, "advice"=>"No significant stress around Money", "submitted_at"=>Date.today , "score_level"=>"high", "profile_type"=>nil}, sub_category_result: [{"sub_category"=>"Physical", "score"=>21, "question_count"=>5, "percentage"=>42}], "submitted_at"=> Date.today)
  end


  let(:get_param){
    {
      question_id: 2,
      answer_id: 2
    }
  }
  let (:question_params){
    {
       question_id: 2,
       answer_id: 2,
       id: 2
    }
  }
  let (:ques_params){
    {
       question_id: 2,
       answer_id: 2,
       id: 2,
       category_id:1,
       category_name: "testdemo"
    }
  }

 
  # let(:wrong_param) {{
  #   question_id: 0,
  #   answer_id: 12
  # }}

  describe "#index" do
    it "returns http success" do
      category_id = WellBeingCategory.create(category_name: 'category_name', id: rand(1..1000))
      ques = QuestionWellBeing.create(question:"this is question 4 category 1 subcategory 4", category_id: category_id, subcategory_id:4)
      user_answer =  UserQuestionAnswer.create!(account_id: @account.id, question_id: 1, answer_id: 1)
      get '/bx_block_wellbeing/well_beings?category_id=1',  headers: { token: @token}
      expect(response).to have_http_status(:success)
    end

    it "returns http not success" do
      get '/bx_block_wellbeing/well_beings?category_id=2',  headers: { token: @token}
      expect(response).to have_http_status(:success)
    end
  end

  # describe "#get_result" do
  #   it "should return the result with params true" do
  #     get '/bx_block_wellbeing/get_result', headers: { token: @token}, params: {value: 'true'}
  #     expect(response).to have_http_status(:success)
  #   end
  #   it "should return the result with params false" do
  #     get '/bx_block_wellbeing/get_result', headers: { token: @token}, params: {value: false }
  #     expect(response).to have_http_status(:success)
  #   end
  # end

  describe "#question" do
    it "Should get question success" do
      get '/bx_block_wellbeing/question?category_id=2',params: question_params, headers: { token: @token}
      expect(response).to have_http_status(:success)
    end
  end

  describe "#question_categories" do
    it "should get question_categories success" do
      get '/bx_block_wellbeing/question_categories',params: ques_params, headers: { token: @token}
      expect(response).to have_http_status(:success)
    end  
  end

  describe "#delete_answers" do
    it "should delete questions successfully" do
      delete '/bx_block_wellbeing/delete_answers', headers: { token: @token}
      expect(response).to have_http_status(:success)
    end
  end

  describe "#get_result" do
    it "should get result successfully" do
      get '/bx_block_wellbeing/get_result?category_id=2', headers: { token: @token}, params: {value: true}
      expect(response).to have_http_status(:success)
    end
    it "should get result successfully with category id 3" do
      get '/bx_block_wellbeing/get_result?category_id=3', headers: { token: @token}, params: {value: false}
      expect(response).to have_http_status(:success)
    end
  end

  describe "#user_answer" do
    it "should get question and answer successfully" do
      post '/bx_block_wellbeing/user_answer', params: get_param, headers: { token: @token}
      expect(response).to have_http_status(:success)
    end
  end

  describe "#all_categories" do
    it 'should get all categories' do
     get '/bx_block_wellbeing/all_categories', headers: {token: @token}
     expect(response).to have_http_status(200)
    end
  end

  describe "user_strength" do
    it "should get user_strength successfully" do
      get '/bx_block_wellbeing/user_strength', headers: { token: @token}
      expect(response).to have_http_status(:success)
    end

    # it "should cover loop" do
    #   WellBeingSubCategory.where(well_being_category_id: 2).each do |sub_cate|
    #     question1=QuestionWellBeing.where(id: 2).last
    #     get '/bx_block_wellbeing/insights', headers: { token: @token}
    #     question2=QuestionWellBeing.where("category_id = ? and subcategory_id = ?", cate.id, sub_cate&.id)
    #     expect(question1).to be(question2)
    #   end
    # end
  end

  describe "insigths" do
    it "should get insigths successfully" do
      get '/bx_block_wellbeing/insights_data', headers: { token: @token}, params: {category_id: @get_data.category_id}
      expect(response).to have_http_status(:success)
    end
  end
end
