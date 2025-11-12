module BxBlockLike
  class LikeSerializer < BaseSerializer
    attributes(:likeable_id, :likeable_type, :like_by_id, :created_at, :updated_at)
  end
end
