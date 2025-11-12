module BxBlockContentManagement
  class BookmarkSerializer < BaseSerializer
    attributes :id, :account, :content, :created_at, :updated_at
  end
end
