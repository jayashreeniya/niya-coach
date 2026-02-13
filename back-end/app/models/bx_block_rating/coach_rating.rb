module BxBlockRating
    class CoachRating < ApplicationRecord
        validates :account_id, presence: true
        validates :coach_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true 
        before_save  :update_rating

        # Required for ActiveAdmin filtering/searching
        def self.ransackable_attributes(auth_object = nil)
          ["account_id", "app_rating", "coach_id", "coach_rating", "created_at", "feedback", "id", "organisation", "updated_at"]
        end
        
        def self.ransackable_associations(auth_object = nil)
          []
        end

        def update_rating
        	self.coach_rating=self.coach_rating&.round(1)
        end
    end
end
