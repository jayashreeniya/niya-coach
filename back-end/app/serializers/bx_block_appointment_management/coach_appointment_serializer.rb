module BxBlockAppointmentManagement
  class CoachAppointmentSerializer < BaseSerializer
    attributes :id

    attribute :appointments do |object|
      appoint_details_for(object)
    end

    class << self
      private

      def appoint_details_for(booked_slot)
        {
          id: booked_slot.service_user_id,
          name: booked_slot.service_user.present? ? booked_slot&.service_user&.full_name : "User deleted",
          booking_date: booked_slot.booking_date,
          viewable_slots: "#{booked_slot.start_time} - #{booked_slot.end_time}",
          meeting_code: booked_slot.meeting_code
        }
      end
    end
  end
end
