class CreateCoachSpecializations < ActiveRecord::Migration[6.0]
  def change
    create_table :coach_specializations do |t|
      t.string :expertise
      t.integer :focus_areas, default: [], array: true
      t.timestamps
    end
  end
end 
