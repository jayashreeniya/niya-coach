class AddFocusAreasToFileTypes < ActiveRecord::Migration[6.0]
  def change
    add_column :file_types, :focus_areas, :string, default: [], array: true
  end
end
