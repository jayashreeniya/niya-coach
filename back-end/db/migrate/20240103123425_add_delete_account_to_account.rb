class AddDeleteAccountToAccount < ActiveRecord::Migration[6.0]
  def change
    add_column :accounts , :deactivation, :boolean ,default: false
  end
end
