module BxBlockUpload  
  class FileType < ApplicationRecord
    self.table_name = :file_types
    belongs_to :multiple_upload_file, class_name: 'BxBlockUpload::MultipleUploadFile'
    
    has_one_attached :multiple_file
    has_one_attached :text_file
    has_one_attached :image

    validate :image_content_type_validation
    validate :image_size_validation

    private

    def image_content_type_validation
      return unless image.attached?
      
      unless image.content_type.in?(%w[image/jpeg image/png image/gif])
        errors.add(:image, 'must be a valid image format')
      end
    end

    def image_size_validation
      return unless image.attached?
      
      if image.byte_size > 5.megabytes
        errors.add(:image, 'Image is too large, upload less than 5mb.')
      end
    end

    def thumb_image
    	image.variant(resize_to_limit: [100, 100], quality: 70).processed
    end

    def compressed_image_url
    	Rails.application.routes.url_helpers.rails_representation_url(image.variant(resize: "720x500").processed, only_path: true)
    end
  end
end
