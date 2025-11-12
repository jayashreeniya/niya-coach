require 'swagger_helper'
require 'dotenv'
Dotenv.load('.env.local')
VAR = "/bx_block_sharecalendar/booked_slots"
VAR1 = "/bx_block_sharecalendar/booked_slots/coach_availability"
TYPE = 'application/json'
RSpec.describe BxBlockSharecalendar::BookedSlotsController, type: :request do
  let(:coach){Support::SharedHelper.new.create_coach_account}
  let(:date){DateTime.parse(Date.today.to_s).strftime("%d/%m/%Y")}
  let(:book) do
    {
        start_time: "16:00",
        end_time: "16:59",
        service_provider_id: coach.id,
        booking_date: date
    }
  end
  before do
    account =  Support::SharedHelper.new.current_user 
    @token = BuilderJsonWebToken.encode(account.id)
    BxBlockAssessmenttest::AssesmentTestQuestion.destroy_all
    BxBlockAssessmenttest::AssesmentTestAnswer.destroy_all
    BxBlockAssessmenttest::AssesmentTestType.destroy_all
    BxBlockAssessmenttest::AssesmentTestTypeAnswer.destroy_all
  end
  path VAR do
    get 'share calender booked slot #index & #create' do
      tags "booked slot"
      produces TYPE
      parameter name: :token, in: :header, type: :string, description: "booked slot index"
      
      response '422', 'booked_slot' do
        let(:token) { @token }
        it "should return response 422 in index method" do
          get VAR , params: {token: token}

          expect(response).to have_http_status(200)
          expect(JSON.parse(response.body)).to eq({"data"=>[nil]})
        end

        it "should return response 200 in index & 201 in create " do
          Support::SharedHelper.new.view_coach_availability
          post VAR , params: {token: token , booked_slot: book, booking_date: date, start_time: "16:00"} 
          expect(response).to have_http_status(200)
          expect(JSON.parse(response.body)).to eq({"data"=>[nil]})

          get VAR , params: {token: token, date: date} 
          expect(response).to have_http_status(200)
          expect(JSON.parse(response.body)).to eq({"data"=>[nil]})
        end

        it "should execute else block in create" do
          post VAR ,params: {token: token ,booked_slot: book} 
          expect(response).to have_http_status(200)
          expect(JSON.parse(response.body)).to eq({"data"=>[nil]})
        end
        
        run_test!
      end
    end
  end

  path VAR1 do
    get 'share calender booked slot #coach_availability' do
      tags "booked slot"
      produces TYPE
      parameter name: :token, in: :header, type: :string, description: "booked slot coach availability"
      
      response '200', 'booked_slot coach availability' do
        let(:question){BxBlockAssessmenttest::AssesmentTestQuestion.find_or_create_by!(title: 'testing')}
        let(:answer){BxBlockAssessmenttest::AssesmentTestAnswer.find_or_create_by!(assesment_test_question_id: question.id ,answers: "tesing", title: "testing")}
        let(:que_test_type){BxBlockAssessmenttest::AssesmentTestType.find_or_create_by(question_title: "testing", test_type: nil, sequence_number: nil, assesment_test_answer_id: answer.id)}
        let(:test_type_answer){ BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_or_create_by(assesment_test_type_id: que_test_type.id, title: nil, answers: "testing", test_type_id: nil)}
        let(:devtoken){UserDeviceToken.create(account_id: account.id, device_token: "cabcddcds123")}
        let(:token) { @token }
        before do
          account =  Support::SharedHelper.new.current_user
          BxBlockAssessmenttest::SelectAnswer.create(assesment_test_type_id: que_test_type.id ,assesment_test_type_answer_ids: [test_type_answer.id],account_id: account.id,multiple_answers: [test_type_answer.id])
          Support::SharedHelper.new.view_coach_availability
        end
        it "should return true in coach availabity" do
          CoachSpecialization.create(expertise: "testing" ,focus_areas: [test_type_answer.id])
          get VAR1 ,params: {token: token ,booking_date: date}
          expect(response).to have_http_status(200)
        end
        it "should return false in coach availability" do
          CoachSpecialization.create(expertise: "testing" ,focus_areas: [test_type_answer])
          get VAR1 ,params: {token: token ,booking_date: "20/01/2023"}
          expect(response).to have_http_status(200)
        end
        run_test!
      end
    end
  end
end
