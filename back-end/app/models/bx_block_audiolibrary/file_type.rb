module BxBlockAudiolibrary
	class FileType < ApplicationRecord
		self.table_name = :bx_block_audiolibrary_file_types
		belongs_to :multiple_upload_file, class_name: 'BxBlockAudiolibrary::MultipleUploadFile'
		
		has_one_attached :multiple_file
		has_one_attached :text_file


	end
end
