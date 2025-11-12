module BxBlockAppointmentManagement
  class CoachLeave < ApplicationRecord
      DATE = "%d/%m/%Y"
    self.table_name = :coach_leaves
    belongs_to :account, class_name: "AccountBlock::Account"
    validates :start_date, presence: true, on: :create
    after_create :coach_off_time


    private

    def coach_off_time
      all_dates = []
      all_availability = BxBlockAppointmentManagement::Availability.where(service_provider_id: self.account_id)
      unless self.end_date.present?
        	coach_off_date = BxBlockAppointmentManagement::CoachLeave.where(account_id: self.account_id).pluck(:start_date)
        	coach_off_date.each do |dt|
        		all_date = dt.strftime(DATE)
        		coach_off_availability = all_availability.where(availability_date: all_date)
        		coach_off_availability.delete_all if coach_off_availability.present?
        	end
      else
         # Use self (current record) instead of .last to get the correct leave dates
         start_date = Date.parse(self.start_date.strftime(DATE).to_s)
         end_date = Date.parse(self.end_date.strftime(DATE).to_s)
         all_dates << (start_date..end_date).select do |object| 
                        object end
        all_dates = all_dates.flatten
         all_dates.each do |dt|
             date = dt.strftime(DATE)
             coach_off_availability = all_availability.where(availability_date: date)
             coach_off_availability.delete_all if coach_off_availability.present?
         end
      end
    end
  end
end



