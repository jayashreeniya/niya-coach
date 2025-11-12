module BxBlockChat
  class ChatsController < ApplicationController
    before_action :find_chat,  only: [:read_messages]
    before_action :track_login, only: [:conversation]
    before_action :current_user
    require 'rubygems'
    require 'twilio-ruby'

    def conversation
      account_sid = ENV['ACCOUNT_SID']
      auth_token = ENV["AUTH_TOKEN"]
      api_key = ENV["CHAT_API_KEY"]
      api_secret = ENV["CHAT_API_SECRET"]
      

      @client = Twilio::REST::Client.new(account_sid, auth_token)
      service = @client.conversations.v1.services.create(friendly_name: 'friendly_name')
      conversation1 = BxBlockChat::UserConversation.where(current_user: current_user.id).where(service_provider: params[:service_id])&.last
      conversation = conversation1 if conversation1.present?
      conversation2 = BxBlockChat::UserConversation.where(current_user: params[:service_id]).where(service_provider: current_user.id)&.last
      conversation = conversation2 if conversation2.present?
      if !conversation&.conversation_id.present?
        conversation = @client.conversations.v1.conversations.create(friendly_name: SecureRandom.alphanumeric(10))
        conversation_sid = conversation.sid
        conversation_chat_sid = conversation.chat_service_sid

        participant1 = @client.conversations
                     .v1
                     .conversations(conversation_sid)
                     .participants
                     .create(identity: current_user.id)

        participant2 = @client.conversations
                      .v1
                      .conversations(conversation_sid)
                      .participants
                      .create(identity: params[:service_id])

                      # Required for Chat
                      service_sid = service.sid
                      identity = params[:service_id]

                      # Create Chat grant for our token
                      grant = Twilio::JWT::AccessToken::ChatGrant.new
                      grant.service_sid = service_sid
                      # Create an Access Token
                      token = Twilio::JWT::AccessToken.new(
                        account_sid,
                        api_key,
                        api_secret,
                        [grant],
                        identity: identity
                      )

      BxBlockChat::UserConversation.create(conversation_id: conversation.sid, current_user: current_user.id, service_provider: params[:service_id], current_user_participant: participant1.sid, service_provider_participant: participant2.sid, chat_service_id: conversation.chat_service_sid)
      render json: {conversation_sid: conversation.sid,chat_sevice_sid: conversation.chat_service_sid, friendly_name: conversation.friendly_name, participant1: {  participant_sid1: participant1.sid, access_token: token.to_jwt },participant2: { participant_sid2: participant2.sid,access_token: token.to_jwt}}
      else

        service_sid = service.sid
        identity = params[:service_id]

        # Create Chat grant for our token
        grant = Twilio::JWT::AccessToken::ChatGrant.new
        grant.service_sid = service_sid

        # Create an Access Token
        if conversation2.present?

          token = Twilio::JWT::AccessToken.new(
          account_sid,
          api_key,
          api_secret,
          [grant],
          identity: current_user.id
          )
          token1 = Twilio::JWT::AccessToken.new(
            account_sid,
            api_key,
            api_secret,
            [grant],
            identity:  identity
          )
        else
          token = Twilio::JWT::AccessToken.new(
            account_sid,
            api_key,
            api_secret,
            [grant],
            identity: identity
            )
          token1 = Twilio::JWT::AccessToken.new(
          account_sid,
          api_key,
          api_secret,
          [grant],
          identity:  current_user.id
        )
        end

        conversation_sid = conversation.conversation_id
        conversation_chat_sid = conversation.chat_service_id
        if conversation2.present?
          render json: {conversation_sid: conversation_sid,chat_service_id: conversation_chat_sid, participant1: {  participant_sid1: conversation.service_provider_participant,access_token: token1.to_jwt},participant2: { participant_sid2: conversation.current_user_participant,access_token: token.to_jwt}}
        else
          render json: {conversation_sid: conversation_sid,chat_service_id: conversation_chat_sid, participant1: {  participant_sid1: conversation.current_user_participant,access_token: token1.to_jwt},participant2: { participant_sid2: conversation.service_provider_participant,access_token: token.to_jwt}}
        end
      end
    end

    def delete_conversation
      if current_user
        UserConversation.all.destroy_all
        render json: {message: "All conversatio is deleted."}
      end
    end

    def index
      chats = current_user.chats
      render json: ::BxBlockChat::ChatOnlySerializer.new(chats, serialization_options).serializable_hash, status: :ok
    end

    def show
      chat = BxBlockChat::Chat.includes(:accounts).find(params[:id])
      render json: ::BxBlockChat::ChatSerializer.new(chat, serialization_options).serializable_hash, status: :ok
    end

    def create
      chat = BxBlockChat::Chat.new(chat_params)
      chat.chat_type = 'multiple_user'
      if chat.save
        BxBlockChat::AccountsChatsBlock.create(account_id: current_user.id,
                                                  chat_id: chat.id,
                                                   status: :admin)
        render json: ::BxBlockChat::ChatSerializer.new(chat, serialization_options).serializable_hash, status: :created
      else
        render json: {errors: chat.errors}, status: :unprocessable_entity
      end
    end

    def history
      chat_ids = AccountBlock::Account.find(params[:receiver_id]).chats.pluck(:id)
      chats = current_user.chats.where(id: chat_ids)
      if chats.present?
        render json: ::BxBlockChat::ChatHistorySerializer.new(chats, chat_message_serialization_options).serializable_hash, status: :ok
      else
        render json: { message: "They don't have any chat history" }
      end
    end

    def read_messages
      begin
        @chat.messages&.all.update(is_mark_read: true )
        render json: ::BxBlockChat::ChatSerializer.new(@chat, serialization_options).serializable_hash, status: :ok
      rescue Exception=> e
        render json: { error: e }
      end
    end

    def update
      chat = Chat.find(params[:id])
      if chat.update!(is_notification_mute: params[:is_notification_mute])
        render json: ::BxBlockChat::ChatSerializer.new(
          chat, serialization_options
        ).serializable_hash, status: :ok
      else
        render json: { errors: format_activerecord_errors(chat.errors) },
               status: :unprocessable_entity
      end
    end

    def search
      @chats = current_user
        .chats
        .where('name ILIKE :search', search: "%#{search_params[:query]}%")
      render json: ChatSerializer.new(@chats, serialization_options).serializable_hash, status: :ok
    end

    def search_messages
      @messages = ChatMessage
                    .where(chat_id: current_user.chat_ids)
                    .where('message ILIKE :search', search: "%#{search_params[:query]}%")
      render json: ChatMessageSerializer.new(@messages, serialization_options).serializable_hash, status: :ok
    end

    private

    def track_login
      return if current_admin_user

      validate_json_web_token if request.headers[:token] || params[:token]

      return unless @token
      account = AccountBlock::Account.find(@token.id)
      return unless account&.role_id.present?

      if account and AccountBlock::Account.find(account&.id).role_id == BxBlockRolesPermissions::Role.find_by_name(:employee).id
        BxBlockTimeTrackingBilling::TimeTrackService.call(AccountBlock::Account.find(account.id), true)
      end
    end

    def chat_params
      params.require(:chat).permit(:name)
    end

    def search_params
      params.permit(:query)
    end

    def find_chat
      @chat = Chat.find_by_id(params[:chat_id])
      render json: {message: "Chat room is not valid or no longer exists" } unless @chat
    end


    def current_user
      return unless @token
      @current_user ||= AccountBlock::Account.find(@token.id)
    end

    def account_user
      current_user = AccountBlock::Account.find_by(id: @token.id)
    end
  end
end
