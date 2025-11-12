#this is time-track service
module BxBlockTimeTrackingBilling
  class TimeTrackService
    class << self
      def call(current_user, flag = false)
        company = Company.find_by(employee_code: current_user.access_code)
        recent_entry = BxBlockTimeTrackingBilling::TimeTrack.where('created_at >= ? AND company_id = ? AND account_id = ?', 5.minutes.ago, company&.id, current_user&.id).last
        recent_entry_flag = BxBlockTimeTrackingBilling::TimeTrack.find_by('company_id = ? AND account_id = ? AND flag = ?', company&.id, current_user&.id, true)
        recent = recent_entry_flag&.flag == true ? recent_entry_flag : recent_entry
        if flag == false
          if recent
            recent&.touch
            if recent.flag == true
              recent.update(flag: false)
              recent&.touch
              create_track(current_user, company)
            end
          else
            create_track(current_user, company)
          end
        else
          when_flag_false(current_user, company, recent, flag)
        end
      end

      private

      def when_flag_false(current_user, company, recent, flag_value)
        recent&.touch
        recent&.update(flag: false)
        BxBlockTimeTrackingBilling::TimeTrack.create!(account_id: current_user&.id, company_id: company&.id, flag: flag_value) unless company&.id.nil?
      end

      def create_track(current_user, company)
        BxBlockTimeTrackingBilling::TimeTrack.create!(account_id: current_user&.id, company_id: company&.id) unless company&.id.nil?
      end
    end
  end
end
