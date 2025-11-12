class AddMeetingToBxBlockAppointmentManagementBookedSlots < ActiveRecord::Migration[6.0]
  def change
    add_column :bx_block_appointment_management_booked_slots, :meeting_code, :string
  end
end
