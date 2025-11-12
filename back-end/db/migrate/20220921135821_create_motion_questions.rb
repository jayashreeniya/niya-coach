class CreateMotionQuestions < ActiveRecord::Migration[6.0]
  def change
    create_table :motion_questions do |t|
      t.string :emo_question
      t.references :motion

      t.timestamps
    end
  end
end
