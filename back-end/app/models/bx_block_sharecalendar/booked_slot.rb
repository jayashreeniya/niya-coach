module BxBlockSharecalendar
  class BookedSlot < ApplicationRecord

    self.table_name = :bx_block_sharecalendar_booked_slots 

    belongs_to :service_provider, class_name: "AccountBlock::Account"
    belongs_to :service_user, class_name: "AccountBlock::Account"
    validate :check_column_exist, :check_booked_date, :check_availability, :validate_time_format, :check_start_and_time

    def check_availability
      slot=0
      availability = BxBlockAppointmentManagement::Availability.find_by("service_provider_id = ? and availability_date = ?", self.service_provider_id, self.booking_date&.strftime("%d-%m-%Y").to_s.gsub("-","/"))
      if availability.present?
        if availability.available_slots_count<=0
           errors.add(:booking_date, "No slots are availabile for this coach")
        end
        availability.timeslots.each_with_index do |timeslot, index|
            if Time.parse(timeslot["to"]).strftime("%H:%M")==self.end_time.split[1] and Time.parse(timeslot["from"]).strftime("%H:%M")==self.start_time.split[1]
              if availability.timeslots[index]["booked_status"]
                errors.add(:booking_date, "No slots are availabile")
              else
                slot=1
                break
              end
            end
        end
      else
        errors.add(:booking_date, "No booking for this date")
      end

      if(slot==0)
        errors.add(:booking_date, "No booking for this time")
      end

    end

    def check_booked_date
      if self.booking_date
        slots = AccountBlock::Account.find(service_user_id).user_booked_slots
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
