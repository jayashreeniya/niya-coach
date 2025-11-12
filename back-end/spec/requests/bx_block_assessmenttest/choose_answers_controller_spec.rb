require 'rails_helper'

RSpec.describe "BxBlockAssessmenttest::ChooseAnswersController", type: :request do
  before(:all) do
     @token = Support::SharedHelper.new.get_token
     account_id = (BuilderJsonWebToken.decode @token).id
     Support::SharedHelper.new.create_data


     question = BxBlockAssessmenttest::AssesmentTestQuestion.create(title: "test")
     answers  = question.assesment_test_answers.create(answers: "test ansers")

     question2 = BxBlockAssessmenttest::AssessYourselfQuestion.create(question_title: "test")
     answers2  = question2.assess_yourself_answers.create(answer_title: "test ansers")

     BxBlockAssessmenttest::ChooseAnswer.create(account_id: account_id, 
                                                assesment_test_question_id: question.id,
                                                assesment_test_answer_id: answers.id,
                                                assesment_test_type_answer_id: 1, 
                                                assesment_test_type_id: 1)

     BxBlockAssessmenttest::AssessYourselfChooseAnswer.create(assess_yourself_question_id: question2.id, 
                                                              assess_yourself_answer_id: answers2.id, 
                                                              toatal_score: 23, 
                                                              account_id: account_id)
  end
 
    describe '#index' do
      context 'get your the answers' do
        it 'should pass when create  assess select answers successfully' do
          get '/bx_block_assessmenttest/choose_answers', headers: { token: @token}
          expect(response).to have_http_status :ok
          expect(JSON.parse(response.body)["data"].present?).to eq(true)
        end
     end 
  end
end
