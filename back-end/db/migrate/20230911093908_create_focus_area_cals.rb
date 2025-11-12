class CreateFocusAreaCals < ActiveRecord::Migration[6.0]
  def change
    create_table :focus_area_cals do |t|
      t.string :name
      t.integer :focus_area_count

      t.timestamps
    end
  end
end
