class AddColumnToFileType < ActiveRecord::Migration[6.0]
  def change
    add_column :file_types , :well_being_focus_areas , :string ,default: [], array: true
  end
end
