module BxBlockAssessmenttest
	class AssessSelectAnswer < ApplicationRecord
		self.table_name = :assess_select_answers
		belongs_to :account, class_name: 'AccountBlock::Account', dependent: :destroy, optional: true 
	end
end
