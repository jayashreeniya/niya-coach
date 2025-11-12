module BxBlockAssessmenttest
	class ChooseAnswer < ApplicationRecord
		belongs_to :account, class_name: 'AccountBlock::Account'
	end
end
