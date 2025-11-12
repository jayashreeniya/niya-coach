require 'rails_helper'

RSpec.describe BxBlockChatbackuprestore::ChatRoom, type: :model do
  describe 'associations' do
    it { should belong_to(:account).class_name('AccountBlock::Account') }
    it { should have_many(:chat_messages).class_name('BxBlockChatbackuprestore::ChatMessage') }
  end

  describe 'table name' do
    it { expect(described_class.table_name).to eq('bx_block_chatbackuprestore_chat_rooms') }
  end
end