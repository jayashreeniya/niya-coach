module BxBlockAssessmenttest	
	class AnixetyCutoff < ApplicationRecord
		self.table_name = :anixety_cutoffs
		validates :color, presence: true
	end	
end





