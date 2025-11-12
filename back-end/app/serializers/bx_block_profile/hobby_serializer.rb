module BxBlockProfile
  class HobbySerializer < BaseSerializer
    attributes *[
      :title,
      :category,
      :description,
      :make_public
    ]
  end
end
