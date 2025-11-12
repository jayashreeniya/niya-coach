class CreateAnswerWellBeings < ActiveRecord::Migration[6.0]
  def change
    create_table :answer_well_beings do |t|
      t.string :answer
      t.string :score
      t.integer :question_well_being_id

      t.timestamps
    end
  end
end
