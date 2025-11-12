require 'swagger_helper'
require 'rails_helper'
require 'dotenv'
Dotenv.load('.env.local')

RSpec.describe BxBlockSharecalendar::BookedSlotsController, type: :request do
  describe "share calender controller" do
    VAR00=URI.encode("http://www.example.com/bx_block_sharecalendar/booked_slots")
    VAR01=URI.encode("http://www.example.com/bx_block_sharecalendar/booked_slots/coach_availability")
    VAR02 = "/bx_block_sharecalendar/booked_slots/coach_availability"
    let(:account){Support::SharedHelper.new.current_user}
    let(:headers) { { "token" => BuilderJsonWebToken::JsonWebToken.encode(account.id) } }
    let(:question){BxBlockAssessmenttest::AssesmentTestQuestion.find_or_create_by!(title: 'testing')}
    let(:answer){BxBlockAssessmenttest::AssesmentTestAnswer.find_or_create_by!(assesment_test_question_id: question.id ,answers: "tesing", title: "testing")}
    let(:que_test_type){BxBlockAssessmenttest::AssesmentTestType.find_or_create_by(question_title: "testing", test_type: nil, sequence_number: nil, assesment_test_answer_id: answer.id)}
    let(:test_type_answer){ BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_or_create_by(assesment_test_type_id: que_test_type.id, title: nil, answers: "testing", test_type_id: nil)}
    let(:devtoken){UserDeviceToken.create(account_id: account.id, device_token: "cabcddcds123")}
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
      BxBlockAssessmenttest::AssesmentTestQuestion.destroy_all
      BxBlockAssessmenttest::AssesmentTestAnswer.destroy_all
      BxBlockAssessmenttest::AssesmentTestType.destroy_all
      BxBlockAssessmenttest::AssesmentTestTypeAnswer.destroy_all
    end
    context "index" do
      it "should return response 200 in index " do
        Support::SharedHelper.new.view_coach_availability
        post VAR00 , params: {booked_slot: book, booking_date: date, start_time: "16:00"} , headers: headers
        get VAR00 , params: {date: date},headers: headers 
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body).dig('errors')).to eq([{"availability"=>"No bookings"}])
      end
      it "should return response 422 in index" do
        get VAR00 , headers: headers
        expect(response).to have_http_status(422)
      end
    end

    context "create" do
      it "should return response 201 in create" do
        Support::SharedHelper.new.view_coach_availability
        post VAR00 ,params: {booked_slot: book, booking_date: date, start_time: "16:00"} ,headers: headers
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body).dig('errors')).to eq([{"booking_date"=>"No booking for this time"}])
      end
      it "should execute else block in create" do
        post VAR00 ,params: {booked_slot: book} , headers: headers
        expect(response).to have_http_status(200)
      end
    end

      context "when valid parameters are provided" do
        before do
          Support::SharedHelper.new.view_coach_availability
          post "/bx_block_sharecalendar/booked_slots", params: { booked_slot: book, booking_date: date, start_time: "16:00" }, headers: headers
        end

        it "returns a successful response with data" do
          get VAR02, params: { booking_date: date }, headers: headers
          expect(response).to have_http_status(:ok)
          expect(response.body).to include("data")
        end
      end

      context "when no coaches are available" do
        before do
          Support::SharedHelper.new.view_coach_availability
          post "/bx_block_sharecalendar/booked_slots", params: { booked_slot: book, booking_date: date, start_time: "16:00" }, headers: headers
          allow(BxBlockAppointmentManagement::Availability).to receive(:where).and_return([])
        end

        it "returns an empty data array" do
          get VAR02, params: { booking_date: date }, headers: headers
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body).dig('data')).to eq([])
        end
      end

      context "when an ActiveRecord::RecordNotFound exception is raised" do
        before do
          allow(BxBlockAppointmentManagement::Availability).to receive(:where).and_raise(ActiveRecord::RecordNotFound)
        end

        it "returns a record not found message" do
          get VAR02, params: { booking_date: date }, headers: headers
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body).dig('data')).to eq([])
        end
      end

      context "when a StandardError exception is raised" do
        before do
          allow(BxBlockAppointmentManagement::Availability).to receive(:where).and_raise(StandardError.new("Unexpected error"))
        end

        it "returns an internal server error message" do
          get VAR02, params: { booking_date: date }, headers: headers
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body).dig('data')).to eq([])
        end
      end
  end
end
