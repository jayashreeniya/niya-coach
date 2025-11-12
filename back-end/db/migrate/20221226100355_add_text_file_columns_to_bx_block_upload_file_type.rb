class AddTextFileColumnsToBxBlockUploadFileType < ActiveRecord::Migration[6.0]
  def change
    add_column BxBlockUpload::FileType, :text_file, :string
  end
end
