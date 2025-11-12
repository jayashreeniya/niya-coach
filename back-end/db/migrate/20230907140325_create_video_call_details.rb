class CreateVideoCallDetails < ActiveRecord::Migration[6.0]
  def change
    create_table :video_call_details do |t|
      t.integer :booked_slot_id
      t.string :coach
      t.string :employee
      t.boolean :coach_presence, default: false
      t.boolean :employee_presence, default: false

      t.timestamps
    end
  end
end
