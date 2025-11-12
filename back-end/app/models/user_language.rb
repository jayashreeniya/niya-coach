class UserLanguage < ApplicationRecord
	belongs_to :account, class_name: "AccountBlock::Account"
end
