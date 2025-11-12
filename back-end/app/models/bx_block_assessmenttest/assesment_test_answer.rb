module BxBlockAssessmenttest
	class AssesmentTestAnswer < ApplicationRecord
		belongs_to :assesment_test_question, class_name: 'BxBlockAssessmenttest::AssesmentTestQuestion'
		has_one :assesment_test_type, class_name: 'BxBlockAssessmenttest::AssesmentTestType', dependent: :destroy
	end
end
