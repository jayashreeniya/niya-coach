require 'rails_helper'

RSpec.describe "BxBlockAssessmenttest::AssessSelectAnswersController", type: :request do
  before(:all) do
     @token = Support::SharedHelper.new.get_token
     Support::SharedHelper.new.create_data
  end
 
  let(:create_param){{
     "question_id": 1,
     "sequence_number": 1,
     "answer_id": 1
}}
    describe '#create' do
      context 'create answer' do
        it 'should pass  when create  assess select answers successfully' do
          post '/bx_block_assessmenttest/assess_select_answers', params: create_param, headers: { token: @token}
          expect(response).to have_http_status :created
        end
     end 
  end
end
