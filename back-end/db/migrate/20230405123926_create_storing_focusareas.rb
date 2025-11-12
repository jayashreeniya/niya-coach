class CreateStoringFocusareas < ActiveRecord::Migration[6.0]
  def change
    create_table :storing_focusareas do |t|
      t.bigint :account_id
      t.integer :focus_areas_id, array: true , default: []

      t.timestamps
    end
  end
end
