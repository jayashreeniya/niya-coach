class CreateAppRatings < ActiveRecord::Migration[6.0]
  def change
    create_table :app_ratings do |t|
      t.integer :account_id
      t.decimal :app_rating
      t.text :feedback

      t.timestamps
    end
  end
end
