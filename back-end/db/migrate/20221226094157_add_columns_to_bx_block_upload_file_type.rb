class AddColumnsToBxBlockUploadFileType < ActiveRecord::Migration[6.0]
  def change
    add_column BxBlockUpload::FileType, :text_file_to_str, :string
  end
end
