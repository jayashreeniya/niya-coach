class CreateAssesmentTestAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :assesment_test_answers do |t|
      t.references :assesment_test_question
      t.timestamps
    end
  end
end
