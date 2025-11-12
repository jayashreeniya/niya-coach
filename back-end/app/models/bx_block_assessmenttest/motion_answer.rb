module BxBlockAssessmenttest
	class MotionAnswer < ApplicationRecord
		self.table_name = :motion_answers
		belongs_to :motion_question, class_name:'BxBlockAssessmenttest::MotionQuestion'
	end
end
