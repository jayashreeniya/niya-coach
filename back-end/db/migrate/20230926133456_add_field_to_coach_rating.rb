class AddFieldToCoachRating < ActiveRecord::Migration[6.0]
  def change
    add_column :coach_ratings, :app_rating, :integer
  end
end
