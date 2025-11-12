module BxBlockChat
  class ChatSerializer < BaseSerializer
    include FastJsonapi::ObjectSerializer

    attributes :id, :name, :is_notification_mute

    has_many :accounts, serializer: ::AccountBlock::AccountSerializer

    attribute :messages do |object, params|
      serializer = BxBlockChat::ChatMessageSerializer.new(
        object.messages, { params: params }
      )
      serializer.serializable_hash[:data]
    end
  end
end
