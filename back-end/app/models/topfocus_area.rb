class TopfocusArea < ApplicationRecord
  self.table_name = :topfocus_areas
  belongs_to :account, class_name: 'AccountBlock::Account', foreign_key: 'account_id', optional: true
end
