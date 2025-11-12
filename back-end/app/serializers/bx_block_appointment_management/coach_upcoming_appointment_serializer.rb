module BxBlockAppointmentManagement
  class CoachUpcomingAppointmentSerializer < BaseSerializer
    attributes :id

    attribute :upcoming_appointments do |object|
      appoint_details_for(object)
    end

    class << self
      private

      def appoint_details_for booked_slot
        {
          name: AccountBlock::Account.find(booked_slot.service_user_id).full_name,
          booking_date: booked_slot.booking_date,
          viewable_slots: "#{booked_slot.start_time} - #{booked_slot.end_time}"
        }

      end
    end
  end
end
