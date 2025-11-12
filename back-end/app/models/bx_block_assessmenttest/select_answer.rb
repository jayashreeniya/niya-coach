module BxBlockAssessmenttest
	class SelectAnswer < ApplicationRecord
		belongs_to :account, class_name: 'AccountBlock::Account'
	end
end
