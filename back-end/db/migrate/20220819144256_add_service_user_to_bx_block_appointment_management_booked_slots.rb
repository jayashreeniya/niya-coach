class AddServiceUserToBxBlockAppointmentManagementBookedSlots < ActiveRecord::Migration[6.0]
  def change
    add_column :bx_block_appointment_management_booked_slots, :service_user_id, :integer
  end
end
