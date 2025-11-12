module BxBlockUpload
	class BulkUpload < ApplicationRecord
		self.table_name = :bulk_uploads
    has_one_attached :csv_file
	end
end
