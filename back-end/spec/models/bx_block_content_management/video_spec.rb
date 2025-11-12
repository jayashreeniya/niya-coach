require 'rails_helper'

RSpec.describe BxBlockContentManagement::Video, type: :model do

  describe "Associatoins" do
    it  "Should have belongs to account" do
     video =  BxBlockContentManagement::Video.reflect_on_association(:attached_item)
     expect(video.macro).to eq(:belongs_to) 
    end
  end

  describe "Validations" do
    it  "Should have present" do
     video =  BxBlockContentManagement::Video.new(attached_item_type: "mp4")
     expect(video.present?).to eq true
    end
  end
 
end