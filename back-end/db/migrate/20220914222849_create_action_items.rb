class CreateActionItems < ActiveRecord::Migration[6.0]
  def change
    create_table :action_items do |t|
      t.string :action_item 
      t.datetime :date
      t.boolean :completed, default: false
      t.references :account, foreign_key: 'account_id'

      t.timestamps
    end
  end
end
