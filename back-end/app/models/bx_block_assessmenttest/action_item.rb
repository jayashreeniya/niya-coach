module BxBlockAssessmenttest	
	class ActionItem < ApplicationRecord
		self.table_name = :action_items
		belongs_to :account, class_name: 'AccountBlock::Account', foreign_key: 'account_id'
		validates_presence_of :action_item
	end
end
