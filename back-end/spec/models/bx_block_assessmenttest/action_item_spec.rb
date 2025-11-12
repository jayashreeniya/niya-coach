require 'rails_helper'

RSpec.describe BxBlockAssessmenttest::ActionItem, type: :model do
  describe "Associatoins" do
    it  "Should  belongs to Account" do
     action_item =  BxBlockAssessmenttest::ActionItem.reflect_on_association(:account)
     expect(action_item.macro).to eq(:belongs_to)  
    end
  end
end
