module BxBlockLanguageOptions
  class ApplicationMessageSerializer < BaseSerializer
    attributes :id, :name, :created_at, :updated_at

    attribute :translations do |object|
      TranslationSerializer.new(object.translations)
    end

  end
end
