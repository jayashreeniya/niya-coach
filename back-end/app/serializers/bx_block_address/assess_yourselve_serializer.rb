module BxBlockAddress
  class AssessYourselveSerializer 
    include JSONAPI::Serializer

    attributes *[
      :title,
      :sub_title
    ]
  end
end
