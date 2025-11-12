module BxBlockAssessmenttest
	class AssessYourselve < ApplicationRecord
		validates :title, presence: true
		validates :sub_title, presence: true
	end
end

