module BxBlockAssessmenttest
	class StoringFocusArea < ApplicationRecord
		self.table_name = :storing_focusareas
		
		# Serialize focus_areas_id as JSON array since MySQL doesn't support native arrays
		serialize :focus_areas_id, JSON
		
		after_initialize do
			self.focus_areas_id ||= []
		end
	end
end
