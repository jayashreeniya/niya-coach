module BxBlockAssessmenttest
	class AssesmentTestQuestion < ApplicationRecord
		has_many :assesment_test_answers, class_name: 'BxBlockAssessmenttest::AssesmentTestAnswer' ,dependent: :destroy
		accepts_nested_attributes_for :assesment_test_answers, allow_destroy: true

		# Required for ActiveAdmin filtering/searching
		def self.ransackable_attributes(auth_object = nil)
			["created_at", "id", "updated_at"]
		end
	end
end
