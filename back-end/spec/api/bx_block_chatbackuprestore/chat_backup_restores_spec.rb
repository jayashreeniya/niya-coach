
require 'swagger_helper'

TYPE = 'application/json'
TAG = 'Chat Backup Restores'
ROUTE12 = "/bx_block_chatbackuprestore/chat_backup_restores/chat_backup"
ROUTE10 = "/bx_block_chatbackuprestore/chat_backup_restores/participant_list"
ROUTE11 = "/bx_block_chatbackuprestore/chat_backup_restores/chat_request"
ROUTE14 = "/bx_block_chatbackuprestore/chat_backup_restores/creating_chat_message" 
ROUTE15 = "/bx_block_chatbackuprestore/chat_backup_restores/all_chat_message" 
ROUTE16 = "/bx_block_chatbackuprestore/chat_backup_restores/active_chats_room" 


RSpec.describe BxBlockChatbackuprestore::ChatBackupRestoresController, type: :request do
  before(:each)  do
    account =  Support::SharedHelper.new.current_user 
    @token = BuilderJsonWebToken.encode(account.id)
    @user =  Support::SharedHelper.new.get_coach_user 
    @token1 = BuilderJsonWebToken.encode(@user.id)
  end

  path ROUTE12 do
    get 'ChatBackupRestores #chat_backup' do
      tags TAG
      produces TYPE
      parameter name: :token, in: :header, type: :string, description: TAG
      
      response '200', TAG do
        let(:token) { @token }

        it "active chat rooms " do
          get ROUTE12 ,params:{token: token }
          expect(response).to have_http_status(200)
        end
        run_test!
      end
    end
  end

  path ROUTE10 do
    post 'ChatBackupRestores #participant_list' do
      tags TAG
      produces TYPE
      parameter name: :token, in: :header, type: :string, description: TAG
      
      response '200', TAG do
        let(:token) { @token }
        it "requesting chat" do
          post ROUTE10 ,params:{token: token}
          expect(response).to have_http_status(200)
        end
        it "requesting chat user" do
          post ROUTE10 ,params:{token: token , limit: '5' , page: '0'}
          expect(response).to have_http_status(200)
        end
        run_test!
      end
    end
  end
  path ROUTE11 do
    post 'ChatBackupRestores #chat_request' do
      tags TAG
      produces TYPE
      parameter name: :token, in: :header, type: :string, description: TAG
      
      response '422', TAG do
        let(:token) { @token }
        it "requesting chat for user" do
          post ROUTE11 ,params:{token: token, participant_user_id: @user.id}
          expect(response).to have_http_status(201)
          participant = BxBlockChatbackuprestore::ChatRoom.last.chat_user
          post ROUTE11 ,params:{token: token, participant_user_id: participant}
          expect(response).to have_http_status(200)
        end
        run_test!
      end
    end
  end


  path ROUTE14 do
    post 'ChatBackupRestores #creating_chat_message' do
      tags TAG
      produces TYPE
      parameter name: :token, in: :header, type: :string, description: TAG
      
      response '422', TAG do
        let(:token) { @token }
        let(:token1) { @token1 }

        it "creating_chat_message " do
          post ROUTE11 ,params:{token: token, participant_user_id: @user.id}
          expect(response).to have_http_status(201)
          room = BxBlockChatbackuprestore::ChatRoom.last
          post ROUTE14 ,params:{token: token ,room_id: room.id ,message: "test1"}
          expect(response).to have_http_status(201)
        end
        run_test!
      end
    end
  end

  path ROUTE16 do
    get 'ChatBackupRestores #active_chats_room' do
      tags TAG
      produces TYPE
      parameter name: :token, in: :header, type: :string, description: TAG
      
      response '200', TAG do
        let(:token) { @token }
        let(:token1) { @token1 }

        it "active chat rooms " do
          post ROUTE11 ,params:{token: token, participant_user_id: @user.id}
          expect(response).to have_http_status(201)
          room = BxBlockChatbackuprestore::ChatRoom.last
          get ROUTE16 ,params:{token: token1 }
          expect(response).to have_http_status(200)
        end
        run_test!
      end
    end
  end

  path ROUTE15 do
    get 'ChatBackupRestores #all_chat_message' do
      tags TAG
      produces TYPE
      parameter name: :token, in: :header, type: :string, description: TAG
      
      response '422', TAG do
        let(:token) { @token }
        let(:token1) { @token1 }

        it "all_chat_message of users " do
          post ROUTE11 ,params:{token: token, participant_user_id: @user.id}
          expect(response).to have_http_status(201)
          room = BxBlockChatbackuprestore::ChatRoom.last
          post ROUTE14 ,params:{token: token ,room_id: room.id ,message: "test1"}
          expect(response).to have_http_status(201)
          get ROUTE15 ,params:{token: token1 ,room_id: room.id }
          expect(response).to have_http_status(200)
        end
        run_test!
      end
    end
  end

end

