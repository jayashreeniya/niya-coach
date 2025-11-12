module BxBlockAddress
	class GoalBoardSerializer < BaseSerializer

        attributes :current_goals do |object|
            current_goals=[]
            @goals = object&.goals&.all.order(created_at: 'desc').where(is_complete: false)
            @goals.each do |goal|
                current_goals<<{id: goal.id, goal: goal.goal,focus_area_id: goal.focus_area_id, date: goal.date, time_slot: goal.time_slot, is_complete: goal.is_complete}
            end
            current_goals
        end

        attributes :completed_goals do |object|
            complete_goals=[]
            @goals = object&.goals.all.order(created_at: 'desc').where(is_complete: true)
			@goals.each do |goal|
                complete_goals<<{id: goal.id, goal: goal.goal,focus_area_id: goal.focus_area_id, date: goal.date, time_slot: goal.time_slot, is_complete: goal.is_complete}
            end
            complete_goals
        end
	end
end
