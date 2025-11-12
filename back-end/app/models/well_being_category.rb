class WellBeingCategory < ApplicationRecord
	has_many :question_well_beings ,class_name: 'QuestionWellBeing'
end
