class CreateWellBeingFocusAreas < ActiveRecord::Migration[6.0]
  def change
    create_table :well_being_focus_areas do |t|
      t.string :answers
      t.string :well_being_sub_categoryid
      t.integer :multiple_account, array: true , default: []

      t.timestamps
    end
  end
end
