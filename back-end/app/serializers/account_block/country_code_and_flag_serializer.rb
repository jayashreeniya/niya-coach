module AccountBlock
  class CountryCodeAndFlagSerializer < BaseSerializer
    attributes :name, :emoji_flag

    set_id do |object|
      object.alpha2
    end

    attribute :country_code do |object|
      object.nanp_prefix || object.country_code
    end
  end
end
