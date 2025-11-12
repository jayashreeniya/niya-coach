class CreateCancelBookedAppointment < ActiveRecord::Migration[6.0]
  def change
    create_table :cancel_booked_appointments do |t|
      t.bigint "order_id"
      t.string "start_time"
      t.string "end_time"
      t.bigint "service_provider_id"
      t.date "booking_date"
      t.integer "service_user_id"

      t.timestamps
    end
  end
end
