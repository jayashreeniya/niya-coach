class CreateCoachParAvails < ActiveRecord::Migration[6.0]
  def change
    create_table :coach_par_avails do |t|
    	t.datetime :start_date
    	t.datetime :end_date
      	t.references :account
      	t.timestamps
    end
  end
end
