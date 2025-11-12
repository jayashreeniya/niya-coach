class CreateChooseMotionAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :choose_motion_answers do |t|
      t.integer :motion_question_id
      t.integer :motion_answer_id
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end
  end
end
