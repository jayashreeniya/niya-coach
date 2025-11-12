module BxBlockRating
    class AppRating < ApplicationRecord
        validates :app_rating, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true
        validates :account_id, presence: true
        before_save  :update_rating
        def update_rating
        	self.app_rating=self.app_rating&.round(1)
        end
    end
end
