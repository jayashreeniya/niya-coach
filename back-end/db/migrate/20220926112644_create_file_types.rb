class CreateFileTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :file_types do |t|
      t.string :file_name
      t.text :file_discription
      t.references :assesment_test_type_answer, null: false, foreign_key: true
      t.references :multiple_upload_file, null: false, foreign_key: true 
      t.timestamps
    end
  end
end
