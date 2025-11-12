class CreateAssesmentTestTypes < ActiveRecord::Migration[6.0]
  def change
    create_table :assesment_test_types do |t|
      t.string :question_title
      t.string :test_type
      t.integer :sequence_number
      t.references :assesment_test_questions

      t.timestamps
    end
  end
end
