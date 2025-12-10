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

  # Required for ActiveAdmin associations
  def self.ransackable_associations(auth_object = nil)
    []
  end

  private

  def clean_up_focus_areas
    return if focus_areas.nil?
    
    # Handle both array and string inputs
    if focus_areas.is_a?(String)
      # If it's a string, try to parse it
      begin
        self.focus_areas = YAML.load(focus_areas) rescue [focus_areas]
      rescue
        self.focus_areas = [focus_areas]
      end
    end
    
    # Clean up the array: remove nil, empty strings, and convert to integers
    if focus_areas.is_a?(Array)
      cleaned = focus_areas
        .compact
        .reject { |v| v.blank? || v.to_s.strip.empty? }
        .map { |v| v.to_s.strip.to_i }
        .uniq
        .reject(&:zero?)
      
      self.focus_areas = cleaned
    end
  end

  def focus_areas_must_have_values
    if focus_areas.blank? || focus_areas.empty?
      errors.add(:focus_areas, "must select at least one focus area")
    end
  end
end
