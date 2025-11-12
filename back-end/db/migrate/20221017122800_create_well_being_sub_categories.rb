class CreateWellBeingSubCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :well_being_sub_categories do |t|
      t.string :sub_category_name
      t.integer :well_being_category_id

      t.timestamps
    end
  end
end
