module BxBlockAppointmentManagement
	class CoachParAvail < ApplicationRecord
		self.table_name = :coach_par_avails
	 	belongs_to :account, class_name: "AccountBlock::Account"
	 	has_many :coach_par_times, class_name: "BxBlockAppointmentManagement::AvailableTime"
	 	accepts_nested_attributes_for :coach_par_times, allow_destroy: true
		before_save :check_end_date

		def check_end_date 
			self.end_date = self.start_date unless self.end_date.present?
		end
	end  
end
