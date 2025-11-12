class CreateBxBlockAudiolibraryFileTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :bx_block_audiolibrary_file_types do |t|
      t.string "file_name"
      t.text "file_discription"
      t.bigint "assesment_test_type_answer_id", null: false
      t.bigint "multiple_upload_file_id", null: false
      t.string "focus_areas", default: [], array: true
      t.string "text_file_to_str"
      t.string "text_file"
      t.text "file_content"

      t.timestamps
    end
  end
end
