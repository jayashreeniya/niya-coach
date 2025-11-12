require 'sidekiq'

class DocumentProcessingWorker
  include Sidekiq::Worker

  def perform(docx_blob_id, file_type_id)
    docx_blob = ActiveStorage::Blob.find_by(id: docx_blob_id)
    return unless docx_blob

    begin
      local_file_path = download_file(docx_blob)
      document_content = extract_document_content(local_file_path)

      filetype = BxBlockUpload::FileType.find_by(id: file_type_id)
      if filetype
        filetype.update(file_content: document_content, file_name: docx_blob.filename.to_s)
        File.delete(local_file_path) if File.exist?(local_file_path)
      end
    rescue StandardError => e
      Rails.logger.error("Error processing document: #{e.message}")
    end
  end

  private

  def download_file(blob)
    temp_url = Rails.application.routes.url_helpers.rails_blob_url(blob, only_path: true)
    base_url = ENV['HOST_URL'] || 'http://localhost:3000'
    full_url = "#{base_url}#{temp_url}"
    local_file_path = Rails.root.join('tmp', "#{SecureRandom.hex}.docx")

    File.open(local_file_path, 'wb') do |file|
      file.write URI.open(full_url).read
    end

    local_file_path
  end

  def extract_document_content(file_path)
    doc = Docx::Document.open(file_path)
    doc.paragraphs.map(&:text).join("\n")
  end
end
