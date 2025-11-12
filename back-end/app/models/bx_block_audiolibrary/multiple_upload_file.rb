module BxBlockAudiolibrary	
	class MultipleUploadFile < ApplicationRecord
		self.table_name = :bx_block_audiolibrary_multiple_upload_files
		has_many :file_types, class_name: 'BxBlockAudiolibrary::FileType', dependent: :destroy
		accepts_nested_attributes_for :file_types, allow_destroy: true
		has_many :assesment_test_type_answer, class_name: 'BxBlockAssessmenttest::AssesmentTestTypeAnswer', foreign_key: 'assesment_test_type_answer_id'

		enum choose_file: [:audios, :videos, :docs]
	end
end
