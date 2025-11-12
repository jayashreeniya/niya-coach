class ChangeColumnInGoal < ActiveRecord::Migration[6.0]
  def change
    # add_column :goals, :complete, :string
    # remove_column :action_items, :completed
    add_column :goals, :time_slot, :string
    add_column :action_items, :time_slot, :string
  end
end
