class CreateChooseAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :choose_answers do |t|
      t.references :assesment_test_question
      t.references :assesment_test_answer
      t.timestamps
    end
  end
end
