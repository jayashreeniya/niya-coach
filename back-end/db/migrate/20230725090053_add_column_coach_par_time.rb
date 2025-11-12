class AddColumnCoachParTime < ActiveRecord::Migration[6.0]
  def change
  	add_column :coach_par_avails, :week_days, :jsonb, array:true, default: [] 
  end
end
