module BxBlockAppointmentManagement
  class ServiceProviderAvailabilitySerializer < BaseSerializer
    attributes :id

    attribute :time_slots do |object|
      slots_for(object)
    end

    class << self
      private

      def slots_for availability
        availability.slots_list
      end
    end
  end
end
