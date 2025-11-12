class AddColumnToGoals < ActiveRecord::Migration[6.0]
  def change
    add_column :goals, :focus_area_id, :integer
  end
end
