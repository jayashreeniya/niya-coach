module BxBlockUpload  
  class FileType < ApplicationRecord
    self.table_name = :file_types
    belongs_to :multiple_upload_file, class_name: 'BxBlockUpload::MultipleUploadFile'
    
    has_one_attached :multiple_file
    has_one_attached :text_file
    has_one_attached :image

    validate :image_content_type_validation
    validate :image_size_validation

    # Required for ActiveAdmin filtering/searching
    def self.ransackable_attributes(auth_object = nil)
      ["assesment_test_type_answer_id", "created_at", "file_content", "file_discription", "file_name", "focus_areas", "id", "multiple_upload_file_id", "text_file_to_str", "updated_at", "well_being_focus_areas"]
    end

    def self.ransackable_associations(auth_object = nil)
      ["image_attachment", "image_blob", "multiple_file_attachment", "multiple_file_blob", "multiple_upload_file", "text_file_attachment", "text_file_blob"]
    end

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
