class CreateAvailabilitySlots < ActiveRecord::Migration[6.0]
  def change
    create_table :availability_slots do |t|
		t.string :from
	  	t.string :to
	  	t.boolean :booked_slot, default: false
	  	t.string :sno
	  	t.references :availability

	  	t.timestamps
    end
  end
end
