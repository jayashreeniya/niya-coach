module BxBlockCatalogue
  class ErrorSerializer < BaseSerializer
    attribute :errors do |catalogue|
      catalogue.errors.as_json
    end
  end
end
