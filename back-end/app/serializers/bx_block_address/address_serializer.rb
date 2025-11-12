module BxBlockAddress
  class AddressSerializer < BaseSerializer
    attributes(:latitude, :longitude, :address, :address_type)
  end
end
