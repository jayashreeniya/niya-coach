module BxBlockAppointmentManagement
	class AvailableTime < ApplicationRecord
		self.table_name = :coach_par_times
		belongs_to :coach_par_avail, class_name: "BxBlockAppointmentManagement::CoachParAvail"

	   	after_create :update_avalibility
	   	DATE = ("%d/%m/%Y")
	 	def update_avalibility
	 		begin
	   	@new_time_slot = [] if @new_time_slot.nil?
	 		coach_avail = BxBlockAppointmentManagement::CoachParAvail.find_by(id: self.coach_par_avail_id)
	 		return unless coach_avail # Guard against nil
	   	
	   	# Skip callback for unavailable types - slots should only be removed on delete, not on create
	   	if coach_avail.avail_type == "unavailable"
	   		Rails.logger.info "Skipping update_avalibility callback for unavailable type (id=#{coach_avail.id}) - slots will only be removed on delete"
	   		return
	   	end
	   	
	   	@coach_id = coach_avail.account_id
	 		start_date_obj = coach_avail.start_date
	 		end_date_obj = coach_avail.end_date
	 		return unless start_date_obj && end_date_obj # Guard against nil dates
	 		
	 		# Normalize dates to Date objects
	 		start_date_obj = start_date_obj.to_date if start_date_obj.respond_to?(:to_date)
	 		end_date_obj = end_date_obj.to_date if end_date_obj.respond_to?(:to_date)
	 		
	 		aval = BxBlockAppointmentManagement::Availability.where(service_provider_id: coach_avail&.account_id)
	 		all_dates = []
	 		
	 		if coach_avail.week_days.present? && coach_avail.week_days.is_a?(Array)
		 		coach_avail.week_days.each do |days|
		 			next unless days.present?
		 			days = days.to_s.downcase
		 			days = days.to_sym
		 			all_dates << (start_date_obj..end_date_obj).select do |current_date|
		 				current_date.send("#{days}?")
		 			end
		 		end
		 		all_dates = all_dates.flatten
		 	else
		 		# No week_days specified - include all dates in range
		 		all_dates = (start_date_obj..end_date_obj).to_a
		 	end

		 	all_time =  coach_avail&.coach_par_times
	 		slt = []
	    	sno = 0
	    	all_time&.each do |a_slot|
	    	   sno = sno+1
	    	   # Convert time format from HH:MM to format that Time.parse can handle
	    	   from_time = a_slot.from.to_s
	    	   to_time = a_slot.to.to_s
	    	   # Ensure format is correct (HH:MM or convert to parseable format)
	    	   from_time = convert_time_format(from_time)
	    	   to_time = convert_time_format(to_time)
              slt << {"to"=>to_time, "sno"=>"#{sno}", "from"=>from_time, "booked_status"=>a_slot.booked_slot || false} 
	    	  @new_time_slot <<  BxBlockAppointmentManagement::TimeSlotsCalculator.new.calculate_time_slots( slt.last['from'], slt.last['to'], 14 )
		    	@new_time_slot  = @new_time_slot.flatten
		    	@new_time_slot.pop
 	    	end
 	    	
 	    	# Guard: only proceed if we have time slots
 	    	return if slt.blank? || @new_time_slot.blank?
 	    	
 	    	all_dates&.each do |dates|
		 		dates = dates.strftime(DATE)
	 			unless coach_avail.avail_type == "unavailable"
			    	avail = BxBlockAppointmentManagement::Availability.find_or_initialize_by(availability_date: dates, service_provider_id: coach_avail&.account_id)
			    	# Guard against empty slt
			    	if slt.present?
				    	avail.update( start_time: slt.min_by{ |s| s['from']}['from'], end_time: slt.max_by{ |s| s['to']}['to'])
				    	time_slots = set_time_slots(@new_time_slot.flatten)
				    	time_slots.uniq! {|e| e[:from] && e[:to]}
				    	avail.timeslots = time_slots
				    	avail.save!
			    	end
				else
 					# MySQL uses LIKE (case-insensitive by default), not ILIKE (PostgreSQL)
 					avl = aval.where("availability_date LIKE ?", "%#{dates}%")
 					 @booked_slot = BxBlockAppointmentManagement::BookedSlot.where(booking_date: dates,service_provider_id: @coach_id)
 					if avl.present?
 						avl.first.timeslots.each do |slot|
					    if timeslot_condition(change_time(slot["from"]), change_time(slot["to"]), slt.last["from"], slt.last["to"])
					    	delete_booked_session(@booked_slot, slot)
					    end
 					  end

					  avl.first.timeslots.reject! {|slot| timeslot_condition(change_time(slot["from"]), change_time(slot["to"]), slt.last["from"], slt.last["to"])}

						avl.first.timeslots = set_time_slots(avl.first.timeslots)
						avl.first.save(validate: false)
						avl.first.update(unavailable_start_time: slt.first['from'], unavailable_end_time: slt.first['to'])
					end
				end
			end
		rescue => e
			Rails.logger.error "Error in update_avalibility callback: #{e.message}"
			Rails.logger.error e.backtrace.join("\n")
			# Don't re-raise - let the record save even if callback fails
		end
		end

		def set_time_slots(slots)
			sno = 0
			slots.each do |slot| 
				sno += 1
	      slot[:sno] = "#{sno}"
			end
			slots
		end

		def change_time(time)
			Time.parse(time).strftime("%H:%M")
		end

		def delete_booked_session(booked_slot,slot)
			booked_slot.each do |b_slot| 
				s_time = Time.parse(b_slot.start_time).strftime("%I:%M %p")
				e_time = Time.parse(b_slot.end_time).strftime("%I:%M %p")
				if slot['from'] == s_time || slot['to'] == e_time
					b_slot.destroy
				end
			end
		end

		def timeslot_condition(start_time, end_time, s_time, e_time)
			start_time >= s_time && end_time <= e_time
		end
		
		def convert_time_format(time_str)
			# Handle both HH:MM (24-hour) and HH:MM AM/PM formats
			return time_str if time_str.blank?
			# If already in AM/PM format, return as is
			return time_str if time_str.match?(/\d{1,2}:\d{2}\s*(AM|PM)/i)
			# Convert HH:MM to parseable format - Time.parse can handle HH:MM directly
			# But we'll ensure it's in a standard format
			if time_str.match?(/^\d{1,2}:\d{2}$/)
				# Parse and format to ensure consistency
				begin
					Time.parse(time_str).strftime("%I:%M %p")
				rescue
					time_str
				end
			else
				time_str
			end
		end
	end
end
