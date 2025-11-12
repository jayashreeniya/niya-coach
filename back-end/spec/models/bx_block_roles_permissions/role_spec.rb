
require 'rails_helper'

RSpec.describe BxBlockRolesPermissions::Role, type: :model do

  let(:role_name_1) {BxBlockRolesPermissions::Role.new(name: "hr")}
  let(:role_name_2) {BxBlockRolesPermissions::Role.new(name: "test")}
 

  describe "Associations" do
    it {should have_many(:accounts)}
  end

  describe "Validations" do
    it "return error message when name present" do
      role_name_1.save
      expect(role_name_1.errors.full_messages).to eq ["Name Role already present"]
    end
  end

  describe "enum column" do
    it "return error message when name is not valid" do
      begin
        role_name_2.save
      rescue Exception => e
        expect(e.message).to eq ("'test' is not a valid name")
      end
    end
  end
end