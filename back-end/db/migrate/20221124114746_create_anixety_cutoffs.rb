class CreateAnixetyCutoffs < ActiveRecord::Migration[6.0]
  def change
    create_table :anixety_cutoffs do |t|
      t.integer :min_score 
      t.integer :max_score
      t.string :anixety_title
      t.integer :category_id

      t.timestamps
    end
  end
end
