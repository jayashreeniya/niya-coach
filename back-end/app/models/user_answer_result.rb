class UserAnswerResult < ApplicationRecord
  # Required for ActiveAdmin filtering/searching
  def self.ransackable_attributes(auth_object = nil)
    ["advice", "category_id", "created_at", "id", "max_score", "min_score", "score_level", "subcategory_id", "updated_at"]
  end
end
