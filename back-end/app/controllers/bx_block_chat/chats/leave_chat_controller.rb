module BxBlockChat
  module Chats
    class LeaveChatController < ApplicationController
      def leave
        chat = BxBlockChat::Chat.find(params[:chat_id])
        return render json: {errors: [
          {account: 'Add new adimin before leaving this chat'},
        ]}, status: :unprocessable_entity if chat&.last_admin?(current_user)

        if chat.accounts.count <= 2
          chat.delete
        else
          BxBlockChat::AccountsChatsBlock
            .where(account_id: current_user.id, chat_id: params[:chat_id])
            .last
            .delete
        end

        render json: 'Left the chat successfully', status: :ok
      end
    end
  end
end
