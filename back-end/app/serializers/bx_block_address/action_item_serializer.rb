module BxBlockAddress
	class ActionItemSerializer < BaseSerializer

		attributes *[
			:action_item,
			:date,
			:time_slot,
			:is_complete
		]
	end
end






