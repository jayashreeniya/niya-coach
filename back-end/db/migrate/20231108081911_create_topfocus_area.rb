class CreateTopfocusArea < ActiveRecord::Migration[6.0]
  def change
    create_table :topfocus_areas do |t|
      t.bigint :account_id
      t.integer :select_focus_area_id ,default: [], array: true
      t.integer :wellbeingfocus_id ,default: [], array: true
      t.timestamps
    end
  end
end
