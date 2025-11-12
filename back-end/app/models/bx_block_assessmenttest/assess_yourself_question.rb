module BxBlockAssessmenttest
	class AssessYourselfQuestion < ApplicationRecord
		has_many  :assess_yourself_answers, class_name: 'BxBlockAssessmenttest::AssessYourselfAnswer', dependent: :destroy
		accepts_nested_attributes_for :assess_yourself_answers, allow_destroy: true
	end
end
