class CoachSpecialization < ApplicationRecord
	validates :expertise, uniqueness: true
	
	before_save :clean_up_focus_areas

  validates :focus_areas, presence: true

  private

  def clean_up_focus_areas
    self.focus_areas = focus_areas.compact
  end
end
