module BxBlockCompanies
  class CompanySerializer < BaseSerializer
    include FastJsonapi::ObjectSerializer

    attributes :id, :name, :email, :address, :hr_code, :employee_code

    attribute :company_date do |object|
      object.created_at.to_date
    end
  end
end
