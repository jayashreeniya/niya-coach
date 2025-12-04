module BxBlockAssessmenttest	
	class AnixetyCutoff < ApplicationRecord
		self.table_name = :anixety_cutoffs
		validates :color, presence: true

		# Required for ActiveAdmin filtering/searching
		def self.ransackable_attributes(auth_object = nil)
			["color", "created_at", "id", "updated_at"]
		end
	end	
end





