module BxBlockCategories
  class ErrorSerializer < BaseSerializer
    attribute :errors do |coupon|
      coupon.errors.as_json
    end
  end
end
