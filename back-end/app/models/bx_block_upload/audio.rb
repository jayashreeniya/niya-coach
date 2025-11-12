module BxBlockUpload
  class Audio < ApplicationRecord
    self.table_name = :audios

    # # # Associations
    # has_many_attached :audios
    # mount_uploader :audio, AudioUploader
    # validates :audio, attached_item_type: ['mp3'], attached: true
  end
end
