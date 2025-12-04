module BxBlockAssessmenttest
	class AssesmentTestType < ApplicationRecord
		has_many :assesment_test_type_answers, class_name: 'BxBlockAssessmenttest::AssesmentTestTypeAnswer' ,dependent: :destroy
		accepts_nested_attributes_for :assesment_test_type_answers, allow_destroy: true
		belongs_to :assesment_test_answer, class_name: 'BxBlockAssessmenttest::AssesmentTestAnswer', dependent: :destroy

		# Required for ActiveAdmin filtering/searching
		def self.ransackable_attributes(auth_object = nil)
			["created_at", "id", "updated_at"]
		end
	end
end
