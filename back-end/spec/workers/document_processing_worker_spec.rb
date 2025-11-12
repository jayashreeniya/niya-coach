require 'rails_helper'
require 'sidekiq/testing'

RSpec.describe DocumentProcessingWorker, type: :worker do
  before do
    Sidekiq::Testing.fake! 
  end

  after do
    Sidekiq::Testing.disable!
  end

  # describe '#perform' do
  #   it 'processes the document and updates FileType' do
  #     Support::SharedHelper.new.create_wellbeing

  #     download_link = "https://docs.google.com/document/d/15KQSle-E3fT0lOwC8SUlwW8zKmK6W1Um/edit?usp=drive_link"
  #     file_contents = URI.open(download_link).read
  #     blob = ActiveStorage::Blob.create_and_upload!(
  #       io: StringIO.new(file_contents),
  #       filename: "abcefg",
  #       content_type: 'audio/mpeg'
  #     )
  #     file_type = BxBlockUpload::FileType.find_or_create_by(id: 12, file_name: "sample-document.pdf", file_discription: "enter pdf format only for docs", assesment_test_type_answer_id: 170, multiple_upload_file_id: 96, created_at: "2023-07-02 10:04:43", updated_at: "2023-07-02 10:04:44", focus_areas: ["60", "61", "62"], text_file_to_str: nil, text_file: nil, file_content: "audio file", well_being_focus_areas: [])
  #     file_type.multiple_file.attach(blob)
  #     docx_blob = file_type.multiple_file.blob
    
  #     expect {
  #           DocumentProcessingWorker.new.perform(docx_blob.id, file_type.id)
  #         }.not_to raise_error
     
  #   end

  describe '#perform' do
  let(:full_url) { 'http://example.com/file.txt' }
  let(:local_file_path) { 'path/to/your/local/file.txt' }

    it 'processes the document and updates FileType' do
      Support::SharedHelper.new.create_wellbeing

      download_link = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      file_contents = URI.open(download_link).read
      blob = ActiveStorage::Blob.create_and_upload!(
        io: StringIO.new(file_contents),
        filename: "abcefg",
        content_type: 'audio/mpeg'
      )
      file_type = BxBlockUpload::FileType.find_or_create_by(id: 12, file_name: "sample-document.pdf", file_discription: "enter pdf format only for docs", assesment_test_type_answer_id: 170, multiple_upload_file_id: 96, created_at: "2023-07-02 10:04:43", updated_at: "2023-07-02 10:04:44", focus_areas: ["60", "61", "62"], text_file_to_str: nil, text_file: nil, file_content: "audio file", well_being_focus_areas: [])
      file_type.multiple_file.attach(blob)
      docx_blob = file_type.multiple_file.blob
   
      allow(File).to receive(:open).and_yield(instance_double(File, write: nil))
      allow(URI).to receive(:open).and_return(instance_double(IO, read: 'document content'))

      # Mock Docx::Document.open
      doc_double = instance_double(Docx::Document, paragraphs: ["Paragraph one"])
      allow(Docx::Document).to receive(:open).and_return(doc_double)

      # Mock BxBlockUpload::FileType
      allow(BxBlockUpload::FileType).to receive(:find_by).and_return(instance_double(BxBlockUpload::FileType, update: nil, present?: true))

    
      expect {
            DocumentProcessingWorker.new.perform(docx_blob.id, file_type.id)
          }.not_to raise_error
     
    end

 
  end
end
