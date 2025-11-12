module BxBlockCalendar
  class CoachWithPastAppointmentSerializer < BaseSerializer


    attributes :upcoming_appointments do |object, params|
      slots = BxBlockAppointmentManagement::BookedSlot.where("service_provider_id = ? and service_user_id = ?", object.id, params[:current_user].id)
      upcoming_appointments_for(object, slots, params)
    end

    class << self
      private

      def upcoming_appointments_for(account, slots, params)
        all_slots=[]
        booked_slots=[]
        slots.each do |slot|
          if Time.parse(slot.start_time).localtime < Time.strptime(Time.now.in_time_zone('Asia/Kolkata').to_s, '%Y-%m-%d %H:%M:%S')
            booked_slots<<slot
          end
        end
        booked_slots.each do |obj|
          all_slots<<{id: obj.id, start_time: obj.start_time, end_time: obj.end_time, booking_date: obj.booking_date, viewable_slots: "#{obj.start_time} - #{obj.end_time}"}
        end
        account.expertise = [] if account.expertise.nil?
        account.expertise.delete("") if account.expertise.include?("")
        expertise = ["specialization"].product(JSON.parse(account.expertise.to_s)).map { |a| [a].to_h}
        expertise.delete_at(0) if expertise&.first&.values&.first == ""
        coach_expertise=[]
        expertise.each do |exp|
          id = CoachSpecialization.where('lower(expertise) LIKE ?', "%"+exp.values.first.to_s.downcase+"%")&.last&.id
          coach_expertise<<exp.merge({'id': id})
        end
        if all_slots.present?
          {
            id: account.id,
            full_name: account.full_name,
            expertise: coach_expertise,
            rating: account&.rating&.round(1),
            education: account&.education,
            languages: account&.user_languages.pluck(:language).join(' & '),
            city: account&.city,
            image: (params[:url]+Rails.application.routes.url_helpers.rails_blob_path(account.image, only_path: true) if account.image.attached? &&  params[:url].present?),
            upcoming_appointments: all_slots
          }
        end
      end
    end
  end
end

