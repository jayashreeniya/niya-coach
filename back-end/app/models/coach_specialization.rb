class CoachSpecialization < ApplicationRecord
	# Serialize focus_areas as array for MySQL compatibility
	serialize :focus_areas, Array
	
	validates :expertise, uniqueness: true
	
	before_validation :clean_up_focus_areas
	validate :focus_areas_must_have_values

  # Required for ActiveAdmin filtering/searching
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "expertise", "focus_areas", "id", "updated_at"]
  end

  private

  def clean_up_focus_areas
    # Remove nil and empty string values from focus_areas array
    self.focus_areas = focus_areas.compact.reject(&:blank?) if focus_areas.is_a?(Array)
  end

  def focus_areas_must_have_values
    if focus_areas.blank? || focus_areas.compact.reject(&:blank?).empty?
      errors.add(:focus_areas, "can't be blank")
    end
  end
end
