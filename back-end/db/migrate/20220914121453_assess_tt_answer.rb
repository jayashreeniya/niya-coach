class AssessTtAnswer < ActiveRecord::Migration[6.0]
  def change
    create_table "assess_tt_answers", force: :cascade do |t|
      t.string :answer
      t.string :answer_score
      t.references :assess_yourself_test_type
      t.timestamps
    end

  end
end
