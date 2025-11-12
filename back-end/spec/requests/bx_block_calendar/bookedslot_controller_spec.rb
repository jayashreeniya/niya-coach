require 'swagger_helper'
require 'rails_helper'
require 'dotenv'
Dotenv.load('.env.local')
NO_BOOKING = "No bookings".freeze

RSpec.describe BxBlockCalendar::BookedSlotsController, type: :request do
  describe "calender controller" do
    VAR000=URI.encode("http://www.example.com/bx_block_calendar/booked_slots")
    VAR001=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/view_coach_availability")
    VAR2=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/cancelled_booked_slots")
    VAR3=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/coach_with_upcoming_appointments")
    VAR4=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/coach_with_past_appointments")
    VAR5=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/user_appointments")
    VAR6=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/video_call")
    VAR7=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/user_action_item")
    VAR8=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/current_coach")
    VAR9=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/past_coach")
    VAR10=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/cancel_booking")
    VAR011=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/all_slots")
    VAR012=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/booked_slot_details")
    VAR013=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/coach_past_appointments")
    VAR014=URI.encode("http://www.example.com/bx_block_calendar/booked_slots/coach_upcoming_appointments")
   
    
    Date_Format = "%d/%m/%Y"
    
    
    # start_time, end_time = (hour = rand(6..22)) && ["%02d:00" % hour, "%02d:59" % hour]
    let(:account){Support::SharedHelper.new.current_user}
    let(:headers) { { "token" => BuilderJsonWebToken::JsonWebToken.encode(account.id) } }
    let(:question){BxBlockAssessmenttest::AssesmentTestQuestion.find_or_create_by!(title: 'testing')}
    let(:answer){BxBlockAssessmenttest::AssesmentTestAnswer.find_or_create_by!(assesment_test_question_id: question.id ,answers: "tesing", title: "testing")}
    let(:que_test_type){BxBlockAssessmenttest::AssesmentTestType.find_or_create_by(question_title: "testing", test_type: nil, sequence_number: nil, assesment_test_answer_id: answer.id)}
    let(:test_type_answer){ BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_or_create_by(assesment_test_type_id: que_test_type.id, title: nil, answers: "testing", test_type_id: nil)}
    let(:devtoken){UserDeviceToken.create(account_id: account.id, device_token: "cabcddcds123")}
    let(:coach){Support::SharedHelper.new.create_coach_account}
    let(:headers1) { { "token" => BuilderJsonWebToken::JsonWebToken.encode(coach.id) } }
    let(:coach1){Support::SharedHelper.new.create_coach_account}
    let(:coach3){Support::SharedHelper.new.create_coach_account}
    let(:headers2) { { "token" => BuilderJsonWebToken::JsonWebToken.encode(coach1.id) } }
    let(:date){DateTime.parse(Date.today.to_s).strftime(Date_Format)}
    let(:date1){DateTime.parse((Date.today + 1).to_s).strftime(Date_Format)}
    let(:date2){DateTime.parse((Date.today + 4).to_s).strftime(Date_Format)}

    # {BxBlockAppointmentManagement::BookedSlot.new(start_time: "20:00", end_time: "20:59", service_provider_id: account.id, booking_date: date1,  service_user_id: account.id, meeting_code: "as12s3")}
    let(:body) {JSON.parse(response.body)}
    let(:book) do
      {
          start_time: "20:00",
          end_time: "20:59",
          service_provider_id: coach.id,
          booking_date: date1
      }
    end
    let(:book2) do
      {
          start_time: "20:15",
          end_time: "21:14",
          service_provider_id: coach1.id,
          booking_date: date2
      }
    end
    
    before do
      BxBlockAssessmenttest::AssesmentTestQuestion.destroy_all
      BxBlockAssessmenttest::AssesmentTestAnswer.destroy_all
      BxBlockAssessmenttest::AssesmentTestType.destroy_all
      BxBlockAssessmenttest::AssesmentTestTypeAnswer.destroy_all
    end

    context "index" do
      it "should return response 200 in index method" do
        get VAR011
        expect(response).to have_http_status(200)
      end

      it "should return response 200 in index method" do
        Support::SharedHelper.new.booked_slot
        get VAR012
        expect(response).to have_http_status(422)
      end

      it "should return response availability in index" do
        # Support::SharedHelper.new.view_coach_availability
        get VAR000 , headers: headers
        expect(JSON.parse(response.body)['errors'][0]['availability']).to eq(NO_BOOKING)
      end

      it "should return response 422 in index" do
        get VAR000 , headers: headers
        expect(response).to have_http_status(422)
      end
    end

    context "create" do
      it "should return response 201 in create" do
        Support::SharedHelper.new.view_coach_availability
        post VAR000 ,params: {booked_slot: book, booking_date: date, start_time: "20:00"} ,headers: headers
        expect(body).not_to be_empty
      end
      it "should execute else block in create" do
        post VAR000 ,params: {booked_slot: book, booking_date: date, start_time: "20:00"}, headers: headers
        post VAR000 ,params: {booked_slot: book2, booking_date: date2, start_time: "20:15"} , headers: headers
        expect(response).to have_http_status(422)
      end
    end

    context "view coach availability" do
      before do
        BxBlockAssessmenttest::SelectAnswer.create(assesment_test_type_id: que_test_type.id ,assesment_test_type_answer_ids: [test_type_answer.id],account_id: account.id,multiple_answers: [test_type_answer.id])
        Support::SharedHelper.new.view_coach_availability
      end
      it "should return true in coach availabity" do
        CoachSpecialization.create(expertise: "testing" ,focus_areas: [test_type_answer.id])
        get VAR001 ,params: {booking_date: date, per_page: 1, page: 1 },headers: headers
        expect(response).to have_http_status(200)
      end

      it "should return false in coach availability" do
        CoachSpecialization.create(expertise: "testing" ,focus_areas: [test_type_answer])
        get VAR001 ,params: {booking_date: "20/01/2023", per_page: 1, page: 1 },headers: headers
        expect(response).to have_http_status(200)
      end
    end

    context "cancelled_booked_slots" do
      it "cancelled_booked_slots" do
        get VAR2 ,headers: headers
        expect(response).to have_http_status(200)
      end
    end



    

    context "coach_with_upcoming_appointments" do
      it "coach_with_upcoming_appointments" do
        get VAR3 ,headers: headers , params: {service_provider_id: coach.id}
        expect(response).to have_http_status(200)
      end
      it "coach_with_upcoming_appointments else part" do
        get VAR3 , params: {service_provider_id: coach.id}
        expect(response).to have_http_status(400)
      end
    end

    context "coach_upcoming_appointments" do
      it "coach_upcoming_appointments" do
        availability = BxBlockAppointmentManagement::Availability.new(start_time: "06:00", end_time: "23:00", 
          availability_date: DateTime.parse((Date.today + 2).to_s).strftime(Date_Format), 
          service_provider_id: coach3.id) 
        availability.save(validate: false)
        book_appointment = BxBlockAppointmentManagement::BookedSlot.new(start_time: "#{DateTime.parse((Date.today + 2).to_s).strftime(Date_Format)} 18:00",
         end_time: "#{DateTime.parse((Date.today + 2).to_s).strftime(Date_Format)} 18:14",
          service_provider_id: coach3.id,
           booking_date: DateTime.parse((Date.today).to_s).strftime(Date_Format),
             service_user_id: account.id, meeting_code: "as12s3")
        book_appointment.save(validate: false)
        coach3.update(role_id: BxBlockRolesPermissions::Role.find_by_name(:coach).id)
        get VAR014 ,headers: headers1
        expect(response).to have_http_status(200)
      end
    end

    context "coach_past_appointments" do
      it "coach_past_appointments" do
        availability = BxBlockAppointmentManagement::Availability.new(start_time: "06:00", end_time: "23:00", 
          availability_date: DateTime.parse((Date.today - 2).to_s).strftime(Date_Format), 
          service_provider_id: coach3.id) 
        availability.save(validate: false)
        book_appointment = BxBlockAppointmentManagement::BookedSlot.new(start_time: "#{DateTime.parse((Date.today - 2).to_s).strftime(Date_Format)} 18:00",
         end_time: "#{DateTime.parse((Date.today - 2).to_s).strftime(Date_Format)} 18:14",
          service_provider_id: coach3.id, 
          booking_date: DateTime.parse((Date.today - 4).to_s).strftime(Date_Format),  
          service_user_id: account.id, meeting_code: "as12s3")
        book_appointment.save(validate: false)
        coach3.update(role_id: BxBlockRolesPermissions::Role.find_by_name(:coach).id)
        get VAR013 ,headers: headers1
        expect(response).to have_http_status(200)
      end
    end

    context "coach_with_past_appointments" do
      it "coach_with_past_appointments" do
        get VAR4 ,headers: headers , params: {service_provider_id: coach.id}
        expect(response).to have_http_status(200)
      end
      # it "coach_with_past_appointments" do
      #   get VAR013 ,headers: headers1 
      #   expect(response).to have_http_status(422)
      # end
      it "coach_with_past_appointments else part" do
        get VAR4 , params: {service_provider_id: coach.id}
        expect(response).to have_http_status(400)
      end
    end

    context "video_call" do
      it "video_call" do
        post VAR000 , params: {booked_slot: book, booking_date: date, start_time: "21:00"} , headers: headers
        BxBlockAppointmentManagement::Availability.create(start_time: "06:00", end_time: "23:00", availability_date: DateTime.parse((Date.today + 2).to_s).strftime(Date_Format), service_provider_id: coach3.id) 

        booked_slot = BxBlockAppointmentManagement::BookedSlot.create( start_time: "#{Date.today.strftime("%d/%m/%Y")} 06:00", end_time: "#{Date.today.strftime("%d/%m/%Y")} 06:59", service_provider_id: coach3.id, service_user_id: account.id, booking_date: DateTime.parse((Date.today + 2).to_s).strftime(Date_Format), meeting_code: "as12s3" )

        get VAR6 ,headers: headers ,params: {booked_slot_id: booked_slot.id}
        expect(response.status).to eq(422)
        expect(JSON.parse(response.body).dig('errors')).to eq("Booked slot id should present")
      end
    end 

    context "user_action_item" do
      it "user_action_item" do
        post VAR7, headers: headers ,params:{service_user_id: account.id} 
        expect(response).to have_http_status(200)
      end
    end

    context "current_coach" do
      it "slots presnt" do
        Support::SharedHelper.new.view_coach_availability
        post VAR000 , params: {booked_slot: book, booking_date: date, start_time: "20:00"} , headers: headers
        get VAR8 ,headers: headers
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body).dig('data')).to be_present
      end

      it "current_coach slots not present" do
        get VAR8 ,headers: headers
        get VAR9 ,headers: headers 
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body).dig("errors", 0, 'availability')).to eq(NO_BOOKING)
      end
    end

    context "past_coach" do
      it "slots presnt" do
        Support::SharedHelper.new.view_coach_availability
        post VAR000 , params: {booked_slot: book, booking_date: date, start_time: "20:00"} , headers: headers
        get VAR9 ,headers: headers
        expect(response).to have_http_status(200)
        expect(JSON.parse(response.body)).to eq({"data"=>[]})
      end

      it "past_coach slots not present" do
        get VAR9 ,headers: headers 
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body).dig("errors", 0, 'availability')).to eq(NO_BOOKING)
      end
    end

    context "cancel_booking" do
      it "cancel_booking" do
        post VAR10 , headers: headers
        expect(response).to have_http_status(422)
        expect(JSON.parse(response.body).dig("error")).to eq("Booked slot not found")
      end
    end
  end
end
