module BxBlockChat
  class MessagesController < ApplicationController
    def create
      @chat = current_user.chats.find_by_id(params[:chat_id])
      unless @chat
        render json: {message: "Chat room is not valid or no longer exists" } and return
      end
      message = @chat.messages.new(message_params)
      message.account_id = current_user.id
      if message.save
        render json: ::BxBlockChat::ChatMessageSerializer.new(
          message,
          serialization_options
        ).serializable_hash, status: :created
      else
        render json: {errors: message.errors}, status: :unprocessable_entity
      end
    end

    private

    def message_params
      params.require(:message).permit(:message, attachments: [])
    end
  end
end
