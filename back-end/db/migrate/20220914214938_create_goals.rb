class CreateGoals < ActiveRecord::Migration[6.0]
  def change
    create_table :goals do |t|
      t.string :goal 
      t.datetime :date
      t.boolean :completed, default: false
      t.references :account, foreign_key: 'account_id'

      t.timestamps
    end
  end
end
