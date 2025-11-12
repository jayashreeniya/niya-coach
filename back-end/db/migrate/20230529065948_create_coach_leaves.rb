class CreateCoachLeaves < ActiveRecord::Migration[6.0]
  def change
    create_table :coach_leaves do |t|
    	t.datetime :coach_off
      	t.references :account

      	t.timestamps
    end
  end
end
