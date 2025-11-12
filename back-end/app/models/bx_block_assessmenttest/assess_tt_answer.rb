module BxBlockAssessmenttest
	class AssessTtAnswer < ApplicationRecord
		self.table_name = :assess_tt_answers
		belongs_to :assess_yourself_test_type, class_name: 'BxBlockAssessmenttest::AssessYourselfTestType'#, dependent: :destroy
	end 
end 
