module BxBlockAddress
	class MyProgressSerializer
		include FastJsonapi::ObjectSerializer
	    
		attributes :focus_areas do |object|
      goals = []
			colors = ["red", "orange", "yellow", "blue","green"]
			focus_areas_id = BxBlockAssessmenttest::StoringFocusArea.where(account_id: object&.id).last.focus_areas_id
			account_id = object&.id
      focus_areas_id.each do|obj|
				if BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: obj).blank?
					focus_area = BxBlockAssessmenttest::WellBeingFocusArea.find(obj).answers
				else
					focus_area = BxBlockAssessmenttest::AssesmentTestTypeAnswer.find(obj).answers
				end
        total_goals = BxBlockAssessmenttest::Goal.where(focus_area_id: obj ,account_id: account_id).count
				if total_goals > 0
					completed_goals = BxBlockAssessmenttest::Goal.where(focus_area_id: obj,account_id: account_id,is_complete: true).count
					percentage = ((completed_goals.to_f/total_goals.to_f)*100).to_i

					color = colors[0] if percentage <= 20 && percentage >= 0
					color = colors[1] if percentage <= 40 && percentage > 20
					color = colors[2] if percentage <= 60 && percentage > 40
					color = colors[3] if percentage <= 80 && percentage > 60
					color = colors[4] if percentage <= 100 && percentage > 80
					goals << {focus_area: focus_area,total_goals: total_goals,completed_goals: completed_goals, percentage: percentage, color: color}
				end
			end  
			goals
	  end   
	end
end
