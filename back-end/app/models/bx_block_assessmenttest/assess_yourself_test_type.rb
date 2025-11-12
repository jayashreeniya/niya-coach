module BxBlockAssessmenttest
	class AssessYourselfTestType < ApplicationRecord
		has_many :assess_tt_answers, class_name: 'BxBlockAssessmenttest::AssessTtAnswer'
		accepts_nested_attributes_for :assess_tt_answers, allow_destroy: true

	end 
end
