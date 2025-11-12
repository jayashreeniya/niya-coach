module BxBlockProfile
  class ProfileSerializer < BaseSerializer
    attributes *[
      :id,
      :country,
      :address,
      :city,
      :postal_code,
      :account_id,
      :profile_role
    ]

    attributes :photo do |object|
      Rails.application.routes.url_helpers.rails_blob_path(object.photo, only_path: true) if object.photo.attached?
    end

  end
end
