module BxBlockAppointmentManagement
  class AvailabilitySlot < ApplicationRecord
  	self.table_name = :availability_slots
		belongs_to :availability, class_name: 'BxBlockAppointmentManagement::Availability'
		validate :check_validation
		# validates :to, :from, presence: true

		after_create :slots_time

		private

	    def check_validation
	    	start_time = Time.parse(self.from) 
	    	end_time = Time.parse(self.to) 
	    	min_gape =  ((start_time - end_time).abs / 3600)*60 
	    	if min_gape.to_i > 59
	    	   errors.add(:end_time, "must be within 59 minutes of the start time")
	    	 
	    	end
	    end

	    def slots_time
	    	slt = []
	    	avt_slot=BxBlockAppointmentManagement::AvailabilitySlot.where(availability_id: self.availability_id)
	    	sno=0
	    	avt_slot.each do |a_slot|
	    		sno = sno+1
               slt << {"to"=>"#{a_slot.to}", "sno"=>"#{sno}", "from"=>"#{a_slot.from}", "booked_status"=>a_slot.booked_slot}  
	    	end 
	    	BxBlockAppointmentManagement::Availability.find_by(id: self.availability_id).update(timeslots: slt)

	    end  
 	end
end


