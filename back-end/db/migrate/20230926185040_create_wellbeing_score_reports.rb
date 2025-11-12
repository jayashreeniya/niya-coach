class CreateWellbeingScoreReports < ActiveRecord::Migration[6.0]
  def change
    create_table :wellbeing_score_reports do |t|
      t.integer :category_id
      t.integer :account_id
      t.json :category_result
      t.json :sub_category_result
      t.timestamps
    end
  end
end
