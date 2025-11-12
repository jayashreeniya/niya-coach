class AddFieldToActionItem < ActiveRecord::Migration[6.0]
  def change
     add_column :action_items, :is_complete, :boolean, default: false
  end
end
