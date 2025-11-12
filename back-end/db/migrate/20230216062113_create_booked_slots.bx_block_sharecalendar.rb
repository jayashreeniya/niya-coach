class CreateBookedSlots < ActiveRecord::Migration[6.0]
  def up
    unless table_exists?(:bx_block_sharecalendar_booked_slots)
      create_table :bx_block_sharecalendar_booked_slots do |t|
        t.bigint :order_id
        t.string :start_time
        t.string :end_time
        t.bigint :service_provider_id
        t.date :booking_date
        t.integer :service_user_id
        t.string :meeting_code
  
        t.timestamps
      end
    end
  end

  def down
    drop_table :bx_block_sharecalendar_booked_slots, if_exists: true
  end
end
