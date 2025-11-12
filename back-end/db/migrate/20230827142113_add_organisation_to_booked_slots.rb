class AddOrganisationToBookedSlots < ActiveRecord::Migration[6.0]
  def change
    add_column :bx_block_appointment_management_booked_slots, :organisation, :string
  end
end
