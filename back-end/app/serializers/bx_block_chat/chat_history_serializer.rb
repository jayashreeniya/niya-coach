module BxBlockChat
  class ChatHistorySerializer < BaseSerializer
    include FastJsonapi::ObjectSerializer

    attributes :name

    attribute :messages do |object, params|
      serializer = BxBlockChat::ChatMessageSerializer.new(
        object.messages.where.not(account_id: params[:receiver_id]), { params: params }
      )
      serializer.serializable_hash[:data]
    end
  end
end
