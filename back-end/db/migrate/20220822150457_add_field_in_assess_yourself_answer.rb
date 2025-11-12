class AddFieldInAssessYourselfAnswer < ActiveRecord::Migration[6.0]
  def change
    remove_reference :assess_yourself_answers, :assess_yourselve
    remove_column :assess_yourself_answers, :answers
    add_reference :assess_yourself_answers, :assess_yourself_question
    add_column :assess_yourself_answers, :answer_title, :string
    add_column :assess_yourself_answers, :answer_score, :integer 
  end
end
