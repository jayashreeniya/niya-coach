module BxBlockAssessmenttest	
	class AssesmentTestTypeAnswer < ApplicationRecord
		belongs_to :assesment_test_type, class_name: 'BxBlockAssessmenttest::AssesmentTestType'
		has_many :file_types, class_name: 'BxBlockUpload::FileType', dependent: :destroy
	end
end
