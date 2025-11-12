module BxBlockAssessmenttest
	class AssessYourselfAnswer < ApplicationRecord
		belongs_to :assess_yourself_question, class_name: 'BxBlockAssessmenttest::AssessYourselfQuestion' 
		has_many :assess_yourself_test_types, class_name: 'BxBlockAssessmenttest::AssessYourselfTestType', dependent: :destroy
	 
	end
end
