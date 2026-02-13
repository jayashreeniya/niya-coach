module BxBlockUpload	
	class MultipleUploadFile < ApplicationRecord
		self.table_name = :multiple_upload_files
		has_many :file_types, class_name: 'BxBlockUpload::FileType', dependent: :destroy
		accepts_nested_attributes_for :file_types, allow_destroy: true
		has_many :assesment_test_type_answer, class_name: 'BxBlockAssessmenttest::AssesmentTestTypeAnswer', foreign_key: 'assesment_test_type_answer_id'

		enum choose_file: [:audios, :videos, :docs]

		# Required for ActiveAdmin filtering/searching
		def self.ransackable_attributes(auth_object = nil)
			["choose_file", "created_at", "id", "updated_at"]
		end

		def self.ransackable_associations(auth_object = nil)
			["file_types", "assesment_test_type_answer"]
		end
	end
end
