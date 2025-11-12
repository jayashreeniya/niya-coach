class CreateAssessYourselfAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :assess_yourself_answers do |t|
      t.string :answers
      t.references :assess_yourselve
      t.timestamps
    end
  end
end
