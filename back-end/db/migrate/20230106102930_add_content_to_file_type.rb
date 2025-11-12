class AddContentToFileType < ActiveRecord::Migration[6.0]
  def change
    add_column :file_types, :file_content, :text
  end
end
