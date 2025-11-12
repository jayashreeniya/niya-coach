require 'rails_helper'

RSpec.describe "BxBlockAssessmenttest::MotionsControllers", type: :request do
  before(:all) do
     @token = Support::SharedHelper.new.get_token
     @motion = BxBlockAssessmenttest::Motion.find_or_create_by(motion_title: "hello")
     @select_motion = BxBlockAssessmenttest::SelectMotion.find_or_create_by(account_id: 1, motion_id: @motion.id)
     @motion_question = BxBlockAssessmenttest::MotionQuestion.find_or_create_by(emo_question: "hello test?", motion_id: @motion.id)
     @motion_answer = BxBlockAssessmenttest::MotionAnswer.find_or_create_by(emo_answer: "angry", motion_question_id: @motion_question.id)
  end

  describe '#create' do
    context 'create motion answers' do
      it 'should pass  when get motion details successfully' do
        post '/select_motion_answers',headers: { token: @token }, params:{ motion_question_id: @motion_question.id , motion_answer_id:  @motion_answer.id }
        expect(response).to have_http_status :created
      end
      it 'should pass  when get unprocessable entity' do
        post '/select_motion_answers',headers: { token: @token }, params:{ motion_question_id: @motion_question.id , motion_answer_id:  0 }
        expect(response.status).to eq(422)
      end
    end 
  end

  describe '#get emo_journey_status' do
    context 'get emo journey status of current user' do
      it 'should pass  when get token successfully' do
        get '/emo_journey_status',headers: { token: @token }
        expect(response.status).to eq(200)
      end
    end
  end

  describe '#create select_motion' do
    context 'create motion of user' do
      it 'should pass  when get motion successfully' do
        post '/select_motion',headers: { token: @token }, params: {motion: @motion.id}
        expect(response.status).to eq(201)
      end
    end
  end

  describe '#show' do
    context 'get motion details ' do
      it 'should pass  when get current user successfully' do
        get '/motions',headers: { token: @token }
        expect(response.status).to eq(200)
      end
    end
  end
end