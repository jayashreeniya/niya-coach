class BulkUploadWorker
  include Sidekiq::Worker
  require 'sidekiq-scheduler'
  require 'open-uri'
  require 'csv'

  def perform(bulk_upload_id)
    bulk_upload = BxBlockUpload::BulkUpload.find_by(id: bulk_upload_id)
    return if bulk_upload.nil?
    csv_blob = bulk_upload.csv_file.blob
    csv_data = CSV.parse(csv_blob.download, headers: true) 
    data = []
    csv_data.map do |row|
      data << {type: row['file type'],path: row['file path'],content: row['file content'],name: row['file name'],description: row['file description'],focus_area: row['focus areas']}
    end
    data.map do|obj|
      if obj[:type] == "audios" || obj[:type] == "videos" || obj[:type] == "docs"
        focus_areas = obj[:focus_area].split(',')
        file_type = obj[:type] 
        mutiplefileupload = BxBlockUpload::MultipleUploadFile.create(choose_file: file_type)
        id = BxBlockAssessmenttest::AssesmentTestTypeAnswer.first.id        
        file_upload = BxBlockUpload::FileType.create(file_name: obj[:name], file_discription: obj[:description] , assesment_test_type_answer_id: id, multiple_upload_file_id: mutiplefileupload.id, focus_areas: focus_areas ,file_content: obj[:content])
        if obj[:path].present?
          drive_path = obj[:path]
          file_id = drive_path.match(/[-\w]{25,}/).to_s
          download_link = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
          begin
            file_contents = URI.open(download_link).read
          rescue OpenURI::HTTPError => e
            Rails.logger.error("Failed to download file from Google Drive. Error: #{e.message}")
            next  # Skip to the next iteration if download fails
          end
          blob = ActiveStorage::Blob.create_after_upload!( io: StringIO.new(file_contents),filename: obj[:name], content_type: 'audio/mpeg')
          file_upload.multiple_file.attach(blob)
          if mutiplefileupload.choose_file == 'docs'
            blob = file_upload.multiple_file.blob
            DocumentProcessingWorker.perform_async(blob.id , file_upload.id)
          end
        end
      end
    end
  end
end
