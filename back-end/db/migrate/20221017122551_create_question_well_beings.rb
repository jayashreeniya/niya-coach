class CreateQuestionWellBeings < ActiveRecord::Migration[6.0]
  def change
    create_table :question_well_beings do |t|
      t.string :question
      t.integer :category_id
      t.integer :subcategory_id

      t.timestamps
    end
  end
end
