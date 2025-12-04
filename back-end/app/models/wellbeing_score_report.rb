class WellbeingScoreReport < ApplicationRecord
	belongs_to :account, class_name: "AccountBlock::Account"

	# Required for ActiveAdmin filtering/searching
	def self.ransackable_attributes(auth_object = nil)
		["account_id", "created_at", "id", "updated_at"]
	end
end
