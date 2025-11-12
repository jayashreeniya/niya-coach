class AddColumnToCancelBookedAppointments < ActiveRecord::Migration[6.0]
  def change
    add_column :cancel_booked_appointments, :account, :integer
    add_column :cancel_booked_appointments, :role, :string
    add_column :cancel_booked_appointments, :booked_slot_id, :integer
  
  end
end
