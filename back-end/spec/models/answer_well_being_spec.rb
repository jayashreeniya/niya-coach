require 'rails_helper'

RSpec.describe AnswerWellBeing, type: :model do
  describe "Associations" do
     it { should belong_to(:question_well_being)}
  end
end