class CoachSpecialization < ApplicationRecord
	validates :expertise, uniqueness: true
	
	before_save :clean_up_focus_areas

  validates :focus_areas, presence: true

  # Required for ActiveAdmin filtering/searching
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "expertise", "focus_areas", "id", "updated_at"]
  end

  private

  def clean_up_focus_areas
    self.focus_areas = focus_areas.compact
  end
end
