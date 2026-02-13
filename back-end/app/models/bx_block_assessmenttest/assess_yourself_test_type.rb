module BxBlockAssessmenttest
	class AssessYourselfTestType < ApplicationRecord
		has_many :assess_tt_answers, class_name: 'BxBlockAssessmenttest::AssessTtAnswer'
		accepts_nested_attributes_for :assess_tt_answers, allow_destroy: true

		# Required for ActiveAdmin filtering/searching
		def self.ransackable_attributes(auth_object = nil)
			["assess_yourself_answer_id", "created_at", "id", "question_title", "sequence_number", "updated_at"]
		end
		
		def self.ransackable_associations(auth_object = nil)
			["assess_tt_answers"]
		end
	end 
end
