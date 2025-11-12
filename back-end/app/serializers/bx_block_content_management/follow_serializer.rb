module BxBlockContentManagement
  class FollowSerializer < BaseSerializer
    attributes :id, :account, :content_provider, :created_at, :updated_at
  end
end
