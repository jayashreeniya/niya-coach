class CreateAssessYourselfQuestions < ActiveRecord::Migration[6.0]
  def change
    create_table :assess_yourself_questions do |t|
      t.string :question_title
      t.integer :sequence_number
      t.references :assess_yourselve
      t.timestamps
    end
  end
end
