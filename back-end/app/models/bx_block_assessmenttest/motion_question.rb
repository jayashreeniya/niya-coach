module BxBlockAssessmenttest
	class MotionQuestion < ApplicationRecord
		self.table_name = :motion_questions
		validates :motion_id, presence: true
		has_many :motion_answers, class_name: 'BxBlockAssessmenttest::MotionAnswer' ,dependent: :destroy
		belongs_to :motion, class_name: 'BxBlockAssessmenttest::Motion', dependent: :destroy
		accepts_nested_attributes_for :motion_answers, allow_destroy: true

		# Required for ActiveAdmin filtering/searching
		def self.ransackable_attributes(auth_object = nil)
			["created_at", "id", "motion_id", "updated_at"]
		end
	end
end
