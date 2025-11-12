module BxBlockAssessmenttest
	class SelectMotion < ApplicationRecord
		self.table_name = :select_motions
		belongs_to :account, class_name: 'AccountBlock::Account'
		validates :motion_select_date, :uniqueness => {:scope => :account_id}
		has_many :choose_motion_answers, class_name: 'BxBlockAssessmenttest::ChooseMotionAnswer'
	end
end

