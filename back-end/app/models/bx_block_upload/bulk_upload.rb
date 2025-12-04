module BxBlockUpload
	class BulkUpload < ApplicationRecord
		self.table_name = :bulk_uploads
    has_one_attached :csv_file

		# Required for ActiveAdmin filtering/searching
		def self.ransackable_attributes(auth_object = nil)
			["created_at", "id", "updated_at"]
		end
	end
end
