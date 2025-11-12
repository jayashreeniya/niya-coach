
require 'uri'
require 'net/http'
require 'jwt'
require 'securerandom'

module BxBlockSharecalendar
 class BookedSlotsController < ApplicationController 

   $api_key = ENV['API_KEY']
   $secret_key = ENV['SECRET_KEY']
   TIME_ZONE='Asia/Kolkata'
   TIME_FORMAT='%Y-%m-%d %H:%M:%S'
   ERR_MSG='No bookings'

   def index
    slots = BxBlockSharecalendar::BookedSlot.where(service_user_id: current_user.id,booking_date: params[:date])
    if slots&.present?
      booked_slots = []
      all_booked_slots = slots
      all_booked_slots.each do |slot|
        if Time.parse(slot.end_time).localtime > Time.strptime(Time.now.in_time_zone(TIME_ZONE).to_s, TIME_FORMAT)
          booked_slots<<slot
        end
      end
       render json: BxBlockSharecalendar::BookedSlotSerializer.new(booked_slots, params:{url: request.base_url})
    else
       render json: {errors: [
         {availability: ERR_MSG},
       ]}, status: :unprocessable_entity
    end
   end

   def create
     book_appoint = BxBlockSharecalendar::BookedSlot.new(booked_slot_params)
     book_appoint.service_user = current_user
     meeting_data = create_meetings
     book_appoint.meeting_code = meeting_data[:meetingId]
     if book_appoint.save
       availability = BxBlockAppointmentManagement::Availability.find_by("service_provider_id = ? and availability_date = ?", book_appoint.service_provider_id, book_appoint.booking_date.strftime("%d-%m-%Y").to_s.gsub("-","/"))
       availability.available_slots_count -= 1
       availability.timeslots.each_with_index do |timeslot, index|
         if Time.parse(timeslot["to"]).strftime("%H:%M")==book_appoint.end_time.split[1] and Time.parse(timeslot["from"]).strftime("%H:%M")==book_appoint.start_time.split[1]
           matched_slot = availability.timeslots[index]
           matched_slot["booked_status"] = true
           availability.timeslots[index] = matched_slot
           availability.save
           break
         end
       end
       device_token = UserDeviceToken.find_by(account_id: current_user.id)&.device_token
       fcm_client = FCM.new(ENV['FCM_SERVER_KEY'])
       options = {
         priority: "high",
         collapse_key: "updated_score",
         data: {
           type: 'booking'
         },
         notification: {
           title: "Appointment Booked",
           body: "Your appointment is booked successfully for "+Date.parse(params[:booking_date]).to_s+' at '+ Time.parse(params[:start_time]).strftime("%I:%M:%S %p")
         }
       }
       fcm_client.send(device_token, options)
       render json: BxBlockSharecalendar::BookedSlotSerializer.new(book_appoint, params: {meeting_data: meeting_data}), status: :created
     else
       error_hash = {}
       book_appoint.errors.messages.each_pair do |column_name, message|
         error_hash[column_name] = message.first
       end
       render json: {
         errors: [error_hash]
       }
     end
   end

   def coach_availability
     all_coaches=[]
     coaches = []
     test_type_answer=BxBlockAssessmenttest::SelectAnswer.where(account_id: @token.id).last
     focus_areas=BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: test_type_answer&.multiple_answers).pluck(:id).map{|x| x.to_s}
     coaches =  BxBlockAppointmentManagement::Availability.where(availability_date: params[:booking_date]) if coaches.present?
     coaches =  coaches.where('timeslots @> ?', [{"booked_status": false}].to_json) if coaches.present?
     coaches.each do |coach|
       account = AccountBlock::Account.find(coach.service_provider_id)
       all_coaches<< coach if check_coach_expertise(coach, focus_areas) and account.activated
     end
     render json: BxBlockAppointmentManagement::CheckCoachAvailabilitySerializer.new(all_coaches, params: {start_time_param: params[:start_time], url: request.base_url, focus_areas: focus_areas})
   end

   private

   def booked_slot_params
    add_time_with_date
     params.require(:booked_slot).permit(:start_time, :end_time, :service_provider_id, :booking_date)
   end

   def current_user
     return unless @token
     @current_user ||= AccountBlock::Account.find(@token.id)
   end

   def add_time_with_date
     booked_slot = params[:booked_slot]
     booked_slot[:start_time] = booked_slot[:booking_date]+" "+booked_slot[:start_time]
     booked_slot[:end_time] = booked_slot[:booking_date]+" "+booked_slot[:end_time]
   end

   def create_meetings
    BxBlockAppointmentManagement::CreateMeeting.new.call
   end

   def check_coach_expertise(object, params)
     account = AccountBlock::Account.find(object.service_provider_id)
     account.expertise = [] if account.expertise.nil?
     account.expertise.delete("") if account.expertise.include?("")
     expertise = ["specialization"].product(JSON.parse(account.expertise.to_s)).map { |a| [a].to_h}
     expertise.delete_at(0) if expertise&.first&.values&.first == ""
     expertise&.each do |exp|
      expertise_focus_areas = CoachSpecialization.where('lower(expertise) LIKE ?', "%"+exp.values.first.to_s.downcase+"%")&.last&.focus_areas
       expertise_focus_areas = expertise_focus_areas.map {|exp_fc| exp_fc.to_s} if expertise_focus_areas.present?
       if (expertise_focus_areas & params).present?
         return true
       end
     end
     return false
   end
 end
end
