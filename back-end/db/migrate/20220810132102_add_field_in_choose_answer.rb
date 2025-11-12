class AddFieldInChooseAnswer < ActiveRecord::Migration[6.0]
  def change
    remove_reference :choose_answers, :assesment_test_question
    remove_reference :choose_answers, :assesment_test_answer
    add_column :choose_answers, :assesment_test_question_id, :integer
    add_column :choose_answers, :assesment_test_answer_id, :integer
    add_reference :choose_answers, :account
  end
end
