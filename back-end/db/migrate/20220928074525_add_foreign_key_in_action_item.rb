class AddForeignKeyInActionItem < ActiveRecord::Migration[6.0]
  def change
    remove_reference :action_items, :account
    add_reference :action_items, :account,  foreign_key: true
  end
end
