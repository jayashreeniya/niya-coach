module BxBlockAttachment
  module PatchAccountBlockAssociations
    extend ActiveSupport::Concern

    included do
      has_many :attachments, class_name: 'BxBlockAttachment::Attachment', dependent: :destroy
    end

  end
end
