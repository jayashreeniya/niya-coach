require 'rails_helper'

RSpec.describe BxBlockAssessmenttest::Goal, type: :model do
  context "association test" do 
    it "should belongs to account" do 
      a = BxBlockAssessmenttest::Goal.reflect_on_association(:account)
      expect(a.macro).to eq(:belongs_to)
    end
  end 
end
