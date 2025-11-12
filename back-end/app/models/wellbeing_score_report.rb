class WellbeingScoreReport < ApplicationRecord
	belongs_to :account, class_name: "AccountBlock::Account"
end
