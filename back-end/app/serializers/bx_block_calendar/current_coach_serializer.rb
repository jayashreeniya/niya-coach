module BxBlockCalendar
  class CurrentCoachSerializer < BaseSerializer

    attribute :coach_details do |object, params|
      account = AccountBlock::Account.find(object.id)
      coach_details_for(account, params)
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
        {
          id: object.id,
          full_name: object&.full_name,
          expertise: coach_expertise,
          rating: object&.rating&.round(1),
          education: object&.education,
          languages: object.user_languages.pluck(:language).join(' & '),
          city: object&.city,
          image: (params[:url]+Rails.application.routes.url_helpers.rails_blob_path(object.image, only_path: true) if object.image.attached? &&  params[:url].present?)
        }
      end
    end
  end
end
