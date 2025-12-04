class WellBeingCategory < ApplicationRecord
	has_many :question_well_beings ,class_name: 'QuestionWellBeing'

  # Required for ActiveAdmin filtering/searching
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "name", "updated_at"]
  end

  # Required for Ransack 4.0 - associations must be explicitly allowlisted
  def self.ransackable_associations(auth_object = nil)
    ["question_well_beings"]
  end
end
