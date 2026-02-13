namespace :cleanup do
  desc "Clean up ALL duplicates in coach availability data"
  task cleanup_all_coach_duplicates: :environment do
    puts "=" * 80
    puts "Cleaning up ALL duplicate coach availability data..."
    puts "=" * 80
    
    # 1. Clean up CoachLeave duplicates
    puts "\n--- Cleaning CoachLeave duplicates ---"
    leave_duplicates_removed = 0
    BxBlockAppointmentManagement::CoachLeave.all.group_by { |l| [l.account_id, l.start_date.to_date, l.end_date.to_date] }.each do |key, records|
      if records.count > 1
        keeper = records.sort_by(&:id).first
        records[1..-1].each do |dup|
          dup.destroy
          leave_duplicates_removed += 1
        end
      end
    end
    puts "Removed #{leave_duplicates_removed} duplicate CoachLeave records"
    
    # 2. Clean up CoachParAvail duplicates  
    puts "\n--- Cleaning CoachParAvail duplicates ---"
    avail_duplicates_removed = 0
    BxBlockAppointmentManagement::CoachParAvail.all.group_by do |a| 
      week_days_str = a.week_days.is_a?(Array) ? a.week_days.sort.join(',') : a.week_days.to_s
      [a.account_id, a.start_date.to_date, a.end_date.to_date, a.avail_type || 'available', week_days_str]
    end.each do |key, records|
      if records.count > 1
        keeper = records.sort_by(&:id).first
        puts "  Keeping ID #{keeper.id}, removing #{records.count - 1} duplicates for: #{key.inspect}"
        records[1..-1].each do |dup|
          dup.coach_par_times.destroy_all if dup.coach_par_times.any?
          dup.destroy
          avail_duplicates_removed += 1
        end
      end
    end
    puts "Removed #{avail_duplicates_removed} duplicate CoachParAvail records"
    
    puts "\n" + "=" * 80
    puts "Cleanup completed!"
    puts "=" * 80
  end

  desc "Check goals for an account"
  task check_goals: :environment do
    account_id = ENV['ACCOUNT_ID'] || 20
    puts "=" * 80
    puts "Checking goals for account ##{account_id}..."
    puts "=" * 80
    
    # Find account
    account = AccountBlock::Account.find_by(id: account_id)
    
    if account
      puts "Account found: #{account.email}"
      
      # Check goals through account association
      if account.respond_to?(:goals)
        goals = account.goals
        puts "Goals count (via association): #{goals.count}"
        goals.each do |goal|
          puts "  Goal ID: #{goal.id}, Goal: #{goal.goal}, FocusArea: #{goal.focus_area_id}, Complete: #{goal.is_complete}, Date: #{goal.date}"
        end
      end
      
      # Check ALL StoringFocusArea records
      all_storing = BxBlockAssessmenttest::StoringFocusArea.where(account_id: account_id)
      puts "\nAll StoringFocusArea records: #{all_storing.count}"
      all_storing.each do |storing|
        raw_value = storing.read_attribute_before_type_cast(:focus_areas_id)
        puts "  ID: #{storing.id}"
        puts "    Raw DB value: #{raw_value.inspect}"
        puts "    Deserialized value: #{storing.focus_areas_id.inspect}"
        puts "    Value class: #{storing.focus_areas_id.class}"
      end
      
      # Latest StoringFocusArea
      storing = all_storing.last
      if storing
        puts "\nLatest StoringFocusArea: ID=#{storing.id}"
        puts "  focus_areas_id raw: #{storing.read_attribute_before_type_cast(:focus_areas_id).inspect}"
        puts "  focus_areas_id: #{storing.focus_areas_id.inspect}"
        puts "  focus_areas_id class: #{storing.focus_areas_id.class}"
        
        # Test if 30 is included
        fa = storing.focus_areas_id
        if fa.is_a?(String)
          fa = JSON.parse(fa) rescue []
        end
        fa = [] if fa.nil? || !fa.is_a?(Array)
        fa = fa.flatten.map(&:to_i)
        puts "  Processed focus_areas: #{fa.inspect}"
        puts "  Includes 30? #{fa.include?(30)}"
      else
        puts "\nNo StoringFocusArea found for account #{account_id}"
      end
    else
      puts "Account not found with ID #{account_id}"
    end
    
    # Also check all goals directly
    all_goals = BxBlockAssessmenttest::Goal.where(account_id: account_id)
    puts "\nDirect query - All goals for account #{account_id}: #{all_goals.count}"
    all_goals.each do |goal|
      puts "  Goal ID: #{goal.id}, Goal: #{goal.goal}, FocusArea: #{goal.focus_area_id}, Complete: #{goal.is_complete}"
    end
    
    puts "=" * 80
  end

  desc "Test goal creation for an account"
  task test_goal_creation: :environment do
    account_id = ENV['ACCOUNT_ID'] || 20
    focus_area_id = ENV['FOCUS_AREA_ID'] || 30
    
    puts "=" * 80
    puts "Testing goal creation for account ##{account_id}..."
    puts "=" * 80
    
    account = AccountBlock::Account.find_by(id: account_id)
    unless account
      puts "Account not found!"
      next
    end
    
    puts "Account: #{account.email}"
    
    # Check StoringFocusArea
    sfa = BxBlockAssessmenttest::StoringFocusArea.where(account_id: account_id).last
    if sfa
      puts "StoringFocusArea: #{sfa.focus_areas_id.inspect}"
      puts "  focus_areas_id class: #{sfa.focus_areas_id.class}"
      
      fa = sfa.focus_areas_id
      if fa.is_a?(String)
        fa = JSON.parse(fa) rescue []
      end
      fa = [] if fa.nil? || !fa.is_a?(Array)
      fa = fa.flatten.map(&:to_i)
      
      puts "  Processed focus_areas: #{fa.inspect}"
      puts "  Includes #{focus_area_id}? #{fa.include?(focus_area_id.to_i)}"
    else
      puts "No StoringFocusArea found - cannot create goal!"
      next
    end
    
    # Try to create a test goal
    puts "\nCreating test goal..."
    goal = BxBlockAssessmenttest::Goal.new(
      account_id: account_id,
      focus_area_id: focus_area_id.to_i,
      goal: "Test goal from rake task",
      date: DateTime.now + 1.day,
      time_slot: "10:00 AM",
      is_complete: false
    )
    
    puts "  Goal valid? #{goal.valid?}"
    puts "  Validation errors: #{goal.errors.full_messages.join(', ')}" unless goal.valid?
    
    if goal.save
      puts "  Goal saved! ID: #{goal.id}"
      puts "  Attributes: #{goal.attributes.inspect}"
    else
      puts "  Failed to save: #{goal.errors.full_messages.join(', ')}"
    end
    
    puts "=" * 80
  end

  desc "List all goals in the system"
  task list_all_goals: :environment do
    puts "=" * 80
    puts "Listing ALL Goals..."
    puts "=" * 80
    
    total = BxBlockAssessmenttest::Goal.count
    puts "Total goals in database: #{total}"
    
    if total > 0
      puts "\nLast 10 goals:"
      BxBlockAssessmenttest::Goal.order(created_at: :desc).limit(10).each do |goal|
        account = AccountBlock::Account.find_by(id: goal.account_id)
        puts "  ID: #{goal.id}, Account: #{goal.account_id} (#{account&.email || 'unknown'})"
        puts "    Goal: #{goal.goal}, FocusArea: #{goal.focus_area_id}, Complete: #{goal.is_complete}"
        puts "    Date: #{goal.date}, TimeSlot: #{goal.time_slot}"
        puts ""
      end
    else
      puts "No goals found in the database."
    end
    
    puts "\n--- StoringFocusArea Summary ---"
    sfa_count = BxBlockAssessmenttest::StoringFocusArea.count
    puts "Total StoringFocusArea records: #{sfa_count}"
    BxBlockAssessmenttest::StoringFocusArea.order(id: :desc).limit(5).each do |sfa|
      account = AccountBlock::Account.find_by(id: sfa.account_id)
      puts "  SFA ID: #{sfa.id}, Account: #{sfa.account_id} (#{account&.email || 'unknown'})"
      puts "    focus_areas_id: #{sfa.focus_areas_id.inspect}"
    end
    
    puts "=" * 80
  end
  
  desc "List all CoachLeave records for all accounts"
  task list_coach_leaves: :environment do
    puts "=" * 80
    puts "Listing ALL CoachLeave records..."
    puts "=" * 80
    
    records = BxBlockAppointmentManagement::CoachLeave.all.order(:account_id, :id)
    
    current_account = nil
    records.each do |r|
      if current_account != r.account_id
        current_account = r.account_id
        account = AccountBlock::Account.find_by(id: r.account_id)
        puts "\n--- Account ##{r.account_id} (#{account&.email || 'unknown'}) ---"
      end
      puts "  ID: #{r.id}, Dates: #{r.start_date} - #{r.end_date}"
    end
    
    puts "\n" + "=" * 80
    puts "Total records: #{records.count}"
    puts "=" * 80
  end
  
  desc "Remove duplicate CoachLeave records"
  task cleanup_coach_leaves: :environment do
    puts "=" * 80
    puts "Cleaning up duplicate CoachLeave records..."
    puts "=" * 80
    
    total_removed = 0
    
    # Get all accounts with coach leaves
    account_ids = BxBlockAppointmentManagement::CoachLeave.distinct.pluck(:account_id)
    
    account_ids.each do |account_id|
      account = AccountBlock::Account.find_by(id: account_id)
      puts "\nProcessing account ##{account_id} (#{account&.email || 'unknown'})..."
      
      leaves = BxBlockAppointmentManagement::CoachLeave.where(account_id: account_id)
      
      # Group by start_date and end_date
      grouped = leaves.group_by { |l| "#{l.start_date}-#{l.end_date}" }
      
      grouped.each do |key, group|
        if group.count > 1
          puts "  Found #{group.count} duplicates for dates: #{key}"
          
          # Keep the first one, delete the rest
          keeper = group.sort_by(&:id).first
          to_delete = group.sort_by(&:id)[1..-1]
          
          puts "  Keeping ID: #{keeper.id}, removing #{to_delete.count} duplicates"
          
          to_delete.each do |dup|
            dup.destroy
            total_removed += 1
          end
        end
      end
    end
    
    puts "\n" + "=" * 80
    puts "Removed #{total_removed} duplicate CoachLeave records"
    puts "=" * 80
  end
  
  desc "List all CoachParAvail records for a specific account"
  task list_coach_avails: :environment do
    account_id = ENV['ACCOUNT_ID'] || 6
    puts "=" * 80
    puts "Listing all CoachParAvail records for account ##{account_id}..."
    puts "=" * 80
    
    records = BxBlockAppointmentManagement::CoachParAvail.where(account_id: account_id).order(:id)
    
    records.each do |r|
      puts "ID: #{r.id}"
      puts "  Start Date: #{r.start_date}"
      puts "  End Date: #{r.end_date}"
      puts "  Avail Type: #{r.avail_type}"
      puts "  Week Days: #{r.week_days.inspect}"
      puts "  Created At: #{r.created_at}"
      puts "-" * 40
    end
    
    puts "\nTotal records: #{records.count}"
  end
  
  desc "List ALL CoachParAvail records in the database"
  task list_all_coach_avails: :environment do
    puts "=" * 80
    puts "Listing ALL CoachParAvail records..."
    puts "=" * 80
    
    records = BxBlockAppointmentManagement::CoachParAvail.all.order(:account_id, :id)
    
    current_account = nil
    records.each do |r|
      if current_account != r.account_id
        current_account = r.account_id
        account = AccountBlock::Account.find_by(id: r.account_id)
        puts "\n--- Account ##{r.account_id} (#{account&.email || 'unknown'}) ---"
      end
      puts "  ID: #{r.id}, Type: #{r.avail_type || 'nil'}, Dates: #{r.start_date} - #{r.end_date}, WeekDays: #{r.week_days.inspect}"
    end
    
    puts "\n" + "=" * 80
    puts "Total records: #{records.count}"
    puts "=" * 80
  end
  
  desc "Remove duplicates based on start_date and end_date only (more aggressive)"
  task aggressive_cleanup: :environment do
    account_id = ENV['ACCOUNT_ID'] || 6
    puts "=" * 80
    puts "Aggressive cleanup for account ##{account_id}..."
    puts "=" * 80
    
    # Group by just start_date and end_date
    records = BxBlockAppointmentManagement::CoachParAvail.where(account_id: account_id)
    
    grouped = records.group_by { |r| "#{r.start_date}-#{r.end_date}" }
    
    total_removed = 0
    
    grouped.each do |key, group|
      if group.count > 1
        puts "\nFound #{group.count} records for dates: #{key}"
        
        # Keep the first one, delete the rest
        keeper = group.sort_by(&:id).first
        to_delete = group.sort_by(&:id)[1..-1]
        
        puts "  Keeping ID: #{keeper.id}"
        
        to_delete.each do |dup|
          puts "  Deleting ID: #{dup.id}"
          dup.coach_par_times.destroy_all if dup.respond_to?(:coach_par_times) && dup.coach_par_times.any?
          dup.destroy
          total_removed += 1
        end
      end
    end
    
    puts "\n" + "=" * 80
    puts "Removed #{total_removed} duplicate records"
    puts "=" * 80
  end
  
  desc "Remove duplicate CoachParAvail records (unavailable entries that got replicated)"
  task duplicate_coach_avails: :environment do
    puts "=" * 80
    puts "Starting cleanup of duplicate CoachParAvail records..."
    puts "=" * 80
    
    total_duplicates_removed = 0
    accounts_processed = 0
    
    # Get all accounts that have coach_par_avails
    account_ids = BxBlockAppointmentManagement::CoachParAvail.distinct.pluck(:account_id)
    
    puts "Found #{account_ids.count} accounts with coach availability records"
    
    account_ids.each do |account_id|
      account = AccountBlock::Account.find_by(id: account_id)
      next unless account
      
      accounts_processed += 1
      puts "\nProcessing account ##{account_id} (#{account.email})..."
      
      # Group by unique signature: start_date, end_date, avail_type
      avails = BxBlockAppointmentManagement::CoachParAvail.where(account_id: account_id)
      
      # Group records by their "signature"
      grouped = avails.group_by do |a|
        # Create a signature based on dates and avail_type
        week_days_str = a.week_days.is_a?(Array) ? a.week_days.sort.join(',') : a.week_days.to_s
        "#{a.start_date}-#{a.end_date}-#{a.avail_type}-#{week_days_str}"
      end
      
      grouped.each do |signature, records|
        if records.count > 1
          puts "  Found #{records.count} duplicates for signature: #{signature}"
          
          # Keep the oldest record (smallest ID), delete the rest
          records_sorted = records.sort_by(&:id)
          keeper = records_sorted.first
          duplicates = records_sorted[1..-1]
          
          puts "  Keeping record ##{keeper.id}, removing #{duplicates.count} duplicates"
          
          duplicates.each do |dup|
            # Also delete associated coach_par_times
            dup.coach_par_times.destroy_all if dup.coach_par_times.any?
            dup.destroy
            total_duplicates_removed += 1
            puts "    - Removed duplicate ##{dup.id}"
          end
        end
      end
    end
    
    puts "\n" + "=" * 80
    puts "Cleanup completed!"
    puts "Accounts processed: #{accounts_processed}"
    puts "Total duplicates removed: #{total_duplicates_removed}"
    puts "=" * 80
  end
  
  desc "Check coach availability for a specific account"
  task check_coach_availability: :environment do
    account_id = ENV['ACCOUNT_ID']
    name_search = ENV['NAME']
    
    if name_search.present?
      account = AccountBlock::Account.where("full_name LIKE ?", "%#{name_search}%").first
    elsif account_id.present?
      account = AccountBlock::Account.find_by(id: account_id)
    else
      puts "Usage: ACCOUNT_ID=22 rake cleanup:check_coach_availability"
      puts "   or: NAME=Nidhi rake cleanup:check_coach_availability"
      exit
    end
    
    unless account
      puts "Account not found!"
      exit
    end
    
    puts "=" * 80
    puts "Checking availability for: #{account.full_name} (ID: #{account.id})"
    puts "=" * 80
    
    # Check CoachParAvail records
    avails = BxBlockAppointmentManagement::CoachParAvail.where(account_id: account.id)
    puts "\nCoachParAvail records: #{avails.count}"
    avails.each do |a|
      puts "  ID: #{a.id}"
      puts "    Dates: #{a.start_date} to #{a.end_date}"
      puts "    Type: #{a.avail_type || 'available'}"
      puts "    Week Days: #{a.week_days.inspect}"
      puts "    Time slots: #{a.coach_par_times.count}"
      a.coach_par_times.each do |t|
        puts "      - From: #{t.from}, To: #{t.to}"
      end
    end
    
    # Check Availability records (the actual booking slots)
    availabilities = BxBlockAppointmentManagement::Availability.where(service_provider_id: account.id)
    puts "\nAvailability records (booking slots): #{availabilities.count}"
    if availabilities.count > 0
      puts "First 10 records:"
      availabilities.order(:availability_date).limit(10).each do |av|
        puts "  Date: #{av.availability_date}, Slots: #{av.timeslots&.count || 0}"
      end
    end
    
    puts "=" * 80
  end

  desc "Show duplicate CoachParAvail records without removing them (dry run)"
  task show_duplicate_coach_avails: :environment do
    puts "=" * 80
    puts "Scanning for duplicate CoachParAvail records (DRY RUN - no changes will be made)..."
    puts "=" * 80
    
    total_duplicates = 0
    accounts_with_duplicates = 0
    
    # Get all accounts that have coach_par_avails
    account_ids = BxBlockAppointmentManagement::CoachParAvail.distinct.pluck(:account_id)
    
    puts "Found #{account_ids.count} accounts with coach availability records"
    
    account_ids.each do |account_id|
      account = AccountBlock::Account.find_by(id: account_id)
      next unless account
      
      # Group by unique signature
      avails = BxBlockAppointmentManagement::CoachParAvail.where(account_id: account_id)
      
      grouped = avails.group_by do |a|
        week_days_str = a.week_days.is_a?(Array) ? a.week_days.sort.join(',') : a.week_days.to_s
        "#{a.start_date}-#{a.end_date}-#{a.avail_type}-#{week_days_str}"
      end
      
      account_has_duplicates = false
      
      grouped.each do |signature, records|
        if records.count > 1
          unless account_has_duplicates
            puts "\nAccount ##{account_id} (#{account.email}):"
            account_has_duplicates = true
            accounts_with_duplicates += 1
          end
          
          puts "  Signature: #{signature}"
          puts "  Duplicate count: #{records.count}"
          records.sort_by(&:id).each do |r|
            puts "    - ID: #{r.id}, created: #{r.created_at}"
          end
          
          total_duplicates += records.count - 1  # -1 because one is the original
        end
      end
    end
    
    puts "\n" + "=" * 80
    puts "Scan completed!"
    puts "Accounts with duplicates: #{accounts_with_duplicates}"
    puts "Total duplicate records found: #{total_duplicates}"
    puts "=" * 80
    puts "\nTo remove duplicates, run: rake cleanup:duplicate_coach_avails"
  end

  desc "Check Assess Yourself data structure"
  task check_assess_yourself: :environment do
    puts "=" * 80
    puts "ASSESS YOURSELF DATA CHECK"
    puts "=" * 80
    
    puts "\n--- AssessYourselfQuestions ---"
    questions = BxBlockAssessmenttest::AssessYourselfQuestion.all
    puts "Total questions: #{questions.count}"
    questions.each do |q|
      puts "  Q#{q.id}: #{q.question_title}"
    end
    
    puts "\n--- AssessYourselfAnswers (options for each question) ---"
    answers = BxBlockAssessmenttest::AssessYourselfAnswer.all
    puts "Total answers: #{answers.count}"
    answers.group_by(&:assess_yourself_question_id).each do |qid, ans|
      puts "  Question #{qid}:"
      ans.each do |a|
        puts "    A#{a.id}: #{a.answer_title}"
      end
    end
    
    puts "\n--- AssessYourselfTestTypes (sub-questions for each answer/test) ---"
    test_types = BxBlockAssessmenttest::AssessYourselfTestType.all
    puts "Total test types: #{test_types.count}"
    test_types.group_by(&:assess_yourself_answer_id).each do |aid, tts|
      answer = BxBlockAssessmenttest::AssessYourselfAnswer.find_by(id: aid)
      puts "  Answer #{aid} (#{answer&.answer_title}):"
      tts.sort_by(&:sequence_number).each do |tt|
        puts "    TT#{tt.id} Seq#{tt.sequence_number}: #{tt.question_title&.truncate(60)}"
        tt.assess_tt_answers.each do |tta|
          puts "      - #{tta.answer&.truncate(40)} (score: #{tta.answer_score})"
        end
      end
    end
    
    puts "\n--- AssessTtAnswers (answers for test type questions) ---"
    tt_answers = BxBlockAssessmenttest::AssessTtAnswer.all
    puts "Total TT answers: #{tt_answers.count}"
    
    puts "\n--- AnixetyCutoff (score ranges for results) ---"
    cutoffs = BxBlockAssessmenttest::AnixetyCutoff.all
    puts "Total cutoffs: #{cutoffs.count}"
    cutoffs.each do |c|
      puts "  ID#{c.id}: Category #{c.category_id}, #{c.min_score}-#{c.max_score}, #{c.anixety_title&.truncate(40)}"
    end
    
    puts "\n" + "=" * 80
    puts "Check complete!"
    puts "=" * 80
  end
end


