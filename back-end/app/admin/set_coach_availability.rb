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
  
  permit_params :full_name, :email, :full_phone_number, :password, :password_confirmation, :access_code, :activated,:city, :education, expertise: [], user_languages_attributes: [:id, :language, :_destroy], coach_leaves_attributes: [:id, :start_date, :end_date, :_destroy], coach_par_avails_attributes: [:id, :start_date, :end_date, :avail_type, :_destroy, coach_par_times_attributes: [:id, :from, :to, :booked_slot, :sno, :_destroy], week_days: []] 

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

      # Extract nested attributes for validation
      coach_par_avails_data = account_params["coach_par_avails_attributes"] if account_params["coach_par_avails_attributes"].present?

      # Get the account
      account = AccountBlock::Account.find(params["id"])

      # Process nested attributes manually - ActiveAdmin's super doesn't handle deeply nested attributes correctly
      if coach_par_avails_data.present? || account_params["coach_leaves_attributes"].present?
        Rails.logger.info "=== NESTED ATTRIBUTES DETECTED - Processing manually ==="

        if coach_par_avails_data.present?
          Rails.logger.info "=== STARTING MANUAL PROCESSING OF coach_par_avails_attributes ==="
          Rails.logger.info "coach_par_avails_data structure: #{coach_par_avails_data.inspect}"
          process_coach_par_avails(account, coach_par_avails_data)
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
      Rails.logger.info "Leaves data keys: #{leaves_data.keys.inspect}"
      Rails.logger.info "Leaves data full: #{leaves_data.inspect}"
      
      processed_count = 0
      skipped_count = 0
      
      leaves_data.each do |key, leave_data|
        Rails.logger.info "Processing leave key: #{key}, data: #{leave_data.inspect}"
        
        # Normalize ActionController::Parameters into plain hashes
        if leave_data.respond_to?(:to_unsafe_h)
          leave_data = leave_data.to_unsafe_h
        elsif defined?(ActionController::Parameters) && leave_data.is_a?(ActionController::Parameters)
          leave_data = leave_data.to_h
        end
        
        unless leave_data.is_a?(Hash)
          Rails.logger.warn "Skipping key #{key}: not a Hash (is #{leave_data.class})"
          skipped_count += 1
          next
        end
        
        unless leave_data['start_date'].present? && leave_data['start_date'] != ""
          Rails.logger.warn "Skipping key #{key}: start_date is blank"
          skipped_count += 1
          next
        end
        
        # Parse dates from "DD/MM/YYYY" format
        begin
          start_date_str = leave_data['start_date']
          end_date_str = leave_data['end_date'] || start_date_str
          
          Rails.logger.info "Parsing leave dates - start_date_str: #{start_date_str.inspect}, end_date_str: #{end_date_str.inspect}"
          
          if start_date_str.is_a?(String) && start_date_str.match?(/\d{2}\/\d{2}\/\d{4}/)
            start_date = Date.strptime(start_date_str, "%d/%m/%Y")
            end_date = end_date_str.present? ? Date.strptime(end_date_str, "%d/%m/%Y") : start_date
            Rails.logger.info "Parsed leave dates using strptime: start=#{start_date}, end=#{end_date}"
          else
            start_date = start_date_str.is_a?(Date) ? start_date_str : Date.parse(start_date_str)
            end_date = end_date_str.present? ? (end_date_str.is_a?(Date) ? end_date_str : Date.parse(end_date_str)) : start_date
            Rails.logger.info "Parsed leave dates using Date.parse: start=#{start_date}, end=#{end_date}"
          end
        rescue => e
          Rails.logger.error "✗ Error parsing leave dates for key #{key}: #{e.class} - #{e.message}"
          skipped_count += 1
          next
        end
        
        Rails.logger.info "Creating CoachLeave: account_id=#{account.id}, start_date=#{start_date}, end_date=#{end_date}"
        
        coach_off = BxBlockAppointmentManagement::CoachLeave.new(
          account_id: account.id, 
          start_date: start_date, 
          end_date: end_date
        )
        
        if coach_off.save
          processed_count += 1
          Rails.logger.info "✓ Saved CoachLeave: id=#{coach_off.id} for account #{account.id}"
        else
          Rails.logger.error "✗ Failed to save CoachLeave: #{coach_off.errors.full_messages.inspect}"
        end
      end
      
      Rails.logger.info "=== PROCESS_COACH_LEAVES COMPLETED: processed=#{processed_count}, skipped=#{skipped_count} ==="
    end
    
    def process_coach_par_avails(account, avails_data)
      Rails.logger.info "=== PROCESS_COACH_PAR_AVAILS CALLED ==="
      Rails.logger.info "Account ID: #{account.id}"
      Rails.logger.info "Account Email: #{account.email}"
      Rails.logger.info "Avails data keys: #{avails_data.keys.inspect}"
      Rails.logger.info "Avails data count: #{avails_data.keys.count}"
      Rails.logger.info "Avails data full structure: #{avails_data.inspect}"
      
      processed_count = 0
      skipped_count = 0
      error_count = 0
      deleted_count = 0
      processed_ids = {} # Track processed IDs to prevent collision
      
      avails_data.each do |key, avl_data|
        Rails.logger.info "--- Processing availability key: #{key} ---"
        Rails.logger.info "avl_data class: #{avl_data.class}"

        # Normalize ActionController::Parameters into plain hashes
        if avl_data.respond_to?(:to_unsafe_h)
          avl_data = avl_data.to_unsafe_h
        elsif defined?(ActionController::Parameters) && avl_data.is_a?(ActionController::Parameters)
          avl_data = avl_data.to_h
        end

        Rails.logger.info "avl_data normalized class: #{avl_data.class}"
        Rails.logger.info "avl_data full: #{avl_data.inspect}"
        Rails.logger.info "avl_data keys: #{avl_data.is_a?(Hash) ? avl_data.keys.inspect : 'N/A'}"
        
        unless avl_data.is_a?(Hash)
          Rails.logger.warn "Skipping key #{key}: not a Hash after normalization (is #{avl_data.class})"
          skipped_count += 1
          next
        end
        
        unless avl_data['start_date'].present? && avl_data['start_date'] != ""
          Rails.logger.warn "Skipping key #{key}: start_date is blank (value: #{avl_data['start_date'].inspect})"
          skipped_count += 1
          next
        end
        
        Rails.logger.info "Processing key #{key} with start_date: #{avl_data['start_date'].inspect}"
        Rails.logger.info "Checking _destroy flag: #{avl_data['_destroy'].inspect} (class: #{avl_data['_destroy'].class})"
        
        # Check for _destroy flag first - ActiveAdmin sends it as "1", "0", true, false, or integer
        destroy_flag = avl_data['_destroy']
        should_destroy = false
        
        if destroy_flag.present?
          # Handle various formats ActiveAdmin might send
          if destroy_flag == "1" || destroy_flag == 1 || destroy_flag == true || destroy_flag == "true" || destroy_flag.to_s.strip == "1"
            should_destroy = true
            Rails.logger.info "✓ _destroy flag detected as TRUE (value: #{destroy_flag.inspect})"
          else
            Rails.logger.info "✗ _destroy flag is present but FALSE (value: #{destroy_flag.inspect})"
          end
        else
          Rails.logger.info "✗ _destroy flag is not present"
        end
        
        if should_destroy
          if avl_data['id'].present? && avl_data['id'] != ""
            avail_to_delete = BxBlockAppointmentManagement::CoachParAvail.find_by(id: avl_data['id'], account_id: account.id)
            if avail_to_delete
              Rails.logger.info "=== DELETING CoachParAvail (id=#{avail_to_delete.id}, avail_type=#{avail_to_delete.avail_type}) ==="
              # If it's unavailable, remove slots before deleting
              if avail_to_delete.avail_type == "unavailable"
                Rails.logger.info "Calling remove_unavailable_slots for unavailable record..."
                remove_unavailable_slots(avail_to_delete)
              end
              avail_to_delete.destroy
              deleted_count += 1
              Rails.logger.info "✓ Successfully deleted CoachParAvail: id=#{avail_to_delete.id}"
            else
              Rails.logger.error "✗ CoachParAvail with id=#{avl_data['id']} not found for deletion (account_id=#{account.id})"
            end
          else
            Rails.logger.warn "✗ Cannot delete: no ID provided for key #{key}"
          end
          next # Skip to next record
        end
        
        # Clean up week_days
        week_days_raw = avl_data['week_days']
        if week_days_raw.respond_to?(:to_unsafe_h)
          week_days_raw = week_days_raw.to_unsafe_h
        elsif defined?(ActionController::Parameters) && week_days_raw.is_a?(ActionController::Parameters)
          week_days_raw = week_days_raw.to_h
        end
        Rails.logger.info "Original week_days: #{week_days_raw.inspect} (class: #{week_days_raw.class})"

        week_days = case week_days_raw
                    when Array
                      week_days_raw
                    when Hash
                      week_days_raw.values
                    when String
                      [week_days_raw]
                    when nil
                      []
                    else
                      Array(week_days_raw)
                    end

        week_days = week_days.compact.reject(&:blank?)
        week_days = nil if week_days.empty?
        Rails.logger.info "Final week_days: #{week_days.inspect}"
        
        # Parse dates
  		begin
          start_date_str = avl_data['start_date']
          end_date_str = avl_data['end_date'] || start_date_str
          
          Rails.logger.info "Parsing dates - start_date_str: #{start_date_str.inspect}, end_date_str: #{end_date_str.inspect}"
          
          if start_date_str.is_a?(String) && start_date_str.match?(/\d{2}\/\d{2}\/\d{4}/)
            start_date = Date.strptime(start_date_str, "%d/%m/%Y")
            end_date = end_date_str.present? ? Date.strptime(end_date_str, "%d/%m/%Y") : start_date
            Rails.logger.info "Parsed dates using strptime: start=#{start_date}, end=#{end_date}"
          else
            start_date = start_date_str.is_a?(Date) ? start_date_str : Date.parse(start_date_str)
            end_date = end_date_str.present? ? (end_date_str.is_a?(Date) ? end_date_str : Date.parse(end_date_str)) : start_date
            Rails.logger.info "Parsed dates using Date.parse: start=#{start_date}, end=#{end_date}"
          end
        rescue => e
          Rails.logger.error "✗ Error parsing dates for key #{key}: #{e.class} - #{e.message}"
          Rails.logger.error "Backtrace: #{e.backtrace.first(3).join("\n")}"
          error_count += 1
          next
        end
        
        # Check if this is an existing record being updated
        avail = nil
        record_id = avl_data['id'].present? && avl_data['id'] != "" ? avl_data['id'].to_i : nil
        
        # Prevent ID collision: if same ID already processed with different avail_type, create new record
        if record_id && processed_ids[record_id].present?
          Rails.logger.warn "ID collision detected: id=#{record_id} already processed with avail_type=#{processed_ids[record_id]}. Creating new record instead."
          record_id = nil # Force creation of new record
        end
        
        if record_id
          avail = BxBlockAppointmentManagement::CoachParAvail.find_by(id: record_id, account_id: account.id)
          if avail
            Rails.logger.info "Found existing CoachParAvail (id=#{avail.id}), updating..."
            avail.start_date = start_date
            avail.end_date = end_date
            avail.week_days = week_days
          else
            Rails.logger.warn "CoachParAvail with id=#{record_id} not found, creating new record"
            avail = BxBlockAppointmentManagement::CoachParAvail.new(
              start_date: start_date, 
              end_date: end_date, 
              week_days: week_days, 
              account_id: account.id
            )
            record_id = nil # Mark as new record
          end
        else
          # New record
          Rails.logger.info "Creating new CoachParAvail with: start_date=#{start_date}, end_date=#{end_date}, week_days=#{week_days.inspect}, account_id=#{account.id}"
          avail = BxBlockAppointmentManagement::CoachParAvail.new(
            start_date: start_date, 
            end_date: end_date, 
            week_days: week_days, 
            account_id: account.id
          )
        end
        
        # Set avail_type based on form input (from hidden field)
        if avl_data['avail_type'].present?
          avail.avail_type = avl_data['avail_type']
          Rails.logger.info "Set avail_type to '#{avail.avail_type}' from form data"
        elsif key == "1"
          # Fallback: if no avail_type in form but key is "1", assume unavailable (for backward compatibility)
          avail.avail_type = "unavailable"
          Rails.logger.info "Set avail_type to 'unavailable' (fallback: key=#{key})"
        else
          # Default to available if not specified
          avail.avail_type = "available"
          Rails.logger.info "Set avail_type to 'available' (default)"
        end
        
        Rails.logger.info "Attempting to save CoachParAvail (id=#{avail.id rescue 'new'}, avail_type=#{avail.avail_type})..."
        
        if avail.save
          processed_count += 1
          # Track processed ID to prevent collision
          processed_ids[avail.id] = avail.avail_type
          Rails.logger.info "✓ Saved CoachParAvail: id=#{avail.id} for account #{account.id}"
          
          # Process time slots
          if avl_data['coach_par_times_attributes'].present?
            times_attributes = avl_data['coach_par_times_attributes']
            if times_attributes.respond_to?(:to_unsafe_h)
              times_attributes = times_attributes.to_unsafe_h
            elsif defined?(ActionController::Parameters) && times_attributes.is_a?(ActionController::Parameters)
              times_attributes = times_attributes.to_h
            end

            Rails.logger.info "Processing coach_par_times_attributes: #{times_attributes.inspect}"
            times_processed = 0
            
            # Clear existing time slots when updating an existing record to prevent duplicates
            if avl_data['id'].present? && avail.coach_par_times.exists?
              Rails.logger.info "Clearing existing time slots for CoachParAvail #{avail.id}"
              avail.coach_par_times.destroy_all
            end

            times_attributes.each do |time_key, time_data|
              Rails.logger.info "Processing time slot key: #{time_key}, data: #{time_data.inspect}"
              
              if time_data.respond_to?(:to_unsafe_h)
                time_data = time_data.to_unsafe_h
              elsif defined?(ActionController::Parameters) && time_data.is_a?(ActionController::Parameters)
                time_data = time_data.to_h
              end

              unless time_data.is_a?(Hash)
                Rails.logger.warn "Skipping time_key #{time_key}: not a Hash"
                next
              end
              
              from_hour = time_data['from(4i)'] || time_data['from']
              from_min = time_data['from(5i)'] || "00"
              to_hour = time_data['to(4i)'] || time_data['to']
              to_min = time_data['to(5i)'] || "00"
              
              Rails.logger.info "Time data extracted: from_hour=#{from_hour}, from_min=#{from_min}, to_hour=#{to_hour}, to_min=#{to_min}"
              
              if from_hour.present? && to_hour.present?
                from_str = "#{from_hour.to_s.rjust(2, '0')}:#{from_min.to_s.rjust(2, '0')}"
                to_str = "#{to_hour.to_s.rjust(2, '0')}:#{to_min.to_s.rjust(2, '0')}"
                
                Rails.logger.info "Creating AvailableTime: from=#{from_str}, to=#{to_str}, coach_par_avail_id=#{avail.id}"
                
                avail_time = BxBlockAppointmentManagement::AvailableTime.new(
                  from: from_str, 
                  to: to_str, 
                  coach_par_avail_id: avail.id
                )
                
                if avail_time.save
                  times_processed += 1
                  Rails.logger.info "✓ Saved AvailableTime: id=#{avail_time.id} for CoachParAvail #{avail.id}"
                else
                  Rails.logger.error "✗ Failed to save AvailableTime: #{avail_time.errors.full_messages.inspect}"
                end
              else
                Rails.logger.warn "Skipping time slot: from_hour or to_hour is blank"
              end
            end
            
            Rails.logger.info "Processed #{times_processed} time slots for CoachParAvail #{avail.id}"
          else
            Rails.logger.info "No coach_par_times_attributes present for this availability"
          end
        else
          error_count += 1
          Rails.logger.error "✗ Failed to save CoachParAvail: #{avail.errors.full_messages.inspect}"
          Rails.logger.error "CoachParAvail attributes: #{avail.attributes.inspect}"
        end
      end
      
      Rails.logger.info "=== PROCESS_COACH_PAR_AVAILS COMPLETED ==="
      Rails.logger.info "Summary: processed=#{processed_count}, deleted=#{deleted_count}, skipped=#{skipped_count}, errors=#{error_count}"
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
      # Filter to show only available records (avail_type IS NULL or "available")
      available_collection = f.object.coach_par_avails.where("avail_type IS NULL OR avail_type = ?", "available")
      f.has_many :coach_par_avails, heading: "Available Time", allow_destroy: true, new_record: "Add Availability Block", collection: available_collection do |t|
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
      # Filter to show only unavailable records
      unavailable_collection = f.object.coach_par_avails.where(avail_type: "unavailable")
      f.has_many :coach_par_avails, heading: "Unavailable Time", allow_destroy: true, new_record: "Add Unavailable Block", collection: unavailable_collection do |t|
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
