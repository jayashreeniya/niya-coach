class AddFieldToUserQuestionAnswer < ActiveRecord::Migration[6.0]
  def change
  	add_column :user_question_answers, :wellbeing_test_id, :bigint
  end
end
