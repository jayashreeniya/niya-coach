require 'rails_helper'

RSpec.describe BxBlockTimeTrackingBilling::SummaryTrack, type: :model do
  describe "Associatoins" do
    it  "Should  belongs to Account" do
     summary_track =  BxBlockTimeTrackingBilling::SummaryTrack.reflect_on_association(:account)
     expect(summary_track.macro).to eq(:belongs_to)  
    end
  end
end
