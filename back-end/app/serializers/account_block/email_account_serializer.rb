module AccountBlock
  class EmailAccountSerializer
    include FastJsonapi::ObjectSerializer
    attributes *[
      :full_name,
      :email,
      :full_phone_number,
      :access_code,
      :activated
    ]

    attribute :role do |object|
      if object.role_id.present?
        BxBlockRolesPermissions::Role.find(object&.role_id)&.name
      end
    end
  end
end
