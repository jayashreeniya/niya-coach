require 'rails_helper'

RSpec.describe BxBlockAssessmenttest::FocusArea, type: :model do
  it  "Should have belongs to account" do
   acc =  BxBlockAssessmenttest::FocusArea.reflect_on_association(:account)
   expect(acc.macro).to eq(:belongs_to)  
  end
end