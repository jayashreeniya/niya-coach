class WellbeingScoreReport < ApplicationRecord
	belongs_to :account, class_name: "AccountBlock::Account"

	# Required for ActiveAdmin filtering/searching
	def self.ransackable_attributes(auth_object = nil)
		["account_id", "category_id", "category_result", "created_at", "id", "sub_category_result", "submitted_at", "updated_at"]
	end
	
	def self.ransackable_associations(auth_object = nil)
		["account"]
	end
end
