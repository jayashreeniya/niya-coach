module BxBlockContentManagement
  class TagSerializer < BaseSerializer
    attributes :id, :name, :taggings_count, :created_at, :updated_at
  end
end
