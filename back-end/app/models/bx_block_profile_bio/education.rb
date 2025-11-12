# frozen_string_literal: true

module BxBlockProfileBio
  class Education < BxBlockProfileBio::ApplicationRecord
    self.table_name = :educations

    include Wisper::Publisher
    belongs_to :profile_bio
  end
end
