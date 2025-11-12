module BxBlockPosts
  class ErrorSerializer < BaseSerializer
    attribute :errors do |post|
      post.errors.as_json
    end
  end
end
