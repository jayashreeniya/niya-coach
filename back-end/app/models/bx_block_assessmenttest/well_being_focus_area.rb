module BxBlockAssessmenttest
	class WellBeingFocusArea < ApplicationRecord
		self.table_name = :well_being_focus_areas
		# belongs_to :sub_categories, class_name: "BxBlockCategories::SubCategory" , dependent: :destroy
		# validates :well_being_sub_categoryid, uniqueness: true, presence: true
	end
end



