class AddColumnToTotalScore < ActiveRecord::Migration[6.0]
  def change
    add_column :anixety_cutoffs, :total_score, :integer
    add_column :anixety_cutoffs, :result, :boolean

  end
end
