class CreateAssessSelectAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :assess_select_answers do |t|
      t.integer :assess_yourself_test_type_id
      t.integer :assess_tt_answer_id
      t.references :account, null: false, foreign_key: true

      t.timestamps
    end
  end
end
