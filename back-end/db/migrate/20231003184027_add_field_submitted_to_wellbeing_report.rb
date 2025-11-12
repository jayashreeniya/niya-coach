class AddFieldSubmittedToWellbeingReport < ActiveRecord::Migration[6.0]
  def change
  	add_column :wellbeing_score_reports, :submitted_at, :date

  end
end
