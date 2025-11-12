module BxBlockAdmin
    class GetCoachAdminSerializer < BaseSerializer

        attributes :coach_details do |object, params|
            coach_details_for(object, params)
        end

      class << self
        private
        def coach_details_for(object, params)
            object.expertise = [] if object.expertise.nil?
            object.expertise.delete("") if object.expertise.include?("")
            expertise = ["specialization"].product(JSON.parse(object.expertise.to_s)).map { |a| [a].to_h}
            expertise.delete_at(0) if expertise&.first&.values&.first == ""
            coach_expertise=[]
            expertise.each do |exp|
                id = CoachSpecialization.where('lower(expertise) LIKE ?', "%"+exp.values.first.to_s.downcase+"%")&.last&.id
                coach_expertise<<exp.merge({'id': id})
            end
            image=params[:url]+Rails.application.routes.url_helpers.rails_blob_path(object.image, only_path: true) if object.image.attached? &&  params[:url].present?
            {
                id: object&.id,
                full_name: object&.full_name,
                full_phone_number: object&.full_phone_number,
                rating: object&.rating,
                education: object.education,
                languages: object.user_languages.pluck(:language).join(' & '),
                city: object&.city,
                email: object&.email,
                expertise: coach_expertise,
                image: image
            }
        end
      end
    end
  end
  
