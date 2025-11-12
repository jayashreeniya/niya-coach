module BxBlockTimeTrackingBilling
  class TimeTrackSerializer < BaseSerializer

    attributes *[
        :account_id,
        :company,
        :spend_time,
        :created_at,
        :updated_at,
    ]

    attribute :company do |object|
      object.company_id
    end
    attribute :spend_time do |object|
      spend_time_for object
    end

    class << self
      private

      def spend_time_for(object)
        seconds_diff = (object.updated_at - object.created_at).to_i.abs
        hours = seconds_diff / 3600
        seconds_diff -= hours * 3600
        minutes = seconds_diff / 60
        seconds_diff -= minutes * 60
        seconds = seconds_diff
        "#{hours.to_s.rjust(2, '0')}:#{minutes.to_s.rjust(2, '0')}:#{seconds.to_s.rjust(2, '0')}"
      end
    end
  end
end
