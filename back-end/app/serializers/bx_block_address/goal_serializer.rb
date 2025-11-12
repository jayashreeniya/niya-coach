module BxBlockAddress
	class GoalSerializer < BaseSerializer

		attributes *[
			:goal,
			:date,
			:time_slot,
			:is_complete
		]
		attribute :focus_area do|obj|
			if BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: obj.focus_area_id).blank?
				focus_area = BxBlockAssessmenttest::WellBeingFocusArea.find(obj.focus_area_id).answers
			else
				focus_area = BxBlockAssessmenttest::AssesmentTestTypeAnswer.find(obj.focus_area_id).answers
			end
		end
	end
end






