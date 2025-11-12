class AddIndexAccountEmail < ActiveRecord::Migration[6.0]
  def change
  	remove_index :admin_users, :email
  end
end
