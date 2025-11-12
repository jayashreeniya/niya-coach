class CreateCoachParTimes < ActiveRecord::Migration[6.0]
  def change
    create_table :coach_par_times do |t|
    	t.string :from
	  	t.string :to
	  	t.boolean :booked_slot, default: false
	  	t.string :sno
	  	t.references :coach_par_avail

     	t.timestamps
    end
  end
end
