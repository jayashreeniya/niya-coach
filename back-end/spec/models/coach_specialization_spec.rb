# spec/models/coach_specialization_spec.rb

require 'rails_helper'

RSpec.describe CoachSpecialization, type: :model do
  describe 'validations' do
    it { should validate_uniqueness_of(:expertise) }
    it { should validate_presence_of(:focus_areas) }
  end

  describe 'before_save callbacks' do
    it 'should clean up focus_areas' do
      specialization = FactoryBot.create(:coach_specialization, focus_areas: [57, nil, 60, 62])
      
      expect(specialization.focus_areas).to eq([57, 60, 62])
    end
  end
end
