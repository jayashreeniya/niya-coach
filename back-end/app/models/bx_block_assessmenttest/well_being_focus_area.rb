module BxBlockAssessmenttest
	class WellBeingFocusArea < ApplicationRecord
		self.table_name = :well_being_focus_areas
		# belongs_to :sub_categories, class_name: "BxBlockCategories::SubCategory" , dependent: :destroy
		# validates :well_being_sub_categoryid, uniqueness: true, presence: true

		# Serialize multiple_account as JSON array for MySQL compatibility
		serialize :multiple_account, JSON

		# Ensure multiple_account is always an array
		after_initialize do
			self.multiple_account ||= []
		end

    # Required for ActiveAdmin filtering/searching
    def self.ransackable_attributes(auth_object = nil)
      ["answers", "created_at", "id", "name", "updated_at", "well_being_sub_categoryid"]
    end
	end
end



