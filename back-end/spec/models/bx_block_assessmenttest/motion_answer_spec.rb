require 'rails_helper'

RSpec.describe BxBlockAssessmenttest::MotionAnswer, type: :model do
  # pending "add some examples to (or delete) #{__FILE__}"
  context "association test" do 

    it "should belongs to motion question" do 
      a = BxBlockAssessmenttest::MotionAnswer.reflect_on_association(:motion_question)
      expect(a.macro).to eq(:belongs_to)
    end
    
  end
end
