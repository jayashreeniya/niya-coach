class CreateSelectMotions < ActiveRecord::Migration[6.0]
  def change
    create_table :select_motions do |t|
      t.references :account
      t.references :motion

      t.timestamps
    end
  end
end
