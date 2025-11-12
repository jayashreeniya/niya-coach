class CreateAssessYourselfChooseAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :assess_yourself_choose_answers do |t|
      t.integer :assess_yourself_question_id
      t.integer :assess_yourself_answer_id
      t.integer :toatal_score
      t.references :account
      t.timestamps
    end
  end
end
