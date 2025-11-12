class AddAvailTypeToCoachParAvail < ActiveRecord::Migration[6.0]
  def change
  	add_column :coach_par_avails , :avail_type, :string, default: "available"
  end
end
