class TermsAndCondition < ApplicationRecord
  # Required for ActiveAdmin filtering/searching
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "updated_at"]
  end
end
