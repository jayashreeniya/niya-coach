require 'rails_helper'

RSpec.describe BxBlockUpload::MultipleUploadFile, type: :model do
  let(:choose_file) {BxBlockUpload::MultipleUploadFile.new(choose_file: :video)}
  describe "Associations" do
    it { should have_many(:file_types) }
    it { should accept_nested_attributes_for(:file_types) }

    it "should have many focus_areas" do
      answer =  BxBlockUpload::MultipleUploadFile.reflect_on_association(:assesment_test_type_answer)
      expect(answer.macro).to eq(:has_many)
    end
  end
  describe "enum column" do
    it "choose file types should be videos type not others" do
      begin
        choose_file.save
      rescue Exception => e
        expect(e.message).to eq ("'video' is not a valid choose_file")
      end
    end
  end
end