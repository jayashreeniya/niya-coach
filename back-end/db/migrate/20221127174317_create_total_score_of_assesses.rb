class CreateTotalScoreOfAssesses < ActiveRecord::Migration[6.0]
  def change
    create_table :total_score_of_assesses do |t|
      t.integer :account_id
      t.integer :mood_id
      t.string :total_score

      t.timestamps
    end
  end
end
