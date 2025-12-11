class VideoCallDetail < ApplicationRecord
  belongs_to :booked_slot, class_name: 'BxBlockAppointmentManagement::BookedSlot', optional: true

  # Required for ActiveAdmin filtering/searching
  def self.ransackable_attributes(auth_object = nil)
    ["id", "booked_slot_id", "coach", "employee", "coach_presence", "employee_presence", "created_at", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["booked_slot"]
  end
end
