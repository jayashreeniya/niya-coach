class CreateUserConversations < ActiveRecord::Migration[6.0]
  def change
    create_table :user_conversations do |t|
      t.string :conversation_id
      t.string :service_provider
      t.string :current_user
      t.string :current_user_participant
      t.string :service_provider_participant
      t.string :chat_service_id

      t.timestamps
    end
  end
end
