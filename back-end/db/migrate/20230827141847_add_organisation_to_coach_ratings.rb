class AddOrganisationToCoachRatings < ActiveRecord::Migration[6.0]
  def change
    add_column :coach_ratings, :organisation, :string
  end
end
