class AddColumnToCoachParAvailibility < ActiveRecord::Migration[6.0]
  def change
  	remove_reference :coach_par_avails, :account
  	remove_reference :coach_par_times, :coach_par_avail
  	add_column :coach_par_avails, :account_id, :integer
  	add_column :coach_par_times, :coach_par_avail_id, :integer
  end
end
