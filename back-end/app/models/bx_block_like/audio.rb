module BxBlockLike
  class Audio < ApplicationRecord
    self.table_name = :audios
    # mount_uploader :audio, AudioUploader
    # # Associations
    # belongs_to :attached_item, polymorphic: true

    # validates_presence_of :audio
  end
end
