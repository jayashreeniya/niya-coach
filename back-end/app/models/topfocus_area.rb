class TopfocusArea < ApplicationRecord
  self.table_name = :topfocus_areas
  belongs_to :account, class_name: 'AccountBlock::Account', foreign_key: 'account_id', optional: true

  # Serialize array fields as JSON for MySQL compatibility
  serialize :select_focus_area_id, JSON
  serialize :wellbeingfocus_id, JSON

  # Ensure arrays are initialized
  after_initialize do
    self.select_focus_area_id ||= []
    self.wellbeingfocus_id ||= []
  end
end
