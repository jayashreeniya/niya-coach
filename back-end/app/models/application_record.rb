# Base application record class to replace ApplicationRecord
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
end
