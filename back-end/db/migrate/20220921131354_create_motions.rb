class CreateMotions < ActiveRecord::Migration[6.0]
  def change
    create_table :motions do |t|
      t.string :motion_title

      t.timestamps
    end
  end
end
