class AddColumnToAccessToken < ActiveRecord::Migration[6.0]
  def change
    add_column :user_conversations, :access_token1, :string
    add_column :user_conversations, :access_token2, :string
  end
end
