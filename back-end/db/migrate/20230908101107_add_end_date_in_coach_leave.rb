class AddEndDateInCoachLeave < ActiveRecord::Migration[6.0]
  def up
  	rename_column :coach_leaves, :coach_off, :start_date
  	change_column :coach_leaves, :start_date, :date
  	add_column :coach_leaves, :end_date, :date
  end
  def down
  	rename_column :coach_leaves, :start_date, :coach_off
  	change_column :coach_leaves, :coach_off, :datetime
  	remove_column :coach_leaves, :end_date, :date
  end
end
