class CreateUserDeviceTokens < ActiveRecord::Migration[6.0]
  def change
    create_table :user_device_tokens do |t|
      t.integer :account_id
      t.string :device_token

      t.timestamps
    end
  end
end
