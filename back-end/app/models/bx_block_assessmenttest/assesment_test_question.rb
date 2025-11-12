module BxBlockAssessmenttest
	class AssesmentTestQuestion < ApplicationRecord
		has_many :assesment_test_answers, class_name: 'BxBlockAssessmenttest::AssesmentTestAnswer' ,dependent: :destroy
		accepts_nested_attributes_for :assesment_test_answers, allow_destroy: true
	end
end
