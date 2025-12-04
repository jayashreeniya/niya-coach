class WellBeingSubCategory < ApplicationRecord
  # Required for ActiveAdmin filtering/searching
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "name", "sub_category_name", "updated_at", "well_being_category_id"]
  end
end
