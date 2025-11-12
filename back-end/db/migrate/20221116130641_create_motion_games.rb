class CreateMotionGames < ActiveRecord::Migration[6.0]
  def change
    create_table :motion_games do |t|
      t.string :selected_answer
      t.integer :account_id
      t.text :game_choosen

      t.timestamps
    end
  end
end
