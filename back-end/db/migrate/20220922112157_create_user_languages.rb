class CreateUserLanguages < ActiveRecord::Migration[6.0]
  def change
    create_table :user_languages do |t|
      t.string :language
      t.integer :account_id

      t.timestamps
    end
  end
end
