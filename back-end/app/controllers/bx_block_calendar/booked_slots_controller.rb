require 'uri'
require 'net/http'
require 'jwt'
require 'securerandom'

module BxBlockCalendar
  class BookedSlotsController < ApplicationController
    include BuilderJsonWebToken::JsonWebTokenValidation
    # before_action :track_login, only: [:video_call]
    before_action :validate_time_intervals,  only: [:create]
    before_action :validating_appointments,  only: [:create]
    before_action :validate_json_web_token, except: [:all_slots, :booked_slot_details]
    before_action :validate_coach_id, only: [:user_appointments, :coach_upcoming_appointments, :coach_past_appointments]

    $api_key = ENV['API_KEY']
    $secret_key = ENV['SECRET_KEY']
    TIME_ZONE='Asia/Kolkata'
    TIME_FORMAT='%Y-%m-%d %H:%M:%S'
    ERR_MSG='No bookings'
    TIME = "%I:%M %p"

    def index
      slots = BxBlockAppointmentManagement::BookedSlot.where(service_user_id: current_user.id)
      slots = slots.where(booking_date: params[:date]) if params[:date].present?
      now = Time.parse(Time.now.in_time_zone(TIME_ZONE).strftime("%Y-%m-%d %H:%M:%S %z")) 
      booked_slots = slots.select { |slot| Time.parse(slot.end_time) > now }
           .sort_by(&:start_time)

      if slots.present?
        meeting_data = create_meetings 
        render json: BxBlockCalendar::BookedSlotSerializer.new(booked_slots, params: { meeting_data: meeting_data, url: request.base_url })
      else
        render json: { errors: [{ availability: ERR_MSG }] }, status: :unprocessable_entity
      end
    end

    def all_slots
      availability = []
      start_time = Time.new(2000, 1, 1, 6, 0, 0) 
      end_time = Time.new(2000, 1, 1, 23, 59, 59) 
      interval_minutes = 60

      current_time = start_time
      while current_time <= end_time
        from_time = current_time.strftime(TIME)
        to_time = (current_time + interval_minutes.minutes).strftime(TIME)
        itmid = (current_time.hour - 5) * 1
        availability << { itmid: itmid.to_s, fromtime: from_time, totime: to_time, booked_status: false }
        current_time += interval_minutes.minutes
      end

      render json: { time_slots: availability }, status: :ok
    end

    def validating_appointments
      appoinment_params = params[:booked_slot]
      start_time= appoinment_params[:start_time]
      book_date = appoinment_params[:booking_date]
      coach_id = appoinment_params['service_provider_id'].to_i
      booking_date_time = "#{book_date} #{start_time}"
      
      
      booked_appointment = BxBlockAppointmentManagement::BookedSlot.find_by(start_time: booking_date_time , service_user_id: current_user.id)
      return render json: { errors: [{ booking_date: "You have already booked for this time with another coach!" }] }, status: :unprocessable_entity if booked_appointment.present?
      
      coach_appointment = BxBlockAppointmentManagement::BookedSlot.find_by(start_time: booking_date_time , service_provider_id: coach_id)
      return render json: { errors: [{ booking_date: "Coach have already booked for this time with another person!" }] }, status: :unprocessable_entity if coach_appointment.present?
      
      startend_time = BxBlockAppointmentManagement::BookedSlot.where(booking_date: book_date, service_user_id: current_user.id).pluck(:start_time , :end_time)
      startend_time.map do|obj| 
        if booking_date_time.between?(obj.first, obj.second)
          return render json: { errors: [{ booking_date: "You have already booked for this time with other coach!" }] }, status: :unprocessable_entity 
        end
      end
    end

    def create
      book_appoint = BxBlockAppointmentManagement::BookedSlot.new(book_params)
      book_appoint.service_user = current_user
      meeting_data = create_meetings
      book_appoint.meeting_code = meeting_data[:meetingId]
      organisation = Company.find_by(employee_code: AccountBlock::Account.find(current_user.id).access_code)&.name
      book_appoint.organisation = organisation
      if book_appoint.save

        availability =  BxBlockAppointmentManagement::Availability.find_by(
                        service_provider_id: book_appoint.service_provider_id,
                        availability_date: book_appoint.booking_date.strftime("%d-%m-%Y").tr("-", "/"))
        # BxBlockAppointmentManagement::Availability.find_by("service_provider_id = ? and availability_date = ?",
        #  book_appoint.service_provider_id, book_appoint.booking_date.strftime("%d-%m-%Y").to_s.gsub("-","/"))

        availability.available_slots_count -= 1
        
        availability.timeslots.each_with_index do |timeslot, index|
          if timeslot["to"]== Time.parse(book_appoint.end_time.split[1]).strftime(TIME) && 
            timeslot["from"]== Time.parse(book_appoint.start_time.split[1]).strftime(TIME)
            matched_slot = availability.timeslots[index]
            matched_slot["booked_status"] = true
            availability.timeslots[index] = matched_slot
            availability.save
            break
          end
        end
        AppointmentBookedNotificationWorker.perform_async(current_user.id, params[:booking_date], params[:start_time]) ##for user
        AppointmentBookedNotificationWorker.perform_async(book_appoint&.service_provider_id, params[:booking_date], params[:start_time]) ## for coach notification
        appointment_time =  Time.zone.parse(book_appoint.start_time) - 10.minutes - (5*60*60 + 30*60)
        ## this worker will send notification before 10 mints of appnt, to user and coach .
        AppointmentNotificationWorker.perform_at(appointment_time , book_appoint.id) unless Rails.env.test?
        VideoCallDetail.create(booked_slot_id: book_appoint.id, coach: AccountBlock::Account.find(book_appoint.service_provider_id).full_name , employee: current_user.full_name)
        render json: BxBlockCalendar::BookedSlotSerializer.new(book_appoint, params: {meeting_data: meeting_data}), status: :created
      else
        error_hash = {}
        book_appoint.errors.messages.each_pair do |column_name, message|
          error_hash[column_name] = message.first
        end
        render json: {
          errors: [error_hash]
        }, status: :unprocessable_entity
      end
    end

    def cancel_booking
      role_name = BxBlockRolesPermissions::Role.find(current_user.role_id).name
    
      return render json: { error: "current user is neither employee nor coach" }, status: :unprocessable_entity unless %w[employee coach].include?(role_name)
    
      booked_slot = BxBlockAppointmentManagement::BookedSlot.find_by(id: params[:booked_slot_id])
      return render json: { error: "Booked slot not found" }, status: :unprocessable_entity unless booked_slot.present?
    
      availability = BxBlockAppointmentManagement::Availability.find_by("service_provider_id = ? and availability_date = ?", booked_slot.service_provider_id, booked_slot.booking_date.strftime("%d-%m-%Y").to_s.gsub("-","/"))
        availability.available_slots_count += 1
        availability.timeslots.each_with_index do |timeslot, index|
          if Time.parse(timeslot["to"]).strftime("%H:%M") <= booked_slot.end_time.split[1] && Time.parse(timeslot["from"]).strftime("%H:%M") >= booked_slot.start_time.split[1]
            matched_slot = availability.timeslots[index]
            matched_slot["booked_status"] = false
            availability.timeslots[index] = matched_slot
            availability.save
          end
        end
      slot = booked_slot
      if ((Time.parse(slot.start_time) - (Time.now.utc + 5*60*60 + 30*60)) > 1440*60) && booked_slot.destroy
        cancel_booked_slot = BxBlockAppointmentManagement::CancelBookedSlot.create(
          start_time: slot.start_time,
          end_time: slot.end_time,
          service_provider_id: slot.service_provider_id,
          booking_date: slot.booking_date,
          service_user_id: slot.service_user_id,
          account: current_user.id,
          role: role_name,
          booked_slot_id: slot.id
        )
    
        return render json: BxBlockCalendar::CancelSlotSerializer.new(cancel_booked_slot, params: { message: "Booked slot cancelled successfully" }), status: :ok
      else
        return render json: { error: "You can only cancel the appointment 24 hours prior to the appointment time" }, status: :unprocessable_entity
      end
    end

    def cancelled_booked_slots
      if current_user.present?
        cancel_list = BxBlockAppointmentManagement::CancelBookedSlot.where(service_user_id: current_user.id)
        return render json: BxBlockCalendar::CancelSlotSerializer.new(cancel_list.order(created_at: :desc),params: {message: 'Booked slot cancelled'}), status: :ok
      end
    end

  
    def view_coach_availability
      all_coaches = []
      begin
        focus_areas = fetch_focus_areas(current_user.id)
        clean_up_nil_timeslots
        coaches = fetch_coaches(params[:booking_date])

        coach_ids = coaches.map(&:service_provider_id).uniq
        all_coaches = filter_coaches(coach_ids, focus_areas, params[:booking_date], params[:start_time])

        pagy, all_coaches = pagy_array(all_coaches, page: params[:page_no], items: params[:per_page])
        render_coach_availability(all_coaches, pagy, focus_areas)

      rescue ActiveRecord::RecordNotFound
        render json: { status: 200, data: "Record not found." }
      rescue StandardError => e
        logger.error("Unexpected error: #{e.message}")
        render json: { status: 500, error: "Internal Server Error" }, status: :internal_server_error
      end
    end

    def current_coach
      slots = BxBlockAppointmentManagement::BookedSlot.where(service_user_id: current_user.id)
      if slots&.present?
        booked_slots=[]
        all_booked_slots = slots
        all_booked_slots.each do |slot|
          if Time.parse(slot.end_time).localtime >= Time.strptime(Time.now.in_time_zone(TIME_ZONE).to_s, TIME_FORMAT)
            booked_slots<<slot
          end
        end
        booked_slots = booked_slots.map(&:service_provider_id).uniq
        accounts = AccountBlock::Account.where(id: [booked_slots])
        render json: BxBlockCalendar::CurrentCoachSerializer.new(accounts, params:{url: request.base_url})
      else
        render json: {errors: [
          {availability: ERR_MSG},
        ]}, status: :unprocessable_entity
      end
    end

    def past_coach
      slots = BxBlockAppointmentManagement::BookedSlot.where(service_user_id: current_user.id)
      if slots&.present?
        booked_slots=[]
        all_booked_slots = slots
        all_booked_slots.each do |slot|
          if Time.parse(slot.end_time).localtime <= Time.strptime(Time.now.in_time_zone(TIME_ZONE).to_s, TIME_FORMAT)
            booked_slots<<slot
          end
        end
        booked_slots = booked_slots.map(&:service_provider_id).uniq
        accounts = AccountBlock::Account.where(id: [booked_slots])
        render json: BxBlockCalendar::CurrentCoachSerializer.new(accounts, params:{url: request.base_url})
      else
        render json: {errors: [
          {availability: ERR_MSG},
        ]}, status: :unprocessable_entity
      end
    end

    def coach_with_upcoming_appointments
      if current_user
        user=AccountBlock::Account.find(params[:service_provider_id])
        render json: BxBlockCalendar::CoachWithAppointmentSerializer.new(user, params:{url: request.base_url, current_user: current_user})
      else
        render json: {errors: [
          {availability: ERR_MSG},
        ]}, status: :unprocessable_entity
      end
    end

    def coach_with_past_appointments
      if current_user
        user=AccountBlock::Account.find(params[:service_provider_id])
        render json: BxBlockCalendar::CoachWithPastAppointmentSerializer.new(user, params:{url: request.base_url, current_user: current_user})
      else
        render json: {errors: [
          {availability: ERR_MSG},
        ]}, status: :unprocessable_entity
      end
    end

    def user_appointments
      user = AccountBlock::Account.find(params[:service_user_id])
      all_booked_slots = BxBlockAppointmentManagement::BookedSlot.where("service_user_id = ? and service_provider_id = ?", user, current_user.id)
      render json: BxBlockAppointmentManagement::CoachAppointmentSerializer.new(all_booked_slots)
    end

    def coach_upcoming_appointments
      all_booked_slots = []
      fetched_booked_slots.each do |slot|
        all_booked_slots << slot if Time.parse(slot.end_time).localtime >= Time.strptime(Time.now.in_time_zone(TIME_ZONE).to_s, TIME_FORMAT)
      end
      all_booked_slots = all_booked_slots.sort_by(&:start_time)
      render json: BxBlockAppointmentManagement::CoachAppointmentSerializer.new(all_booked_slots)
    end

    def coach_past_appointments
      all_booked_slots = []
      fetched_booked_slots.each do |slot|
        all_booked_slots << slot if Time.parse(slot.end_time).localtime <= Time.strptime(Time.now.in_time_zone(TIME_ZONE).to_s, TIME_FORMAT)
      end
      all_booked_slots = all_booked_slots.sort_by(&:booking_date).reverse
      render json: BxBlockAppointmentManagement::CoachAppointmentSerializer.new(all_booked_slots)
    end


    def user_action_item
      if current_user
        account=AccountBlock::Account.find(params[:service_user_id])
        action_item = account.action_items.create(action_item: params[:action_item], date: params[:date])
        render json: action_item
      end
    end

    def video_call
      if params[:booked_slot_id].present?  
        slot = BxBlockAppointmentManagement::BookedSlot.find(params[:booked_slot_id])
        if current_user
          video_call_details = VideoCallDetail.find_by(booked_slot_id: params[:booked_slot_id])
          if video_call_details.nil?
            video_call_details = VideoCallDetail.create(booked_slot_id: slot.id, coach: AccountBlock::Account.find(slot.service_provider_id).full_name , employee: AccountBlock::Account.find(slot.service_user_id).full_name)
          end
          if current_user.role_id == BxBlockRolesPermissions::Role.find_by_name(:coach).id
            video_call_details.update(coach_presence: true)
          else
            video_call_details.update(employee_presence: true)
          end
          VideoCallNotificationWorker.perform_async(slot.id, current_user.id) unless Rails.env.test?
          render json: {message: "Video call started"}, status: 200
        end
      else
        return render json: {errors: "Booked slot id should present"}, status: :unprocessable_entity
      end
    end

    def booked_slot_details
      begin
        booked_slots = BxBlockAppointmentManagement::BookedSlot.all.reject do |slot|
          parse_datetime(slot.start_time) < DateTime.now
        end.sort_by { |slot| parse_datetime(slot.start_time) }

        render json: BxBlockAppointmentManagement::CoachAppointmentSerializer.new(booked_slots)
      rescue => e
        render json: { error: "An error occurred while processing booked slots: #{e.message}" }, status: :unprocessable_entity
      end
    end

    private

    def fetch_focus_areas(user_id)
      test_type_answer = BxBlockAssessmenttest::SelectAnswer.where(account_id: user_id).last
      BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: test_type_answer&.multiple_answers).pluck(:id).map(&:to_s)
    end

    def clean_up_nil_timeslots
      BxBlockAppointmentManagement::Availability.where(timeslots: nil).delete_all
    end

    def fetch_coaches(booking_date)
      BxBlockAppointmentManagement::Availability.where(availability_date: booking_date)
    end

    def filter_coaches(coach_ids, focus_areas, booking_date, start_time)
      all_coaches = []
      coach_ids.each do |coach_id|
        account = AccountBlock::Account.find_by(id: coach_id)
        coach = BxBlockAppointmentManagement::Availability.where(availability_date: booking_date, service_provider_id: coach_id).last
        next if account.blank? || coach.blank?

        if check_coach_expertise(coach, focus_areas) && account.activated
          relevant_timeslots = filter_timeslots(coach.timeslots || [], start_time)
          if relevant_timeslots.present?
            coach.timeslots = relevant_timeslots
            all_coaches << coach
          end
        end
      end
      all_coaches
    end

    def filter_timeslots(timeslots, start_time)
      timeslots.select do |timeslot|
        next if timeslot["booked_status"]
        parse_timeslot(timeslot, start_time)
      end
    end

    def parse_timeslot(timeslot, start_time)
      begin
        timeslot_start_time = Time.parse(timeslot["from"]) if timeslot["from"].present?
        timeslot_end_time = Time.parse(timeslot["to"]) if timeslot["to"].present?
        return true unless start_time.present?
        provided_start_time = Time.parse(start_time)
        timeslot_start_time <= provided_start_time && timeslot_end_time >= provided_start_time
      rescue ArgumentError => e
        logger.error("Time parsing error: #{e.message}")
        false
      end
    end

    def render_coach_availability(all_coaches, pagy, focus_areas)
      if all_coaches.empty?
        render json: { data: [], meta: pagy_metadata(pagy) }, status: :ok
      else
        render json: BxBlockAppointmentManagement::CheckCoachAvailabilitySerializer.new(
          all_coaches, params: {
            start_time_param: params[:start_time],
            url: request.base_url,
            focus_areas: focus_areas
          }, meta: pagy_metadata(pagy)
        ).serializable_hash, status: :ok
      end
    end

    def fetched_booked_slots
      @fetched_booked_slots ||= BxBlockAppointmentManagement::BookedSlot.where("service_provider_id = ?", current_user.id)
    end

    def validate_coach_id
      unless  current_user.role_id == BxBlockRolesPermissions::Role.find_by_name(:coach).id
        render json: { errors: [{ message: 'You do not have coach role.'}] }, status: :unprocessable_entity
      end
    end

    def parse_datetime(datetime_str)
      DateTime.strptime(datetime_str, "%d/%m/%Y %H:%M")
    rescue
      DateTime.strptime(datetime_str, "%d-%m-%Y %H:%M")
    end

    def validate_time_intervals
      start_minutes = [0, 15, 30, 45]
      end_minutes = [14, 29, 44, 59]
      appointment_params = params[:booked_slot]
      unless start_minutes.include?(Time.parse(appointment_params[:start_time]).min)
        error_response = { errors: [{ booking_date: "In Start Time choose minute in 15 min interval (00, 15, 30, 45)" }] }
        return render json: error_response, status: :unprocessable_entity
      end
  
      unless end_minutes.include?(Time.parse(appointment_params[:end_time]).min)
        error_response = { errors: [{ booking_date: "In End Time choose minute in 15 min interval (14, 29, 44, 59)" }] }
        return render json: error_response, status: :unprocessable_entity
      end
    end

    def check_coach_expertise(object, params)
      account = AccountBlock::Account.find_by(id: object.service_provider_id)
      return false if account.blank?

      account.expertise = [] if account.expertise.nil?
      account.expertise.delete("") if account.expertise.include?("")
      return false if account.expertise.nil?
      CoachSpecialization.all.map {|exp| exp.update(focus_areas: exp.focus_areas&.compact)}
      expertise = ["specialization"].product(JSON.parse(account.expertise.to_s)).map { |a| [a].to_h}
      expertise.delete_at(0) if expertise&.first&.values&.first == ""
      expertise&.each do |exp|
        expertise_focus_areas = CoachSpecialization.where('lower(expertise) LIKE ?', "%"+exp.values.first.to_s.downcase+"%")&.last&.focus_areas
        if expertise_focus_areas.present?
          expertise_focus_areas = expertise_focus_areas.map {|exp_fc| exp_fc.to_s}
          if !(expertise_focus_areas & params).empty?
            return true
          end
        end
      end
      return false
    end

    def book_params
      add_time_with_date
      params.require(:booked_slot).permit(:start_time, :end_time, :service_provider_id, :booking_date)
    end

    # def current_user
    #   return unless @token
    #   @current_user ||= AccountBlock::Account.find(@token.id)
    # end
    def current_user
      # @current_user = AccountBlock::Account.find(@token.id)
      validate_json_web_token if request.headers[:token] || params[:token]

      return unless @token
      @current_user = AccountBlock::Account.find(@token.id)
    end

    def add_time_with_date
      booked_slot = params[:booked_slot]
      booked_slot[:start_time] = booked_slot[:booking_date]+" "+booked_slot[:start_time]
      booked_slot[:end_time] = booked_slot[:booking_date]+" "+booked_slot[:end_time]
    end

    def create_meetings
      BxBlockAppointmentManagement::CreateMeeting.new.call
    end

    def track_login
      return if current_admin_user

      validate_json_web_token if request.headers[:token] || params[:token]

      return unless @token
      account = AccountBlock::Account.find(@token.id)
      return unless account&.role_id.present?

      if account and AccountBlock::Account.find(account&.id).role_id == BxBlockRolesPermissions::Role.find_by_name(:employee).id
        BxBlockTimeTrackingBilling::TimeTrackService.call(AccountBlock::Account.find(account.id), true)
      end
    end
  end
end
