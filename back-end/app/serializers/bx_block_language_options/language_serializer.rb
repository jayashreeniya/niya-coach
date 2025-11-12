module BxBlockLanguageOptions
  class LanguageSerializer < BaseSerializer
    attributes :id, :name, :language_code, :created_at, :updated_at
  end
end
