class AddFieldToGoal < ActiveRecord::Migration[6.0]
  def change
    add_column :goals, :is_complete, :boolean, default: false
  end
end
