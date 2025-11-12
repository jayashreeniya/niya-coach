class CreateAssesmentTestQuestions < ActiveRecord::Migration[6.0]
  def change
    create_table :assesment_test_questions do |t|
      t.string :title
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end
  end
end
