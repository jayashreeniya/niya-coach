module BxBlockAssessmenttest
	class ChooseMotionAnswer < ApplicationRecord
		self.table_name = :choose_motion_answers
		belongs_to :account, class_name: 'AccountBlock::Account'
		belongs_to :select_motion, class_name: 'BxBlockAssessmenttest::SelectMotion'
	end
end

