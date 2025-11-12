module BxBlockRating
    class CoachRating < ApplicationRecord
        validates :account_id, presence: true
        validates :coach_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true 
        before_save  :update_rating
        def update_rating
        	self.coach_rating=self.coach_rating&.round(1)
        end
    end
end
