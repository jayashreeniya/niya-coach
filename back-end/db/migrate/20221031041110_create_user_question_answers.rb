class CreateUserQuestionAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :user_question_answers do |t|
      t.integer :question_id
      t.integer :answer_id
      t.integer :account_id

      t.timestamps
    end
  end
end
