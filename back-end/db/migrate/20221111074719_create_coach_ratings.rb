class CreateCoachRatings < ActiveRecord::Migration[6.0]
  def change
    create_table :coach_ratings do |t|
      t.integer :account_id
      t.decimal :coach_rating
      t.integer :coach_id
      t.text :feedback

      t.timestamps
    end
  end
end
