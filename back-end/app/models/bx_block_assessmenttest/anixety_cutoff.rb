module BxBlockAssessmenttest	
	class AnixetyCutoff < ApplicationRecord
		self.table_name = :anixety_cutoffs
		validates :color, presence: true

		# Required for ActiveAdmin filtering/searching
		def self.ransackable_attributes(auth_object = nil)
			["anixety_title", "category_id", "color", "created_at", "id", "max_score", "min_score", "updated_at"]
		end
		
		def self.ransackable_associations(auth_object = nil)
			[]
		end
	end	
end





