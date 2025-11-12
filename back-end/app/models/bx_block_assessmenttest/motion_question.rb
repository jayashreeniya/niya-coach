module BxBlockAssessmenttest
	class MotionQuestion < ApplicationRecord
		self.table_name = :motion_questions
		validates :motion_id, presence: true
		has_many :motion_answers, class_name: 'BxBlockAssessmenttest::MotionAnswer' ,dependent: :destroy
		belongs_to :motion, class_name: 'BxBlockAssessmenttest::Motion', dependent: :destroy
		accepts_nested_attributes_for :motion_answers, allow_destroy: true
	end
end
