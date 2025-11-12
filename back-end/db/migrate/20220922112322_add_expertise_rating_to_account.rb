class AddExpertiseRatingToAccount < ActiveRecord::Migration[6.0]
  def change
    add_column :accounts, :expertise, :string
    add_column :accounts, :rating, :float
    add_column :accounts, :city, :string
  end
end
