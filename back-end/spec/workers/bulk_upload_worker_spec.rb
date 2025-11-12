require 'rails_helper'
require 'sidekiq/testing'
# require 'rspec/sidekiq'

RSpec.describe BulkUploadWorker, type: :worker do
  let(:bulk_upload) { create(:bulk_upload) }

  before do
    Sidekiq::Testing.fake!
  end

  after do
    Sidekiq::Testing.disable!
  end

  describe '#perform the bulk upload background job' do
    before do
      csv_data = "file type,file path,file content,file name,file description,focus areas\n" \
      "docs,https://docs.google.com/document/d/15KQSle-E3fT0lOwC8SUlwW8zKmK6W1Um/edit?usp=drive_link,Audio Content,AudioFile,Description,[1,2]"

      csv_file = Tempfile.new(['test_bulk_upload', '.csv'])
      csv_file.write(csv_data)
      csv_file.rewind

      bulk_upload.csv_file.attach(io: csv_file, filename: 'test_bulk_upload.csv')
    end

    it 'will processes the bulk upload' do
      expect {
        BulkUploadWorker.new.perform(bulk_upload.id)
      }.to change(BxBlockUpload::FileType, :count).by(1)

      BulkUploadWorker.new.perform(bulk_upload.id)
      last_file_type = BxBlockUpload::FileType.last
      expect(last_file_type.file_name).to eq('AudioFile')
    end

    it 'will processes the bulk upload' do
     
      allow(URI).to receive(:open).and_raise(OpenURI::HTTPError.new("404 Not Found", nil))
      expect {
        BulkUploadWorker.new.perform(bulk_upload.id)
      }.to change(BxBlockUpload::FileType, :count).by(1)
    end
  end
end
