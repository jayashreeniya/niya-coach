module BxBlockSharecalendar
  class BookedSlotSerializer < BaseSerializer
    attributes :id, :start_time, :end_time, :booking_date

    attributes :viewable_slot do |object|
      "#{object.start_time} - #{object.end_time}"
    end
    attribute :coach_details do |object, params|
      coach_details_for(object.service_provider, params)
    end

    attribute :meeting_code do |object|
      "#{object.meeting_code}"
    end

    attribute :meeting_token do |object, params|
      if params[:meeting_data]
        "#{params[:meeting_data][:token]}"
      end
    end
    class << self
      private
      # def slots_for availability
      #   availability.slots_list
      # end

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
        if object.image.attached? &&  params[:url].present?
          {
            id: object.id,
            full_name: object&.full_name,
            expertise: coach_expertise,
            rating: object&.rating,
            education: object.education,
            languages: object.user_languages.pluck(:language).join(' & '),
            city: object&.city,
            image: params[:url]+Rails.application.routes.url_helpers.rails_blob_path(object.image, only_path: true)
          }
        else
          {
            id: object.id,
            full_name: object&.full_name,
            expertise: coach_expertise,
            rating: object&.rating,
            education: object.education,
            languages: object.user_languages.pluck(:language).join(' & '),
            city: object&.city,
            image: nil
          }
        end
      end
    end
  end
end
