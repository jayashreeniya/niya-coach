module AccountBlock
  class AccountSerializer < BaseSerializer
    attributes *[
      :type,
      :first_name,
      :last_name,
      :full_name,
      :email,
      :access_code,
      :full_phone_number,
      :activated,
      :phone_number,
      :profile_name,
      :country_code,
      :created_at,
      :updated_at,
    ]

    attributes :image do |object, params|
      params[:url]+Rails.application.routes.url_helpers.rails_blob_path(object.image, only_path: true) if object.image.attached? &&  params[:url].present?
    end

    attributes :gender do |object|
      if object&.gender.present? 
        object&.gender
      else
       ""
      end
    end


    attribute :country_code do |object|
      country_code_for object
    end

    attribute :phone_number do |object|
      phone_number_for object
    end

    class << self
      private

      def country_code_for(object)
        return nil unless Phonelib.valid?(object.full_phone_number)
        Phonelib.parse(object.full_phone_number).country_code
      end

      def phone_number_for(object)
        return nil unless Phonelib.valid?(object.full_phone_number)
        Phonelib.parse(object.full_phone_number).raw_national
      end
    end
  end
end
