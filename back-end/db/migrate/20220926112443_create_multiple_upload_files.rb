class CreateMultipleUploadFiles < ActiveRecord::Migration[6.0]
  def change
    create_table :multiple_upload_files do |t|
      t.integer :choose_file
      t.timestamps
    end
  end
end
