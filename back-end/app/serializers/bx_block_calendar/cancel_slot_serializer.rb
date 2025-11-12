module BxBlockCalendar
  class CancelSlotSerializer < BaseSerializer
    attributes :id, :start_time, :end_time, :booking_date ,:created_at

    attributes :viewable_slot do |object|
      "#{object.start_time} - #{object.end_time}"
    end
    
    attribute :cancelled_by do |object,params|
      {
        account: object.account,
        role: object.role,
        booked_slot_id: object.booked_slot_id,
        message: params
      }
    end

  end
end
