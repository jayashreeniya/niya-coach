require 'rails_helper'

RSpec.describe "BxBlockAssessmenttest::AssesmentTestQuestionsControllers", type: :request do
    before(:all) do
     @token = Support::SharedHelper.new.get_token
     Support::SharedHelper.new.create_data
  end
 
  describe '#questions' do
    context 'Get /questions' do
      it 'should pass  when fatech  questions successfully' do
        get '/bx_block_assessmenttest/assess_yourself_test_questions', headers: { token: @token}
        expect(response).to have_http_status :created
      end
   end 
end

  describe '#delete_answer' do
      context 'detete /questions answer' do
        it 'should pass  when delete  questions and answer successfully' do
          delete'/delete_answer', headers: { token: @token}
          expect(response).to have_http_status :ok
        end
      end 
    end
end
