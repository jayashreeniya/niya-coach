class CreateMotionAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :motion_answers do |t|
      t.string :emo_answer
      t.references :motion_question

      t.timestamps
    end
  end
end
