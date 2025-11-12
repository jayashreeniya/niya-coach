require 'rails_helper'

RSpec.describe BxBlockAssessmenttest::MotionQuestion, type: :model do
  context "association test" do 
    it "should belongs to motion" do 
      a = BxBlockAssessmenttest::MotionQuestion.reflect_on_association(:motion)
      expect(a.macro).to eq(:belongs_to)
    end
    
    it "should has many motion answers" do 
      a = BxBlockAssessmenttest::MotionQuestion.reflect_on_association(:motion_answers)
      expect(a.macro).to eq(:has_many)
    end
   end 

    # before do 
    #     @user = User.create!(email: "jerryhoglen@me.com", password: "Maggie1!")
    # end

    # it "is invalid without a motion_id" do
    #   expect(build(:comment, motion_id:nil)).to_not be_valid
    # end

end
