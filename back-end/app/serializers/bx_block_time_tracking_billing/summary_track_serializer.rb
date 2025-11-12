module BxBlockTimeTrackingBilling
  class SummaryTrackSerializer < BaseSerializer

    attributes *[
        :account_id,
        :spend_time,
        :created_at,
        :updated_at,
    ]

    attribute :spend_time do |object|
      spend_time_for object
    end

    class << self
      private

      def spend_time_for(object)
        seconds_diff = (object.spend_time * 60).round
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
