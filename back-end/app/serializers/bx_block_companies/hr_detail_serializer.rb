module BxBlockCompanies
  class HrDetailSerializer < BaseSerializer
    include FastJsonapi::ObjectSerializer

    attributes :hr_details do |object, params|
      hr_details_for(object, params)
    end
    

    class << self
      private
      
      def hr_details_for(object, params)
        if object.image.attached? &&  params[:url].present?
          {
            id: object.id,
            full_name: object&.full_name,
            enrolled: object&.created_at.to_date,
            code: object&.access_code,
            image: params[:url]+Rails.application.routes.url_helpers.rails_blob_path(object.image, only_path: true)
          }
        else
          {
            id: object.id,
            full_name: object&.full_name,
            enrolled: object&.created_at.to_date,
            code: object&.access_code,
            image: nil
          }
        end
      end
    end
  end
end
