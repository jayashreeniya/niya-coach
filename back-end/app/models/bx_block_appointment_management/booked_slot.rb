module BxBlockAppointmentManagement
  class BookedSlot < ApplicationRecord
    Time_Format = "%I:%M %p"
    self.table_name = :bx_block_appointment_management_booked_slots

    belongs_to :service_provider, class_name: "AccountBlock::Account"
    belongs_to :service_user, class_name: "AccountBlock::Account"
    validate :check_end_time, :check_column_exist, :check_booked_date, :check_availability, :validate_time_format, :check_start_and_time, :check_time_validation, :check_appointment 

    # Required for ActiveAdmin filtering/searching
    def self.ransackable_attributes(auth_object = nil)
      ["booking_date", "created_at", "end_time", "id", "service_provider_id", "service_user_id", "start_time", "updated_at", "status", "organisation"]
    end

    # Required for Ransack 4.0 - associations must be explicitly allowlisted
    def self.ransackable_associations(auth_object = nil)
      ["service_provider", "service_user"]
    end 
    
    def check_appointment
      appointments = BxBlockAppointmentManagement::BookedSlot.where(service_user_id: self.service_user_id, booking_date: self.booking_date)

      start_datetime = DateTime.parse(self.start_time)
      end_datetime = DateTime.parse(self.end_time)

      overlapping_appointment = appointments.find do |appointment|
        appointment_start = DateTime.parse(appointment.start_time)
        appointment_end = DateTime.parse(appointment.end_time)

        (start_datetime < appointment_end && end_datetime > appointment_start)
      end

      return errors.add(:booking_date, "This slot is already booked with other coach") if overlapping_appointment

      current_time = start_datetime
      while current_time < end_datetime
        end_slot_time = current_time + 15.minutes

        overlapping_slot = appointments.find do |appointment|
          appointment_start = DateTime.parse(appointment.start_time)
          appointment_end = DateTime.parse(appointment.end_time)

          (current_time < appointment_end && end_slot_time > appointment_start)
        end

        return errors.add(:booking_date, "Appointment Already booked") if overlapping_slot

        current_time = end_slot_time
      end

      # return 'Success: No overlapping appointments found' 
    end

    def check_end_time
      timeslots = BxBlockAppointmentManagement::Availability.where(service_provider_id: self.service_provider_id , availability_date: self.start_time.split.first)&.last&.timeslots
      end_time = Time.parse(self.end_time.split.last).strftime(Time_Format)
      start_time = Time.parse(self.start_time.split.last).strftime(Time_Format)
    
      end_time_not_found = timeslots&.map do |obj|
        true if Time.parse(end_time) == Time.parse(obj["to"]) && obj["booked_status"] == false
      end

      start_time_not_found = timeslots&.map do |obj|
        true if Time.parse(start_time) == Time.parse(obj["from"]) && obj["booked_status"] == false
      end

      if end_time_not_found&.compact&.first == nil || start_time_not_found&.compact&.first == nil 
        return errors.add(:booking_date, "Coach is not available for this time slot")
      end
      
      filtered_timeslots = timeslots.select do |slot|
        slot_time = Time.parse(slot['from'])
        slot_time >= start_time && slot_time <= end_time
      end
    
      booked_slots = filtered_timeslots.map {|obj| true if obj["booked_status"] == true}
      result = booked_slots.compact.any? { |value| value == true }
      return errors.add(:booking_date, "This slot is already booked") if result == true
    end

    def check_time_validation
      book_date_time = Time.strptime("#{self.booking_date} #{self.start_time.split(" ")[1]} +0530", "%Y-%m-%d %H:%M %z")
      unless ((book_date_time.utc + 5*60*60 + 30*60)  - (Time.now.utc + 5*60*60 + 30*60)) > 1440*60
        return errors.add(:booking_date, "You can only book the appointment 24 hours prior to the appointment time")
      end
    end

    def check_availability
      booking_duration_minutes = ((Time.parse(self.end_time) - Time.parse(self.start_time)) / 60).to_i
      if booking_duration_minutes <= 0
        errors.add(:booking_date, "Invalid booking duration")
        return
      end
    
      availability = BxBlockAppointmentManagement::Availability.find_by(
        "service_provider_id = ? AND availability_date = ?", 
        self.service_provider_id, 
        self.booking_date&.strftime("%d/%m/%Y")
      )
    
      if availability.nil?
        errors.add(:booking_date, "No booking for this date")
        return
      end
    
      available_slots = availability.timeslots
      start_time = Time.parse(self.start_time).strftime(Time_Format)
      end_time = Time.parse(self.end_time).strftime(Time_Format)
      available_slot = available_slots.map do |slot|
        if Time.parse(slot['from']) >= Time.parse(start_time) && Time.parse(slot['to']) <= Time.parse(end_time)
          slot['booked_status'] = true
        end
       slot
      end
      if available_slots.nil?
        errors.add(:booking_date, "No booking for this time")
        return
      end
      availability.update(timeslots: available_slot)
    end

    def check_booked_date
      if self.booking_date
        slots = BxBlockAppointmentManagement::BookedSlot.where(service_user_id: service_user_id)
        slots.each do |slot|
          if Time.parse(slot.start_time).localtime == Time.parse(self.start_time).localtime
            errors.add(:booking_date, "You have already slot for this time")
          end
        end
        if self&.booking_date < Date.today
          errors.add(:booking_date, "You can't book for previous time")
        end
      end
    end

    def check_column_exist
      if !self.start_time.presence
        errors.add(:start_time, "start time must exist")
      elsif !self.end_time.presence
        errors.add(:end_time, "end time must exist")
      elsif !self.booking_date.presence
        errors.add(:booking_date, "Booking date must be present")
      end
    end

    def validate_time_format
      errors.add(:end_time, "end time format is not correct, it should be in HH:MM format") unless self.end_time&.match(/([0-1]?[0-9]|2[0-3]):[0-5][0-9]/)
      errors.add(:start_time, "end time format is not correct, it should be in HH:MM format") unless self.start_time&.match(/([0-1]?[0-9]|2[0-3]):[0-5][0-9]/)
    end

    def check_start_and_time
      if (self.end_time && self.start_time).present? and Time.parse(self.end_time) <= Time.parse(self.start_time) 
        errors.add(:booking_date, "End time should be greater than start time")
      end
    end
  end
end
