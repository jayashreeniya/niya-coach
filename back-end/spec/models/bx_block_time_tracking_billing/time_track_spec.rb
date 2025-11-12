require 'rails_helper'

RSpec.describe BxBlockTimeTrackingBilling::TimeTrack, type: :model do
  describe "Associatoins" do
    it  "Should  belongs to Account" do
     time_track =  BxBlockTimeTrackingBilling::TimeTrack.reflect_on_association(:account)
     expect(time_track.macro).to eq(:belongs_to)  
    end
  end
end
