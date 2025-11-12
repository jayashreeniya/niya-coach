module BxBlockAssessmenttest
	class AssessYourselfChooseAnswer < ApplicationRecord
		belongs_to :account, class_name: 'AccountBlock::Account', dependent: :destroy
	end
end
