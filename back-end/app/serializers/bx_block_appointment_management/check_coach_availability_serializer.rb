module BxBlockAppointmentManagement
  class CheckCoachAvailabilitySerializer < BaseSerializer
    attributes :id

    attribute :coach_details do |object, params|
      account = AccountBlock::Account.find(object.service_provider_id)
      coach_details account, params
    end

    attribute :timeslots do |object, object2|
      available_slots object, object2
    end

    class << self
      private

      def available_slots object, object2
        if !object2[:start_time_param].nil?
          object.timeslots.select { |x| !x["booked_status"] and x["from"]==object2[:start_time_param] and Time.strptime(Time.now.in_time_zone('Asia/Kolkata').to_s, '%Y-%m-%d %H:%M:%S')<Time.parse(object.availability_date+" "+x["from"]).localtime}
        else
          object.timeslots.select { |x| !x["booked_status"] and Time.strptime(Time.now.in_time_zone('Asia/Kolkata').to_s, '%Y-%m-%d %H:%M:%S')<Time.parse(object.availability_date+" "+x["from"]).localtime}
        end
      end

      def coach_details object, params
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
          id: object.id,
          full_name: object&.full_name,
          expertise: coach_expertise,
          rating: object&.rating&.round(1),
          education: object&.education,
          languages: object.user_languages.pluck(:language).map(&:capitalize).join(', '),
          city: object&.city,
          image: image
        }
      end
    end
  end
end
