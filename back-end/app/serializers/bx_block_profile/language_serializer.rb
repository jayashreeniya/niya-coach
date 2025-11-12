module BxBlockProfile
  class LanguageSerializer < BaseSerializer
    attributes *[
     :id,
     :language,
     :proficiency,
     :profile_id
    ]
  end
end
