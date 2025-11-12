module BxBlockContentManagement
  class ErrorSerializer < BaseSerializer
    attribute :errors do |follow|
      follow.errors.as_json
    end
  end
end
