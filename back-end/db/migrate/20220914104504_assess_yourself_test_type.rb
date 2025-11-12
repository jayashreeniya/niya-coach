class AssessYourselfTestType < ActiveRecord::Migration[6.0]
  def change
    create_table :assess_yourself_test_types do |t|
      t.string :question_title
      t.integer :sequence_number
      t.references :assess_yourself_answer, null: false, foreign_key: true
      t.timestamps
    end
  end
end
