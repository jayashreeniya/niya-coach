class CreateWellbeingTests < ActiveRecord::Migration[6.0]
  def change
    create_table :wellbeing_tests do |t|
      t.bigint :account_id
      t.bigint :category_id
      t.boolean :status , default: false

      t.timestamps
    end
  end
end
