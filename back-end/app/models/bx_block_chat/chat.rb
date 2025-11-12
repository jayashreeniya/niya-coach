module BxBlockChat
  class Chat < BxBlockChat::ApplicationRecord
    self.table_name = :chats
    has_many :accounts_chats,
             class_name: 'BxBlockChat::AccountsChatsBlock',
             dependent: :destroy
    has_many :accounts, through: :accounts_chats
    has_many :messages, class_name: 'BxBlockChat::ChatMessage', dependent: :destroy

    enum type: { single_user: 1, multiple_user: 2}

    def admin_accounts
      accounts_chats.where(status: :admin).includes(:accounts).pluck('accounts.id')
    end

    def last_admin?(account)
      accounts.include?(account.id) && accounts.count == 1
    end
  end
end
