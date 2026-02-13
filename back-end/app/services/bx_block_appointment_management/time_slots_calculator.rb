module BxBlockAppointmentManagement
  class TimeSlotsCalculator

    def calculate_time_slots(start_time, end_time, slot_duration)
      # Parse times using a fixed reference date to avoid timezone issues
      reference_date = "2000-01-01"
      start_parsed = parse_time_safely(start_time, reference_date)
      end_parsed = parse_time_safely(end_time, reference_date)
      
      return [] unless start_parsed && end_parsed
      
      total_working_hours = (end_parsed - start_parsed).to_i
      total_working_minutes = total_working_hours / 60
      new_time_slots = []
      current_time = start_parsed
      sno = 1
      
      until total_working_minutes < 0 do
        start_time_key = current_time.strftime("%I:%M %p")
        end_time_key = (current_time + slot_duration.minute).strftime("%I:%M %p")
        new_time_slots << {
          from: start_time_key, to: end_time_key, booked_status: false, sno: "#{sno}"
        }
        current_time = current_time + (slot_duration + 1).minute
        total_working_minutes -= 15
        sno += 1
      end
      new_time_slots
    end
    
    private
    
    def parse_time_safely(time_str, reference_date)
      return nil if time_str.blank?
      
      # If time already has AM/PM, parse with reference date
      if time_str.match?(/\d{1,2}:\d{2}\s*(AM|PM)/i)
        Time.parse("#{reference_date} #{time_str}")
      # If HH:MM format (24-hour)
      elsif time_str.match?(/^(\d{1,2}):(\d{2})$/)
        hour = $1.to_i
        min = $2.to_i
        Time.parse("#{reference_date} #{hour}:#{min}")
      else
        Time.parse("#{reference_date} #{time_str}")
      end
    rescue ArgumentError
      nil
    end
  end
end
