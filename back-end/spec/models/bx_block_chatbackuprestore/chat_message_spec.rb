require 'rails_helper'

RSpec.describe BxBlockChatbackuprestore::ChatMessage, type: :model do
  describe 'associations' do
    it { should belong_to(:account).class_name('AccountBlock::Account') }
    it { should belong_to(:chat_rooms).class_name('BxBlockChatbackuprestore::ChatRoom') }
  end

  describe 'table name' do
    it { expect(described_class.table_name).to eq('bx_block_chatbackuprestore_chat_messages') }
  end
end