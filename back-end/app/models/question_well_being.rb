class QuestionWellBeing < ApplicationRecord
	belongs_to :category, class_name: 'WellBeingCategory', foreign_key: "category_id"
	has_many :answer_well_beings, dependent: :destroy
	accepts_nested_attributes_for :answer_well_beings, allow_destroy: true
end
