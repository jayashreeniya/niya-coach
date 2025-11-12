require 'rails_helper'

RSpec.describe BxBlockLike::Audio, type: :model do
 it "is valid with valid attributes" do
     expect(BxBlockLike::Audio.new).to be_valid
   end
end