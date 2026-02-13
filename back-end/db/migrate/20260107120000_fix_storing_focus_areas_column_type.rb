class FixStoringFocusAreasColumnType < ActiveRecord::Migration[6.0]
  def change
    # Change focus_areas_id from integer to text to store JSON array
    change_column(:storing_focusareas, :focus_areas_id, :text, default: nil)
  end
end







