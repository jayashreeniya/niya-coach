class AddFieldInAccount < ActiveRecord::Migration[6.0]
  def change
    add_column :accounts, :access_code, :string
  end
end
