module BxBlockProfile
  class PublicationPatentSerializer < BaseSerializer
    attributes *[
      :title,
      :publication,
      :authors,
      :url,
      :description,
      :make_public,
      :profile_id
    ]
  end
end
