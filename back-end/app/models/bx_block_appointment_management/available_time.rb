module BxBlockAppointmentManagement
	class AvailableTime < ApplicationRecord
		self.table_name = :coach_par_times
		belongs_to :coach_par_avail, class_name: "BxBlockAppointmentManagement::CoachParAvail"

	   	after_create :update_avalibility
	   	DATE = ("%d/%m/%Y")
	 	def update_avalibility
	 		begin
	 		Rails.logger.info "=== UPDATE_AVALIBILITY CALLBACK STARTED ==="
	 		Rails.logger.info "AvailableTime ID: #{self.id}, coach_par_avail_id: #{self.coach_par_avail_id}"
	 		Rails.logger.info "From: #{self.from}, To: #{self.to}"
	 		
	 		coach_avail = BxBlockAppointmentManagement::CoachParAvail.find_by(id: self.coach_par_avail_id)
	 		
	 		unless coach_avail
	 			Rails.logger.warn "update_avalibility: CoachParAvail not found for id=#{self.coach_par_avail_id}"
	 			return
	 		end
	   	
	   	@coach_id = coach_avail.account_id
	   	is_unavailable = coach_avail.avail_type == "unavailable"
	   	Rails.logger.info "update_avalibility: avail_type=#{coach_avail.avail_type}, is_unavailable=#{is_unavailable}"
	   	Rails.logger.info "Coach account_id: #{@coach_id}"
	 		start_date_obj = coach_avail.start_date
	 		end_date_obj = coach_avail.end_date
	 		
	 		unless start_date_obj && end_date_obj
	 			Rails.logger.warn "update_avalibility: Missing dates - start=#{start_date_obj}, end=#{end_date_obj}"
	 			return
	 		end
	 		
	 		# Normalize dates to Date objects
	 		start_date_obj = start_date_obj.to_date if start_date_obj.respond_to?(:to_date)
	 		end_date_obj = end_date_obj.to_date if end_date_obj.respond_to?(:to_date)
	 		
	 		aval = BxBlockAppointmentManagement::Availability.where(service_provider_id: coach_avail&.account_id)
	 		all_dates = []
	 		
	 		Rails.logger.info "update_avalibility: week_days=#{coach_avail.week_days.inspect}, is_array=#{coach_avail.week_days.is_a?(Array)}"
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
		 		Rails.logger.info "update_avalibility: Found #{all_dates.count} dates matching week_days"
		 	else
		 		# No week_days specified - include all dates in range
		 		all_dates = (start_date_obj..end_date_obj).to_a
		 		Rails.logger.info "update_avalibility: No week_days filter, using all #{all_dates.count} dates in range"
		 	end

		 	# IMPORTANT: Use only THIS record's from/to values, not querying other coach_par_times
		 	# This avoids stale data issues when multiple time records are created in sequence
		 	from_time = convert_time_format(self.from.to_s)
		 	to_time = convert_time_format(self.to.to_s)
		 	
		 	Rails.logger.info "update_avalibility: Using this record's times - from=#{from_time}, to=#{to_time}"
		 	
		 	# Validate times are not empty/midnight
		 	if from_time.blank? || to_time.blank? || from_time == "12:00 AM" && to_time == "12:00 AM"
		 		Rails.logger.warn "update_avalibility: Invalid times - from=#{from_time}, to=#{to_time}"
		 		return
		 	end
		 	
	 		slt = [{"to"=>to_time, "sno"=>"1", "from"=>from_time, "booked_status"=>self.booked_slot || false}]
    	
    	# Calculate time slots for this time window
    	@new_time_slot = BxBlockAppointmentManagement::TimeSlotsCalculator.new.calculate_time_slots(from_time, to_time, 14)
	    	@new_time_slot = @new_time_slot.flatten
	    	@new_time_slot.pop if @new_time_slot.present?
 	    	
	 	    	# Guard: only proceed if we have time slots
	 	    	if slt.blank? || @new_time_slot.blank?
	 	    		Rails.logger.warn "update_avalibility: No time slots to process - slt=#{slt.inspect}, @new_time_slot count=#{@new_time_slot&.count || 0}"
	 	    		return
	 	    	end
	 	    	
	 	    	Rails.logger.info "update_avalibility: Processing #{all_dates.count} dates with #{@new_time_slot.count} time slots"
	 	    	
	 	    	all_dates&.each do |dates|
		 		date_str = dates.strftime(DATE)
		 		
	 			if coach_avail.avail_type == "unavailable"
	 				# UNAVAILABLE: Remove slots from existing availability
	 				Rails.logger.info "update_avalibility: Processing UNAVAILABLE for date #{date_str}"
	 				
	 				avail = BxBlockAppointmentManagement::Availability.find_by(
	 					availability_date: date_str, 
	 					service_provider_id: coach_avail&.account_id
	 				)
	 				
	 				if avail.nil?
	 					Rails.logger.info "update_avalibility: No existing availability for #{date_str}, skipping"
	 					next
	 				end
	 				
	 				# Convert unavailable times to 24-hour format for comparison
	 				unavail_from_24 = Time.parse(from_time).strftime("%H:%M") rescue from_time
	 				unavail_to_24 = Time.parse(to_time).strftime("%H:%M") rescue to_time
	 				Rails.logger.info "update_avalibility: Removing slots between #{unavail_from_24} and #{unavail_to_24}"
	 				
	 				original_count = avail.timeslots&.count || 0
	 				
	 				# Remove slots that fall within the unavailable time range
	 				avail.timeslots&.reject! do |slot|
	 					slot_from = slot["from"] || slot[:from]
	 					slot_to = slot["to"] || slot[:to]
	 					
	 					# Convert slot times to 24-hour format
	 					slot_from_24 = Time.parse(slot_from).strftime("%H:%M") rescue slot_from
	 					slot_to_24 = Time.parse(slot_to).strftime("%H:%M") rescue slot_to
	 					
	 					# Check if slot falls within unavailable range
	 					is_within = slot_from_24 >= unavail_from_24 && slot_to_24 <= unavail_to_24
	 					Rails.logger.info "update_avalibility: Slot #{slot_from} - #{slot_to} (#{slot_from_24}-#{slot_to_24}), within unavail range? #{is_within}" if is_within
	 					is_within
	 				end
	 				
	 				# Also cancel any booked slots in this range
	 				@booked_slot = BxBlockAppointmentManagement::BookedSlot.where(
	 					booking_date: dates, 
	 					service_provider_id: @coach_id
	 				)
	 				@booked_slot.each do |b_slot|
	 					b_start = Time.parse(b_slot.start_time).strftime("%H:%M") rescue nil
	 					b_end = Time.parse(b_slot.end_time).strftime("%H:%M") rescue nil
	 					if b_start && b_end && b_start >= unavail_from_24 && b_end <= unavail_to_24
	 						Rails.logger.info "update_avalibility: Destroying booked slot #{b_slot.id} in unavailable range"
	 						b_slot.destroy
	 					end
	 				end
	 				
	 				# Renumber remaining slots
	 				avail.timeslots = set_time_slots(avail.timeslots || [])
	 				
	 				# Update start/end times
	 				if avail.timeslots.present?
	 					all_froms = avail.timeslots.map { |s| s["from"] || s[:from] }.compact
	 					all_tos = avail.timeslots.map { |s| s["to"] || s[:to] }.compact
	 					avail.start_time = all_froms.min_by { |t| Time.parse(t) rescue Time.new(2000,1,1) }
	 					avail.end_time = all_tos.max_by { |t| Time.parse(t) rescue Time.new(2000,1,1) }
	 				end
	 				
	 				avail.unavailable_start_time = from_time
	 				avail.unavailable_end_time = to_time
	 				avail.save(validate: false)
	 				
	 				new_count = avail.timeslots&.count || 0
	 				Rails.logger.info "update_avalibility: Removed #{original_count - new_count} slots, #{new_count} remaining for #{date_str}"
	 			else
	 				# AVAILABLE: Add slots to availability
		    	avail = BxBlockAppointmentManagement::Availability.find_or_initialize_by(availability_date: date_str, service_provider_id: coach_avail&.account_id)
		    	Rails.logger.info "update_avalibility: Processing AVAILABLE for date #{date_str}, Availability new? #{avail.new_record?}"
		    	
		    	# Guard against empty slt
		    	if slt.present?
			    	# MERGE time slots with existing ones instead of replacing
			    	existing_slots = avail.timeslots || []
			    	new_slots = @new_time_slot.flatten
			    	
			    	# Combine existing and new slots
			    	all_slots = existing_slots + new_slots
			    	
			    	# Remove duplicates by from/to combination
			    	all_slots.uniq! { |s| [s["from"] || s[:from], s["to"] || s[:to]] }
			    	
			    	# Sort by from time
			    	all_slots.sort_by! { |s| Time.parse(s["from"] || s[:from] || "00:00") rescue Time.new(2000,1,1) }
			    	
			    	# Renumber
			    	time_slots = set_time_slots(all_slots)
			    	
			    	# Calculate min/max times
			    	all_froms = time_slots.map { |s| s["from"] || s[:from] }.compact
			    	all_tos = time_slots.map { |s| s["to"] || s[:to] }.compact
			    	min_from = all_froms.min_by { |t| Time.parse(t) rescue Time.new(2000,1,1) }
			    	max_to = all_tos.max_by { |t| Time.parse(t) rescue Time.new(2000,1,1) }
			    	
			    	avail.start_time = min_from
			    	avail.end_time = max_to
			    	avail.timeslots = time_slots
			    	
			    	if avail.save!
			    		Rails.logger.info "update_avalibility: Saved Availability id=#{avail.id} for date #{date_str} with #{time_slots.count} slots (merged)"
			    	end
		    	end
				end
			end
		Rails.logger.info "=== UPDATE_AVALIBILITY CALLBACK COMPLETED ==="
		rescue => e
			Rails.logger.error "=== ERROR IN UPDATE_AVALIBILITY CALLBACK ==="
			Rails.logger.error "Error class: #{e.class}"
			Rails.logger.error "Error message: #{e.message}"
			Rails.logger.error "Error backtrace: #{e.backtrace.first(10).join("\n")}"
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
		# Convert HH:MM (24-hour) to 12-hour AM/PM format
		# Use direct conversion to avoid timezone issues
		# NOTE: Must use match() not match?() to capture groups into $1, $2
		if match_data = time_str.match(/^(\d{1,2}):(\d{2})$/)
			hour = match_data[1].to_i
			min = match_data[2].to_i
			if hour == 0
				"12:#{min.to_s.rjust(2, '0')} AM"
			elsif hour < 12
				"#{hour}:#{min.to_s.rjust(2, '0')} AM"
			elsif hour == 12
				"12:#{min.to_s.rjust(2, '0')} PM"
			else
				"#{hour - 12}:#{min.to_s.rjust(2, '0')} PM"
			end
		else
			time_str
		end
	end
	end
end
