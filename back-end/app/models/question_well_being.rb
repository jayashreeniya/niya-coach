class QuestionWellBeing < ApplicationRecord
	belongs_to :category, class_name: 'WellBeingCategory', foreign_key: "category_id", optional: true
	has_many :answer_well_beings, dependent: :destroy
	accepts_nested_attributes_for :answer_well_beings, allow_destroy: true

  # Required for ActiveAdmin filtering/searching
  def self.ransackable_attributes(auth_object = nil)
    ["category_id", "created_at", "id", "question", "sequence", "subcategory_id", "updated_at"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["answer_well_beings", "category"]
  end
end
