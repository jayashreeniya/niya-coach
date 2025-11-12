module BxBlockBulkUploading
  class AttachmentSerializer < BaseSerializer
    attributes *[
      :id, :account_id, :colour, :layout, :page_size, :scale, :print_sides,
      :print_pages_from, :print_pages_to, :total_pages, :total_attachment_pages,  :is_expired, :pdf_url, :is_printed
    ]
    attribute :attachment_path do |object|
      attachment object
    end

    attribute :content_type do |object|
      object&.attachment_blob&.content_type
    end

    attribute :file_name do |object|
      object&.attachment_blob&.filename.to_s
    end
    class << self
      private
      def attachment(object)
        object&.attachment&.service_url if object&.attachment&.attached?
      end
    end
  end
end
