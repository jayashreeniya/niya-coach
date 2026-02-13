ActiveAdmin.register AccountBlock::Account, as: "coach_availability" do
  # menu priority: 5
 # index label: 'Label 1'
  config.batch_actions = false
  menu label: "Coach Availability"
  actions :all, except: [:new,:destroy]
  DATE = "dd/mm/yy"
  DAYS = Date::DAYNAMES
  Start_date = "Start Date"
  End_date = "End Date"
  
  permit_params :full_name, :email, :full_phone_number, :password, :password_confirmation, :access_code, :activated, :city, :education, 
    expertise: [], 
    user_languages_attributes: [:id, :language, :_destroy], 
    coach_leaves_attributes: [:id, :start_date, :end_date, :_destroy], 
    coach_par_avails_attributes: [:id, :start_date, :end_date, :avail_type, :_destroy, week_days: [], coach_par_times_attributes: [:id, :from, :to, :booked_slot, :sno, :_destroy, :"from(4i)", :"from(5i)", :"to(4i)", :"to(5i)"]], 
    available_coach_par_avails_attributes: [:id, :start_date, :end_date, :avail_type, :_destroy, week_days: [], coach_par_times_attributes: [:id, :from, :to, :booked_slot, :sno, :_destroy, :"from(4i)", :"from(5i)", :"to(4i)", :"to(5i)"]], 
    unavailable_coach_par_avails_attributes: [:id, :start_date, :end_date, :avail_type, :_destroy, week_days: [], coach_par_times_attributes: [:id, :from, :to, :booked_slot, :sno, :_destroy, :"from(4i)", :"from(5i)", :"to(4i)", :"to(5i)"]] 

  filter :full_name, as: :string, label: "Full Name"
  filter :email, as: :string, label: "Email"
  filter :full_phone_number

  after_update :check_activation

  controller do 
    # Add check_activation method here since it's referenced by after_update
    def check_activation(object)
      unless object.activated
        BxBlockAppointmentManagement::BookedSlot.where(service_provider_id: params[:id]).destroy_all
      end
    end

  	def scoped_collection
      Rails.logger.info "=" * 80
      Rails.logger.info "=== SCOPED_COLLECTION CALLED ==="
      Rails.logger.info "Request path: #{request.path rescue 'unknown'}"
      Rails.logger.info "Request method: #{request.method rescue 'unknown'}"
      coach_role = BxBlockRolesPermissions::Role.find_by_name("COACH")
      if coach_role
        @accounts = AccountBlock::Account.where(role_id: coach_role.id)
        Rails.logger.info "Found COACH role (id: #{coach_role.id}), returning #{@accounts.count} accounts"
      else
        @accounts = AccountBlock::Account.none
        Rails.logger.warn "COACH role not found, returning empty collection"
      end
      Rails.logger.info "=" * 80
      @accounts
    end

    before_action :log_all_actions

    def log_all_actions
      Rails.logger.info "=" * 80
      Rails.logger.info "=== COACH AVAILABILITY CONTROLLER ACTION - ENTRY POINT ==="
      Rails.logger.info "=" * 80
      Rails.logger.info "Action: #{action_name}"
      Rails.logger.info "Controller: #{controller_name}"
      Rails.logger.info "Request method: #{request.method}"
      Rails.logger.info "Request path: #{request.path}"
      Rails.logger.info "Request URL: #{request.url rescue 'unknown'}"
      Rails.logger.info "Request ID: #{request.uuid rescue 'unknown'}"
      Rails.logger.info "Current user: #{current_admin_user&.email rescue 'unknown'}"
      Rails.logger.info "Params keys: #{params.keys.inspect}"
      Rails.logger.info "Full params: #{params.inspect}"
      Rails.logger.info "=" * 80
    end

    def index
      Rails.logger.info "=== INDEX ACTION CALLED ==="
      Rails.logger.info "Params: #{params.inspect}"
      super
    end

    def edit
      Rails.logger.info "=== EDIT ACTION CALLED ==="
      Rails.logger.info "ID: #{params[:id]}"
      Rails.logger.info "Params: #{params.inspect}"
      super
    end

  	def update
      Rails.logger.info "=== COACH AVAILABILITY UPDATE METHOD CALLED ==="
      Rails.logger.info "Request ID: #{request.uuid rescue 'unknown'}"
      Rails.logger.info "Request method: #{request.method}"
      Rails.logger.info "Request path: #{request.path}"
      Rails.logger.info "Full params: #{params.inspect}"
      Rails.logger.info "Params keys: #{params.keys.inspect}"
      Rails.logger.info "Params[:id]: #{params[:id].inspect}"
      Rails.logger.info "Params[:account]: #{params[:account].inspect}"
      Rails.logger.info "Params[:account_block_account]: #{params[:account_block_account].inspect}"

      # Normalize params key - ActiveAdmin expects 'account' but form might send 'account_block_account'
      if params["account_block_account"].present? && params["account"].blank?
        params["account"] = params["account_block_account"]
        Rails.logger.info "Normalized params: moved account_block_account to account"
      end

      # Extract account params for logging and validation
      account_params = params["account"] || params["account_block_account"] || {}
      Rails.logger.info "account_params keys: #{account_params.keys.inspect}"
      Rails.logger.info "account_params full: #{account_params.inspect}"
      Rails.logger.info "coach_par_avails_attributes present: #{account_params['coach_par_avails_attributes'].present?}"
      Rails.logger.info "coach_par_avails_attributes value: #{account_params['coach_par_avails_attributes'].inspect}"
      Rails.logger.info "coach_leaves_attributes present: #{account_params['coach_leaves_attributes'].present?}"
      Rails.logger.info "coach_leaves_attributes value: #{account_params['coach_leaves_attributes'].inspect}"

      # Get the account
      account = AccountBlock::Account.find(params["id"])

      # Merge all coach_par_avails from different form sections
      all_avails_data = {}
      
      # Helper to safely convert params to hash
      safe_to_hash = ->(p) {
        if p.respond_to?(:to_unsafe_h)
          p.to_unsafe_h
        elsif p.respond_to?(:to_h)
          p.to_h rescue p
        else
          p
        end
      }
      
      # Original coach_par_avails_attributes (if any)
      if account_params["coach_par_avails_attributes"].present?
        all_avails_data.merge!(safe_to_hash.call(account_params["coach_par_avails_attributes"]))
      end
      
      # Available coach_par_avails (with avail_type defaulting to "available")
      if account_params["available_coach_par_avails_attributes"].present?
        safe_to_hash.call(account_params["available_coach_par_avails_attributes"]).each do |k, v|
          v = safe_to_hash.call(v)
          v["avail_type"] ||= "available"
          all_avails_data["avail_#{k}"] = v
        end
      end
      
      # Unavailable coach_par_avails (with avail_type defaulting to "unavailable")
      if account_params["unavailable_coach_par_avails_attributes"].present?
        safe_to_hash.call(account_params["unavailable_coach_par_avails_attributes"]).each do |k, v|
          v = safe_to_hash.call(v)
          v["avail_type"] ||= "unavailable"
          all_avails_data["unavail_#{k}"] = v
        end
      end

      Rails.logger.info "Combined avails_data: #{all_avails_data.keys.count} entries"

      # Process nested attributes manually - ActiveAdmin's super doesn't handle deeply nested attributes correctly
      if all_avails_data.present? || account_params["coach_leaves_attributes"].present?
        Rails.logger.info "=== NESTED ATTRIBUTES DETECTED - Processing manually ==="

        if all_avails_data.present?
          Rails.logger.info "=== STARTING MANUAL PROCESSING OF coach_par_avails_attributes ==="
          process_coach_par_avails(account, all_avails_data)
          Rails.logger.info "=== COMPLETED MANUAL PROCESSING OF coach_par_avails_attributes ==="
        end

        if account_params["coach_leaves_attributes"].present?
          Rails.logger.info "=== STARTING MANUAL PROCESSING OF coach_leaves_attributes ==="
          Rails.logger.info "coach_leaves_data structure: #{account_params['coach_leaves_attributes'].inspect}"
          process_coach_leaves(account, account_params["coach_leaves_attributes"])
          Rails.logger.info "=== COMPLETED MANUAL PROCESSING OF coach_leaves_attributes ==="
        end

        # Check results
        account.reload
        Rails.logger.info "=== FINAL CHECK ==="
        Rails.logger.info "Account now has #{account.coach_par_avails.count} coach_par_avails"
        Rails.logger.info "Account now has #{account.coach_leaves.count} coach_leaves"

        Rails.logger.info "=== UPDATE METHOD COMPLETED - REDIRECTING ==="
        flash[:notice] = "Coach availability updated successfully"
        redirect_to admin_coach_availabilities_path and return
      end
    rescue => e
      Rails.logger.error "=== ERROR IN COACH AVAILABILITY UPDATE ==="
      Rails.logger.error "Error class: #{e.class}"
      Rails.logger.error "Error message: #{e.message}"
      Rails.logger.error "Error backtrace:"
      Rails.logger.error e.backtrace.join("\n")
      flash[:error] = "Error saving availability: #{e.message}"
      redirect_to edit_admin_coach_availability_path(params[:id]) and return
    end

    private
    
    def process_coach_leaves(account, leaves_data)
      Rails.logger.info "=== PROCESS_COACH_LEAVES CALLED ==="
      Rails.logger.info "Account ID: #{account.id}"
      
      processed_count = 0
      skipped_count = 0
      deleted_count = 0
      
      # Get ALL existing leave IDs for this account BEFORE processing
      existing_leave_ids = account.coach_leaves.pluck(:id).to_set
      Rails.logger.info "Existing CoachLeave IDs: #{existing_leave_ids.to_a.inspect}"
      
      # Track processed record IDs and signatures to prevent duplicates
      processed_ids = Set.new
      processed_signatures = Set.new
      
      leaves_data.each do |key, leave_data|
        # Normalize ActionController::Parameters
        if leave_data.respond_to?(:to_unsafe_h)
          leave_data = leave_data.to_unsafe_h
        elsif defined?(ActionController::Parameters) && leave_data.is_a?(ActionController::Parameters)
          leave_data = leave_data.to_h
        end
        
        next unless leave_data.is_a?(Hash)
        
        # Check for _destroy flag first
        destroy_flag = leave_data['_destroy']
        should_destroy = destroy_flag == "1" || destroy_flag == 1 || destroy_flag == true || destroy_flag == "true"
        
        record_id = leave_data['id'].present? && leave_data['id'] != "" ? leave_data['id'].to_i : nil
        
        if should_destroy
          if record_id && existing_leave_ids.include?(record_id)
            leave_to_delete = BxBlockAppointmentManagement::CoachLeave.find_by(id: record_id)
            if leave_to_delete
              leave_to_delete.destroy
              deleted_count += 1
              Rails.logger.info "✓ Deleted CoachLeave: id=#{record_id}"
            end
          end
          next
        end
        
        # Skip if ID was already processed in this request (prevents duplicates from dual form submission)
        if record_id && processed_ids.include?(record_id)
          Rails.logger.info "Skipping: ID #{record_id} already processed in this request"
          skipped_count += 1
          next
        end
        
        unless leave_data['start_date'].present? && leave_data['start_date'] != ""
          skipped_count += 1
          next
        end
        
        # Parse dates
        begin
          start_date_str = leave_data['start_date']
          end_date_str = leave_data['end_date'] || start_date_str
          
          if start_date_str.is_a?(String) && start_date_str.match?(/\d{2}\/\d{2}\/\d{4}/)
            start_date = Date.strptime(start_date_str, "%d/%m/%Y")
            end_date = end_date_str.present? ? Date.strptime(end_date_str, "%d/%m/%Y") : start_date
          else
            start_date = start_date_str.is_a?(Date) ? start_date_str : Date.parse(start_date_str.to_s)
            end_date = end_date_str.present? ? (end_date_str.is_a?(Date) ? end_date_str : Date.parse(end_date_str.to_s)) : start_date
          end
        rescue => e
          Rails.logger.error "✗ Error parsing leave dates: #{e.message}"
          skipped_count += 1
          next
        end
        
        # Create signature for this record
        signature = "#{start_date.to_s}-#{end_date.to_s}"
        
        # Skip if signature was already processed (prevents duplicates)
        if processed_signatures.include?(signature)
          Rails.logger.info "Skipping: signature #{signature} already processed"
          skipped_count += 1
          next
        end
        
        # Process the record
        coach_off = nil
        
        if record_id && existing_leave_ids.include?(record_id)
          # UPDATE existing record
          coach_off = BxBlockAppointmentManagement::CoachLeave.find_by(id: record_id)
          if coach_off
            coach_off.start_date = start_date
            coach_off.end_date = end_date
            Rails.logger.info "Updating existing CoachLeave id=#{record_id}"
          end
        else
          # Check if record with same dates already exists
          existing = BxBlockAppointmentManagement::CoachLeave.find_by(
            account_id: account.id,
            start_date: start_date,
            end_date: end_date
          )
          
          if existing
            Rails.logger.info "Record with same dates already exists (id=#{existing.id}), skipping"
            processed_ids.add(existing.id)
            processed_signatures.add(signature)
            skipped_count += 1
            next
          end
          
          # CREATE new record only if no existing record found
          Rails.logger.info "Creating new CoachLeave: #{start_date} - #{end_date}"
        coach_off = BxBlockAppointmentManagement::CoachLeave.new(
          account_id: account.id, 
          start_date: start_date, 
          end_date: end_date
        )
        end
        
        if coach_off&.save
          processed_count += 1
          processed_ids.add(coach_off.id)
          processed_signatures.add(signature)
          Rails.logger.info "✓ Saved CoachLeave: id=#{coach_off.id}"
        elsif coach_off
          Rails.logger.error "✗ Failed to save CoachLeave: #{coach_off.errors.full_messages.inspect}"
        end
      end
      
      Rails.logger.info "=== PROCESS_COACH_LEAVES COMPLETED: processed=#{processed_count}, deleted=#{deleted_count}, skipped=#{skipped_count} ==="
    end
    
    def process_coach_par_avails(account, avails_data)
      Rails.logger.info "=== PROCESS_COACH_PAR_AVAILS CALLED ==="
      Rails.logger.info "Account ID: #{account.id}"
      
      processed_count = 0
      skipped_count = 0
      error_count = 0
      deleted_count = 0
      
      # Get ALL existing avail IDs for this account BEFORE processing
      existing_avail_ids = account.coach_par_avails.pluck(:id).to_set
      Rails.logger.info "Existing CoachParAvail IDs: #{existing_avail_ids.to_a.inspect}"
      
      # Track processed record IDs and signatures to prevent duplicates
      processed_ids = Set.new
      processed_signatures = Set.new
      
      avails_data.each do |key, avl_data|
        # Normalize ActionController::Parameters
        if avl_data.respond_to?(:to_unsafe_h)
          avl_data = avl_data.to_unsafe_h
        elsif defined?(ActionController::Parameters) && avl_data.is_a?(ActionController::Parameters)
          avl_data = avl_data.to_h
        end

        next unless avl_data.is_a?(Hash)
        
        record_id = avl_data['id'].present? && avl_data['id'] != "" ? avl_data['id'].to_i : nil
        
        # Check for _destroy flag
        destroy_flag = avl_data['_destroy']
        should_destroy = destroy_flag == "1" || destroy_flag == 1 || destroy_flag == true || destroy_flag == "true"
        
        if should_destroy
          if record_id && existing_avail_ids.include?(record_id)
            avail_to_delete = BxBlockAppointmentManagement::CoachParAvail.find_by(id: record_id)
            if avail_to_delete
              if avail_to_delete.avail_type == "unavailable"
                remove_unavailable_slots(avail_to_delete)
              end
              avail_to_delete.coach_par_times.destroy_all
              avail_to_delete.destroy
              deleted_count += 1
              Rails.logger.info "✓ Deleted CoachParAvail: id=#{record_id}"
            end
          end
          next
        end
        
        # Skip if ID was already processed in this request
        if record_id && processed_ids.include?(record_id)
          Rails.logger.info "Skipping: ID #{record_id} already processed in this request"
          skipped_count += 1
          next
        end
        
        unless avl_data['start_date'].present? && avl_data['start_date'] != ""
          skipped_count += 1
          next
        end
        
        # Parse week_days
        week_days_raw = avl_data['week_days']
        if week_days_raw.respond_to?(:to_unsafe_h)
          week_days_raw = week_days_raw.to_unsafe_h
        elsif defined?(ActionController::Parameters) && week_days_raw.is_a?(ActionController::Parameters)
          week_days_raw = week_days_raw.to_h
        end

        week_days = case week_days_raw
                    when Array then week_days_raw
                    when Hash then week_days_raw.values
                    when String then [week_days_raw]
                    else []
                    end
        week_days = week_days.compact.reject(&:blank?)
        week_days = nil if week_days.empty?
        
        # Parse dates
  		begin
          start_date_str = avl_data['start_date']
          end_date_str = avl_data['end_date'] || start_date_str
          
          if start_date_str.is_a?(String) && start_date_str.match?(/\d{2}\/\d{2}\/\d{4}/)
            start_date = Date.strptime(start_date_str, "%d/%m/%Y")
            end_date = end_date_str.present? ? Date.strptime(end_date_str, "%d/%m/%Y") : start_date
          else
            start_date = start_date_str.is_a?(Date) ? start_date_str : Date.parse(start_date_str.to_s)
            end_date = end_date_str.present? ? (end_date_str.is_a?(Date) ? end_date_str : Date.parse(end_date_str.to_s)) : start_date
          end
        rescue => e
          Rails.logger.error "✗ Error parsing dates: #{e.message}"
          error_count += 1
          next
        end
        
        # Determine avail_type
        avail_type_value = avl_data['avail_type'].presence || "available"
        
        # Create signature for this record
        week_days_str = week_days.to_a.sort.join(',')
        signature = "#{start_date.to_s}-#{end_date.to_s}-#{avail_type_value}-#{week_days_str}"
        
        # Skip if signature was already processed
        if processed_signatures.include?(signature)
          Rails.logger.info "Skipping: signature #{signature} already processed"
          skipped_count += 1
          next
        end
        
        # Process the record
        avail = nil
        
        if record_id && existing_avail_ids.include?(record_id)
          # UPDATE existing record
          avail = BxBlockAppointmentManagement::CoachParAvail.find_by(id: record_id)
          if avail
            avail.start_date = start_date
            avail.end_date = end_date
            avail.week_days = week_days
            avail.avail_type = avail_type_value
            Rails.logger.info "Updating existing CoachParAvail id=#{record_id}"
          end
        else
          # For NEW records (no ID), check if EXACT same record exists (including week_days)
          # This allows different week_day combinations for the same date range
          existing = BxBlockAppointmentManagement::CoachParAvail.where(
            account_id: account.id,
            start_date: start_date,
            end_date: end_date,
            avail_type: avail_type_value
          ).to_a.find do |rec|
            # Compare week_days arrays (both sorted)
            rec_days = rec.week_days.to_a.sort
            new_days = week_days.to_a.sort
            rec_days == new_days
          end
          
          if existing
            # Exact match found - update it
            Rails.logger.info "Exact match found (id=#{existing.id}), updating it"
            avail = existing
          else
            # No exact match - CREATE new record
            Rails.logger.info "Creating new CoachParAvail: #{start_date} - #{end_date}, type=#{avail_type_value}, days=#{week_days.inspect}"
            avail = BxBlockAppointmentManagement::CoachParAvail.new(
              account_id: account.id,
              start_date: start_date, 
              end_date: end_date, 
              week_days: week_days, 
              avail_type: avail_type_value
            )
          end
        end
        
        if avail&.save
          processed_count += 1
          processed_ids.add(avail.id)
          processed_signatures.add(signature)
          Rails.logger.info "✓ Saved CoachParAvail: id=#{avail.id}"
          
          # Process time slots
          if avl_data['coach_par_times_attributes'].present?
            process_coach_par_times(avail, avl_data['coach_par_times_attributes'], avl_data['id'].present?)
          end
        elsif avail
          error_count += 1
          Rails.logger.error "✗ Failed to save CoachParAvail: #{avail.errors.full_messages.inspect}"
        end
      end
      
      Rails.logger.info "=== PROCESS_COACH_PAR_AVAILS COMPLETED: processed=#{processed_count}, deleted=#{deleted_count}, skipped=#{skipped_count}, errors=#{error_count} ==="
    end
    
    def process_coach_par_times(avail, times_attributes, is_existing_record)
            if times_attributes.respond_to?(:to_unsafe_h)
              times_attributes = times_attributes.to_unsafe_h
            elsif defined?(ActionController::Parameters) && times_attributes.is_a?(ActionController::Parameters)
              times_attributes = times_attributes.to_h
            end

      # Clear existing time slots when updating to prevent duplicates
      if is_existing_record && avail.coach_par_times.exists?
              avail.coach_par_times.destroy_all
            end

      times_processed = 0
            times_attributes.each do |time_key, time_data|
              if time_data.respond_to?(:to_unsafe_h)
                time_data = time_data.to_unsafe_h
              elsif defined?(ActionController::Parameters) && time_data.is_a?(ActionController::Parameters)
                time_data = time_data.to_h
              end

        next unless time_data.is_a?(Hash)
        
        # Skip if marked for destruction
        destroy_flag = time_data['_destroy']
        next if destroy_flag == "1" || destroy_flag == 1 || destroy_flag == true
              
              from_hour = time_data['from(4i)'] || time_data['from']
              from_min = time_data['from(5i)'] || "00"
              to_hour = time_data['to(4i)'] || time_data['to']
              to_min = time_data['to(5i)'] || "00"
              
              if from_hour.present? && to_hour.present?
                from_str = "#{from_hour.to_s.rjust(2, '0')}:#{from_min.to_s.rjust(2, '0')}"
                to_str = "#{to_hour.to_s.rjust(2, '0')}:#{to_min.to_s.rjust(2, '0')}"
                
                avail_time = BxBlockAppointmentManagement::AvailableTime.new(
                  from: from_str, 
                  to: to_str, 
                  coach_par_avail_id: avail.id
                )
                
                if avail_time.save
                  times_processed += 1
          end
        end
      end
      
      Rails.logger.info "Processed #{times_processed} time slots for CoachParAvail #{avail.id}"
    end
    
    def remove_unavailable_slots(coach_par_avail)
      Rails.logger.info "=== REMOVING SLOTS FOR UNAVAILABLE TIME (id=#{coach_par_avail.id}) ==="
      return unless coach_par_avail.avail_type == "unavailable"
      
      start_date_obj = coach_par_avail.start_date.to_date rescue nil
      end_date_obj = coach_par_avail.end_date.to_date rescue nil
      return unless start_date_obj && end_date_obj
      
      # Get all dates in range
      all_dates = []
      if coach_par_avail.week_days.present? && coach_par_avail.week_days.is_a?(Array)
        coach_par_avail.week_days.each do |days|
          next unless days.present?
          days = days.to_s.downcase.to_sym
          all_dates << (start_date_obj..end_date_obj).select { |d| d.send("#{days}?") }
        end
        all_dates = all_dates.flatten
      else
        all_dates = (start_date_obj..end_date_obj).to_a
      end
      
      # Get unavailable time ranges
      unavailable_times = coach_par_avail.coach_par_times.map do |time|
        { from: time.from.to_s, to: time.to.to_s }
      end
      
      return if unavailable_times.empty?
      
      # For each date, remove overlapping slots
      all_dates.each do |date|
        date_str = date.strftime("%d/%m/%Y")
        avail = BxBlockAppointmentManagement::Availability.where(
          availability_date: date_str,
          service_provider_id: coach_par_avail.account_id
        ).first
        
        next unless avail && avail.timeslots.present?
        
        Rails.logger.info "Processing date #{date_str}, found #{avail.timeslots.count} slots"
        
        # Remove slots that overlap with any unavailable time range
        original_count = avail.timeslots.count
        avail.timeslots.reject! do |slot|
          slot_from = Time.parse(slot["from"]).strftime("%H:%M") rescue slot["from"]
          slot_to = Time.parse(slot["to"]).strftime("%H:%M") rescue slot["to"]
          
          unavailable_times.any? do |unav_time|
            unav_from = Time.parse(unav_time[:from]).strftime("%H:%M") rescue unav_time[:from]
            unav_to = Time.parse(unav_time[:to]).strftime("%H:%M") rescue unav_time[:to]
            
            # Check if slot overlaps with unavailable time
            (slot_from < unav_to && slot_to > unav_from)
          end
        end
        
        removed_count = original_count - avail.timeslots.count
        Rails.logger.info "Removed #{removed_count} overlapping slots from #{date_str}"
        
        if avail.timeslots.present?
          avail.timeslots = set_time_slots_for_availability(avail.timeslots)
          avail.save(validate: false)
        else
          avail.destroy
          Rails.logger.info "Deleted availability record for #{date_str} (no slots remaining)"
        end
      end
    rescue => e
      Rails.logger.error "Error removing unavailable slots: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
    end
    
    def set_time_slots_for_availability(slots)
      sno = 0
      slots.each do |slot|
        sno += 1
        slot[:sno] = "#{sno}"
      end
      slots
    end

  end

  index :download_links => false do 
	    selectable_column
	    id_column
	    column :full_name
	    column :email
	    column :full_phone_number
	    column :activated
	    column :created_at
	    column :updated_at
	    actions
  end

  show do
    attributes_table title: "Account Details" do
      row :full_name
      row :email 
      row :full_phone_number
      row :created_at
      row :updated_at
    end
  end

  form title: "Edit Coach Availability" do |f|
    Rails.logger.info "=" * 80
    Rails.logger.info "=== COACH AVAILABILITY FORM RENDERING ==="
    Rails.logger.info "Resource ID: #{f.object.id rescue 'new'}"
    Rails.logger.info "Resource class: #{f.object.class}"
    Rails.logger.info "=" * 80

    f.inputs "Coach Leave" do
      f.has_many :coach_leaves, allow_destroy: true, new_record: "Add Leave" do |t|
        t.input :start_date, label: Start_date, as: :datepicker, datepicker_options: { dateFormat: DATE }
        t.input :end_date, label: End_date, hint: "If you want to take leave of one day, then 'Start date', and 'End date' should be same.", as: :datepicker, datepicker_options: { dateFormat: DATE }
           end
      end

    detailed_hint = "Select one or more week days for recurring slots, or leave blank to apply the date range regardless of weekday."
    
    ensure_time_object = lambda do |value|
      return value unless value.is_a?(String) && value.present?

      parsed =
        if defined?(Time.zone) && Time.zone
          Time.zone.parse(value) rescue nil
        end
      parsed ||= Time.parse(value) rescue nil
      parsed || value
    end

    f.inputs "Coach Availability" do
      para detailed_hint
      para "Use this section to set when the coach is available for calls."
      # Ensure existing available records have at least one time slot built
      f.object.available_coach_par_avails.each do |avail|
        if avail.coach_par_times.empty?
          avail.coach_par_times.build
        end
      end
      f.has_many :available_coach_par_avails, heading: "Available Time", allow_destroy: true, new_record: "Add Availability Block" do |t|
        # Hidden field to mark this as "available" section
        t.input :avail_type, as: :hidden, input_html: { value: "available" }
        t.input :start_date, label: Start_date, as: :datepicker, datepicker_options: { dateFormat: DATE }
        t.input :end_date, label: End_date, as: :datepicker, datepicker_options: { dateFormat: DATE }
        t.input :week_days,
                label: "Week Days",
                as: :check_boxes,
                collection: DAYS,
                include_blank: false,
                multiple: true
        t.has_many :coach_par_times, allow_destroy: true, new_record: "Add time window" do |c_p|
          if c_p.object
            # Convert string times to Time objects before form helper reads them
            from_value = c_p.object.read_attribute(:from)
            to_value = c_p.object.read_attribute(:to)
            
            from_converted = ensure_time_object.call(from_value)
            to_converted = ensure_time_object.call(to_value)
            
            # Override the attribute reader methods to return Time objects
            # This ensures the form helper always gets Time objects
            if from_converted && from_converted.is_a?(Time)
              c_p.object.define_singleton_method(:from) { from_converted }
            end
            if to_converted && to_converted.is_a?(Time)
              c_p.object.define_singleton_method(:to) { to_converted }
            end
          end

          c_p.input :from, as: :time_select, ignore_date: true, start_hour: 6, end_hour: 23, minute_step: 15, include_blank: false
          c_p.input :to, as: :time_select, ignore_date: true, start_hour: 7, end_hour: 23, minute_step: 15, include_blank: false
        end
      end
    end

    f.inputs "Unavailable Time" do
      para detailed_hint
      para "Use this section to mark specific dates/times when the coach is unavailable for calls."
      # Build an empty record if none exist to ensure the "Add" button appears
      if f.object.unavailable_coach_par_avails.empty?
        new_unavail = f.object.unavailable_coach_par_avails.build
        new_unavail.coach_par_times.build  # Also build nested time record
      else
        # For existing records without coach_par_times, build one
        f.object.unavailable_coach_par_avails.each do |unavail|
          if unavail.coach_par_times.empty?
            unavail.coach_par_times.build
          end
        end
      end
      f.has_many :unavailable_coach_par_avails, heading: "Unavailable Time", allow_destroy: true, new_record: "Add Unavailable Block" do |t|
        # Hidden field to mark this as "unavailable" section
        t.input :avail_type, as: :hidden, input_html: { value: "unavailable" }
        t.input :start_date, label: Start_date, as: :datepicker, datepicker_options: { dateFormat: DATE }
        t.input :end_date, label: End_date, as: :datepicker, datepicker_options: { dateFormat: DATE }
        t.input :week_days,
                label: "Week Days",
                as: :check_boxes,
                collection: DAYS,
                include_blank: false,
                multiple: true
        t.has_many :coach_par_times, allow_destroy: true, new_record: "Add time window" do |c_p|
          if c_p.object
            # Convert string times to Time objects before form helper reads them
            from_value = c_p.object.read_attribute(:from)
            to_value = c_p.object.read_attribute(:to)
            
            from_converted = ensure_time_object.call(from_value)
            to_converted = ensure_time_object.call(to_value)
            
            # Override the attribute reader methods to return Time objects
            # This ensures the form helper always gets Time objects
            if from_converted && from_converted.is_a?(Time)
              c_p.object.define_singleton_method(:from) { from_converted }
            end
            if to_converted && to_converted.is_a?(Time)
              c_p.object.define_singleton_method(:to) { to_converted }
            end
          end

          c_p.input :from, as: :time_select, ignore_date: true, start_hour: 6, end_hour: 23, minute_step: 15, include_blank: false
          c_p.input :to, as: :time_select, ignore_date: true, start_hour: 7, end_hour: 23, minute_step: 15, include_blank: false
        end
      end
    end

      f.actions do
        f.submit "Submit"
   	  end
  	end
end
