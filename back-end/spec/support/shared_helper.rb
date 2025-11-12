require "rails_helper"
module Support
  class SharedHelper
    PDIGEST="$2a$12$fkBB390bfobtUaQHS7XiM.WfMMp/rQdt6rluyaAJ.OD..."
    CREATED_AT="2022-12-01 10:48:35"
    UPDATED_AT="2022-12-01 10:51:21"
    STRFTIME_FORMAT="%d/%m/%Y"
    def coach_role
      coachrole = BxBlockRolesPermissions::Role.find_by(id: 2)
      coachrole = BxBlockRolesPermissions::Role.create(id: 2, name: "coach") unless coachrole
      return coachrole
    end

    def hr_role
      hrrole = BxBlockRolesPermissions::Role.find_by(id: 3)
      hrrole = BxBlockRolesPermissions::Role.create(id: 3, name: "hr") unless hrrole
      return hrrole
    end

    def admin_role
      adminrole = BxBlockRolesPermissions::Role.find_by(id: 4)
      adminrole = BxBlockRolesPermissions::Role.create(id: 4, name: "admin") unless adminrole
      return adminrole
    end

    def admin_user
      admin_current_user =  AccountBlock::Account.find_by(id: 88)
      admin_current_user.update(role_id: admin_role.id) if admin_current_user
      admin_current_user = AccountBlock::Account.new(id: 88 ,full_name: "admin",email:"admin@gmail.com",
                                                     full_phone_number: "919099683863", password: "Admin@1234",
                                                     password_confirmation: "Admin@1234", activated: true, role_id: admin_role.id) unless admin_current_user.present?
      admin_current_user&.save(validate: false)
      return admin_current_user
    end

    def get_admin_token
      @token =  BuilderJsonWebToken.encode(admin_user&.id)
      return @token
    end

    def coach_specialization
      CoachSpecialization.create(expertise: "expertisetext")
end


    def create_company_hr
      comp = Company.find_by(id: 11)
      comp = Company.create(id: 11, name: "tcs", email: "tcs@gmail.com", address: "pune") unless comp.present?
      hr_account = AccountBlock::Account.find_by(id: 112)
      hr_account = AccountBlock::Account.new(id: 112, first_name: nil, last_name: nil, full_phone_number: "917907617765", country_code: 91, phone_number: 7901817765, email: "hr1@gmail.com", activated: true, device_id: nil, unique_auth_id: nil, password_digest: PDIGEST, type: "EmailAccount", created_at: CREATED_AT, updated_at: UPDATED_AT, user_name: nil, platform: nil, user_type: nil, app_language_id: nil, last_visit_at: nil, is_blacklisted: false, suspend_until: nil, status: "regular", stripe_id: nil, stripe_subscription_id: nil, stripe_subscription_date: nil, role_id: 5, full_name: "coach2222", gender: nil, date_of_birth: nil, age: nil, is_paid: false, access_code: comp.hr_code, rating: nil, city: nil, expertise: "[\"Stress\"]", education: nil) unless hr_account.present?
      return hr_account
    end

    def get_coach_user
      coach_account = AccountBlock::Account.find_by(id: 300)
      coach_account = AccountBlock::Account.new(id: 300, first_name: nil, last_name: nil, full_phone_number: "917907617765", country_code: 91, phone_number: 7901817765, email: "coach17@gmail.com", activated: true, device_id: nil, unique_auth_id: nil, password_digest: PDIGEST, type: "EmailAccount", created_at: CREATED_AT, updated_at: UPDATED_AT, user_name: nil, platform: nil, user_type: nil, app_language_id: nil, last_visit_at: nil, is_blacklisted: false, suspend_until: nil, status: "regular", stripe_id: nil, stripe_subscription_id: nil, stripe_subscription_date: nil, role_id: 2, full_name: "coach2222", gender: nil, date_of_birth: nil, age: nil, is_paid: false, access_code: nil, rating: nil, city: nil, expertise: "[\"Stress\"]", education: nil) unless coach_account.present?
      coach_account&.save(validate: false)
      return coach_account
    end


    def current_user
      company  = Company.find_by(id: 5)
      role = BxBlockRolesPermissions::Role.find_by(id: 1)
      role = BxBlockRolesPermissions::Role.create(id: 1, name: "employee") unless role.present?
      company = Company.create(id: 5, name: "newtata company", email: "newsexample12@gmail.com", address: "newDelhi12",hr_code: "A#{rand(100)}",employee_code:"b#{rand(100)}") unless company.present?
      current_user =  AccountBlock::Account.find_by(id: 1)
      current_user = AccountBlock::Account.create!(id: 1 ,full_name: "assess user",email:"assess@gmail.com",full_phone_number: "919098083863", password: "Admin@123",password_confirmation: "Admin@123", activated: true,access_code: company&.employee_code) unless current_user.present?
      return current_user
    end

    def get_token
      role = BxBlockRolesPermissions::Role.find_by(id: 1)
      role = BxBlockRolesPermissions::Role.create!(id: 1, name: "employee") unless role.present?
      company  = Company.find_by(id: 5)
      company = Company.create!(id: 5, name: "tata company", email: "newexample12@gmail.com", address: "newDelhi12",hr_code: "A#{rand(100)}",employee_code: "b#{rand(100)}") unless company.present?
      current_user =  AccountBlock::Account.find_by(id: 1)
      current_user = AccountBlock::Account.create!(id: 1 ,full_name: "assess user",email:"assess@gmail.com",full_phone_number: "919098083863", password: "Admin@12",password_confirmation: "Admin@12", activated: true,access_code: company&.employee_code) unless current_user.present?
      @token =  BuilderJsonWebToken.encode(current_user&.id)
     return @token
    end

    def create_data
      que = BxBlockAssessmenttest::AssessYourselfQuestion.find_by(id:1)
      ans = BxBlockAssessmenttest::AssessYourselfAnswer.find_by(id: 1)
      test_type = BxBlockAssessmenttest::AssessYourselfTestType.find_by(id: 1)
      # select_answer = BxBlockAssessmenttest::AssessSelectAnswer.find_by(id: 1)
      anxeity = BxBlockAssessmenttest::AnixetyCutoff.find_by(id: 1)
      assess_tt = BxBlockAssessmenttest::AssessTtAnswer.find_by(id: 1)
      que = BxBlockAssessmenttest::AssessYourselfQuestion.create!(id: 1, question_title: "Which test do you want to take?") unless que.present?
      ans = BxBlockAssessmenttest::AssessYourselfAnswer.create!(id: 1, assess_yourself_question_id: 1, answer_title: "nice") unless ans.present?
      test_type = BxBlockAssessmenttest::AssessYourselfTestType.create!(id: 1, question_title: "how are you", sequence_number: 1, assess_yourself_answer_id: 1) unless test_type.present?
      # select_answer = BxBlockAssessmenttest::AssessSelectAnswer.create!(id: 1, assess_yourself_test_type_id: 1, assess_tt_answer_id: 3, account_id: 2, assess_yourself_answer_id: 1, select_answer_status: true) unless select_answer.present?
      anxeity = BxBlockAssessmenttest::AnixetyCutoff.create!(id: 1, min_score: 1, max_score: 5, anixety_title: "low depress", category_id: 1,total_score: 3, result: true, color: 'red', ) unless anxeity.present?
      assess_tt = BxBlockAssessmenttest::AssessTtAnswer.create!(id: 1, answer: 1, answer_score: 3, assess_yourself_test_type_id: 1) unless assess_tt.present?
    end


    # def get_company
    #   Company.create(id: 1, name: "TCS", email: "tcs@gmail.com", address: "Pune")
    # end

    def create_question
      Support::SharedHelper.new.create_categories
      QuestionWellBeing.create!(id:1, question: "I tend to be influenced by people with strong opin...", category_id: 15, subcategory_id: 13) unless QuestionWellBeing.find_by_id(1)
    end

    def create_categories
      WellBeingCategory.create(id: 15, category_name: "good wellbeing") unless WellBeingCategory.find_by_id(15)
    end


    def get_company
      company = Company.find_by_id(5)
      company = Company.create(name: "tata company12", email: "newexample123@gmail.com", address: "newDelhi12", hr_code: "A0", employee_code: "b54", created_at: "2023-01-06 06:32:22", updated_at: "2023-01-06 06:32:22") unless company.present?
      return company
    end

    def action_item
      action_item = BxBlockAssessmenttest::ActionItem.find_or_create_by(id: 9, action_item: "my goal",date: "22/10/2022", is_complete: false,  account_id: current_user&.id, time_slot: "10:11 PM")
    end

    def get_availability
      account = current_user
      availability = BxBlockAppointmentManagement::Availability.new(id: 178, start_time: "06:00", end_time: "23:00", availability_date: Date.today.strftime(STRFTIME_FORMAT),       service_provider_id: account.id, unavailable_start_time: '23:05',unavailable_end_time: '05:55')
      availability.save(validate: false)
      return availability
    end
    def create_coach_account
      coach_account = AccountBlock::Account.find_by(id: 300)
      coach_account = AccountBlock::Account.new(id: 300, first_name: nil, last_name: nil, full_phone_number: "917907617765", country_code: 91, phone_number: 7901817765, email: "coach17@gmail.com", activated: true, device_id: nil, unique_auth_id: nil, password_digest: PDIGEST, type: "EmailAccount", created_at: CREATED_AT, updated_at: UPDATED_AT, user_name: nil, platform: nil, user_type: nil, app_language_id: nil, last_visit_at: nil, is_blacklisted: false, suspend_until: nil, status: "regular", stripe_id: nil, stripe_subscription_id: nil, stripe_subscription_date: nil, role_id: 2, full_name: "coach2222", gender: nil, date_of_birth: nil, age: nil, is_paid: false, access_code: nil, rating: nil, city: nil, education: nil) unless coach_account.present?
      coach_account&.save(validate: false)
      coach_account.update(expertise: ['testing'])
      return coach_account
    end

    def view_coach_availability
      (Date.today..6.months.from_now).each do |date|
        begin
          BxBlockAppointmentManagement::Availability.create!(start_time: "06:00", end_time: "23:00", availability_date: date.strftime(STRFTIME_FORMAT), service_provider_id: (Support::SharedHelper.new.create_coach_account).id )
        rescue => exception
          next
        end
      end
      return BxBlockAppointmentManagement::Availability.where(service_provider_id: (Support::SharedHelper.new.create_coach_account).id)
    end

    def focus_area
      BxBlockAssessmenttest::AssesmentTestQuestion.where(id: 1).last ? BxBlockAssessmenttest::AssesmentTestQuestion.where(id: 1).last : BxBlockAssessmenttest::AssesmentTestQuestion.create(id: 1,title: "stress", sequence_number: 1234)

      BxBlockAssessmenttest::AssesmentTestAnswer.where(id: 1).last ? BxBlockAssessmenttest::AssesmentTestAnswer.where(id: 1).last : BxBlockAssessmenttest::AssesmentTestAnswer.create(id: 1,assesment_test_question_id: 1 , answers: "i am too good", title: "stress")

      BxBlockAssessmenttest::AssesmentTestType.where(id: 1).last ? BxBlockAssessmenttest::AssesmentTestType.where(id: 1).last : BxBlockAssessmenttest::AssesmentTestType.create(id: 1, question_title: "less stress", test_type: "multiple selecting answers",sequence_number: "1", assesment_test_answer_id: 1)

      BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: 1).last ? BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: 1).last : BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_or_create_by(id: 1 ,assesment_test_type_id: 1, title: "test", answers: "test", test_type_id: 1)
      obj = AccountBlock::Account.first.id
      BxBlockAssessmenttest::StoringFocusArea.where(id: 1).last ? BxBlockAssessmenttest::StoringFocusArea.where(id: 1).last : BxBlockAssessmenttest::StoringFocusArea.find_or_create_by(id: 1,account_id: obj, focus_areas_id:[1])

      # BxBlockAssessmenttest::SelectAnswer::where(id: 1).last ? BxBlockAssessmenttest::SelectAnswer::where(id: 1).last : BxBlockAssessmenttest::SelectAnswer.create(assesment_test_type_id: 1, assesment_test_type_answer_ids: [1], account_id: 1, multiple_answers: [1])
      focus_area =  BxBlockAssessmenttest::StoringFocusArea.last.id
     
      return focus_area
    end

    def get_chat
      chat = BxBlockChat::Chat.find_by(id: 1)
      chat = BxBlockChat::Chat.create(id: 1, name: "This is the DemoChat", chat_type: 2, is_notification_mute: true) unless chat.present?
      return chat
    end

    def account_chat_block
      account = AccountBlock::Account.find_by(id: 6)
      chat = BxBlockChat::Chat.find_by(id: 1)
      account_chat = BxBlockChat::AccountsChatsBlock.find_by(id: 1)
      account_chat = BxBlockChat::AccountsChatsBlock.create(id: 1, account_id: account.id, chat_id: chat.id, status: "active") unless account_chat.present?
      return account_chat
    end

    def booked_slot
      account =  current_user
      slot = BxBlockAppointmentManagement::BookedSlot.new(start_time: "06:00" , end_time: "06:59", service_provider_id: account.id, booking_date: Date.today.strftime(STRFTIME_FORMAT),  service_user_id: account.id, meeting_code: "as12s3")
      slot.save(validate: false)
      return slot
    end

    def sharecalendar_booked_slot
      account =  current_user
      slot = BxBlockSharecalendar::BookedSlot.new(start_time: "06:00" , end_time: "06:59", service_provider_id: account.id, booking_date: Date.today.strftime(STRFTIME_FORMAT),  service_user_id: account.id, meeting_code: "as12s3")
      slot.save(validate: false)
      return slot
    end
    
    def create_wellbeing
      category = WellBeingCategory.where(id: 2).last ? WellBeingCategory.where(id: 2).last : WellBeingCategory.create(id: 2, category_name: "Physical")
      sub_category = WellBeingSubCategory.where(id: 2).last ? WellBeingSubCategory.where(id: 2).last : WellBeingSubCategory.create(id: 2, sub_category_name: "Nutrition", well_being_category_id: 2)
      # Removed the unused focus_area variable
      question_wb = QuestionWellBeing.where(id: 2).last ? QuestionWellBeing.where(id: 2).last : QuestionWellBeing.create(id: 2, question: "how are you?", category_id: category.id, subcategory_id: sub_category.id)
      answer_wb = AnswerWellBeing.where(id: 2).last ? AnswerWellBeing.where(id: 2).last : AnswerWellBeing.create(id: 2, answer: "fine", score: "10", question_well_being_id: question_wb.id)
      UserQuestionAnswer.where(id: 2).last ? UserQuestionAnswer.where(id: 2).last : UserQuestionAnswer.create(id: 2, question_id: question_wb.id, answer_id: answer_wb.id, account_id: current_user.id)
      UserAnswerResult.where(id: 2).last ? UserAnswerResult.where(id: 2).last : UserAnswerResult.create(id: 2, category_id: category.id, subcategory_id: sub_category.id, advice: "Nothing", min_score: 5, max_score: 100)
    end
    

    def create_audio_list
      shared_helper = Support::SharedHelper.new
      shared_helper.create_wellbeing
    
      create_assessment_test_question
      create_assessment_test_answer
      create_assessment_test_type
      create_assessment_test_type_answer
      create_select_answer
    
      create_multiple_upload_file(2)
      create_multiple_upload_file(3)
      create_multiple_upload_file(4)
    
      create_top_focus_area
    
      create_file_type(2)
      create_file_type(3)
      create_file_type(4)
    end

    def create_booked_slot
      BxBlockAppointmentManagement::Availability.where(id: 20).last ? BxBlockAppointmentManagement::Availability.where(id: 20).last : BxBlockAppointmentManagement::Availability.create(id: 20, service_provider_id:300, start_time: "06:00 AM", end_time: "11:00 PM", unavailable_start_time: nil, unavailable_end_time: nil, availability_date: "10/10/2023", created_at: "2023-01-03 11:45:04", updated_at: "2023-01-03 11:45:04", timeslots: [{"to"=>"06:59 AM", "sno"=>"1", "from"=>"06:00 AM", "booked_status"=>false}, {"to"=>"07:59 AM", "sno"=>"2", "from"=>"07:00 AM", "booked_status"=>false}, {"to"=>"08:59 AM", "sno"=>"3", "from"=>"08:00 AM", "booked_status"=>false}, {"to"=>"09:59 AM", "sno"=>"4", "from"=>"09:00 AM", "booked_status"=>false}, {"to"=>"10:59 AM", "sno"=>"5", "from"=>"10:00 AM", "booked_status"=>false}, {"to"=>"11:59 AM", "sno"=>"6", "from"=>"11:00 AM", "booked_status"=>false}, {"to"=>"12:59 PM", "sno"=>"7", "from"=>"12:00 PM", "booked_status"=>false}, {"to"=>"01:59 PM", "sno"=>"8", "from"=>"01:00 PM", "booked_status"=>false}, {"to"=>"02:59 PM", "sno"=>"9", "from"=>"02:00 PM", "booked_status"=>false}, {"to"=>"03:59 PM", "sno"=>"10", "from"=>"03:00 PM", "booked_status"=>false}, {"to"=>"04:59 PM", "sno"=>"11", "from"=>"04:00 PM", "booked_status"=>false}, {"to"=>"05:59 PM", "sno"=>"12", "from"=>"05:00 PM", "booked_status"=>false}, {"to"=>"06:59 PM", "sno"=>"13", "from"=>"06:00 PM", "booked_status"=>false}, {"to"=>"07:59 PM", "sno"=>"14", "from"=>"07:00 PM", "booked_status"=>false}, {"to"=>"08:59 PM", "sno"=>"15", "from"=>"08:00 PM", "booked_status"=>false}, {"to"=>"09:59 PM", "sno"=>"16", "from"=>"09:00 PM", "booked_status"=>false}, {"to"=>"10:59 PM", "sno"=>"17", "from"=>"10:00 PM", "booked_status"=>false}, {"to"=>"11:59 PM", "sno"=>"18", "from"=>"11:00 PM", "booked_status"=>false}], available_slots_count: 18)



      BxBlockAppointmentManagement::BookedSlot.where(id: 197).last ? BxBlockAppointmentManagement::BookedSlot.where(id: 197).last : BxBlockAppointmentManagement::BookedSlot.new(id: 197, start_time: "10/10/2023 10:00", end_time: "10/10/2023 10:59", service_provider_id: get_coach_user.id, service_user_id: 2, booking_date: "10/10/2023", meeting_code: "jsdl").save(validate: false)
    end

    def past_booked_slot
      BxBlockAppointmentManagement::Availability.where(id: 40).last ? BxBlockAppointmentManagement::Availability.where(id: 40).last : BxBlockAppointmentManagement::Availability.create(id: 40, service_provider_id:300, start_time: "06:00 AM", end_time: "11:00 PM", unavailable_start_time: nil, unavailable_end_time: nil, availability_date: "10/10/2022", created_at: "2023-01-03 11:45:04", updated_at: "2023-01-03 11:45:04", timeslots: [{"to"=>"06:59 AM", "sno"=>"1", "from"=>"06:00 AM", "booked_status"=>false}, {"to"=>"07:59 AM", "sno"=>"2", "from"=>"07:00 AM", "booked_status"=>false}, {"to"=>"08:59 AM", "sno"=>"3", "from"=>"08:00 AM", "booked_status"=>false}, {"to"=>"09:59 AM", "sno"=>"4", "from"=>"09:00 AM", "booked_status"=>false}, {"to"=>"10:59 AM", "sno"=>"5", "from"=>"10:00 AM", "booked_status"=>false}, {"to"=>"11:59 AM", "sno"=>"6", "from"=>"11:00 AM", "booked_status"=>false}, {"to"=>"12:59 PM", "sno"=>"7", "from"=>"12:00 PM", "booked_status"=>false}, {"to"=>"01:59 PM", "sno"=>"8", "from"=>"01:00 PM", "booked_status"=>false}, {"to"=>"02:59 PM", "sno"=>"9", "from"=>"02:00 PM", "booked_status"=>false}, {"to"=>"03:59 PM", "sno"=>"10", "from"=>"03:00 PM", "booked_status"=>false}, {"to"=>"04:59 PM", "sno"=>"11", "from"=>"04:00 PM", "booked_status"=>false}, {"to"=>"05:59 PM", "sno"=>"12", "from"=>"05:00 PM", "booked_status"=>false}, {"to"=>"06:59 PM", "sno"=>"13", "from"=>"06:00 PM", "booked_status"=>false}, {"to"=>"07:59 PM", "sno"=>"14", "from"=>"07:00 PM", "booked_status"=>false}, {"to"=>"08:59 PM", "sno"=>"15", "from"=>"08:00 PM", "booked_status"=>false}, {"to"=>"09:59 PM", "sno"=>"16", "from"=>"09:00 PM", "booked_status"=>false}, {"to"=>"10:59 PM", "sno"=>"17", "from"=>"10:00 PM", "booked_status"=>false}, {"to"=>"11:59 PM", "sno"=>"18", "from"=>"11:00 PM", "booked_status"=>false}], available_slots_count: 18)

      

      BxBlockAppointmentManagement::BookedSlot.where(id: 21).last ? BxBlockAppointmentManagement::BookedSlot.where(id: 21).last : BxBlockAppointmentManagement::BookedSlot.new(id: 21, start_time: "10/10/2022 10:00", end_time: "10/10/2022 10:59", service_provider_id: get_coach_user.id, service_user_id: 2, booking_date: "10/10/2022", meeting_code: "jsdl").save(validate: false)
    end

    def create_goal
      BxBlockAssessmenttest::AssesmentTestQuestion.where(id: 1).last ? BxBlockAssessmenttest::AssesmentTestQuestion.where(id: 1).last : BxBlockAssessmenttest::AssesmentTestQuestion.create(id: 1,title: "stress1", sequence_number: 1234)

      BxBlockAssessmenttest::AssesmentTestAnswer.where(id: 1).last ? BxBlockAssessmenttest::AssesmentTestAnswer.where(id: 1).last : BxBlockAssessmenttest::AssesmentTestAnswer.create(id: 1,assesment_test_question_id: 1 , answers: "i am good", title: "stress2")

      BxBlockAssessmenttest::AssesmentTestType.where(id: 1).last ? BxBlockAssessmenttest::AssesmentTestType.where(id: 1).last : BxBlockAssessmenttest::AssesmentTestType.create(id: 1, question_title: "about less-stress", test_type: "multiple selection answers",sequence_number: "1", assesment_test_answer_id: 1)

      BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: 1).last ? BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: 1).last : BxBlockAssessmenttest::AssesmentTestTypeAnswer.create(assesment_test_type_id: 1, title: "test", answers: "test", test_type_id: 1)

      # BxBlockAssessmenttest::SelectAnswer::where(id: 1).last ? BxBlockAssessmenttest::SelectAnswer::where(id: 1).last : BxBlockAssessmenttest::SelectAnswer.create(assesment_test_type_id: 1, assesment_test_type_answer_ids: [1], account_id: 1, multiple_answers: [1])
      focus_area = BxBlockAssessmenttest::AssesmentTestTypeAnswer.last.id
      
      goal = BxBlockAssessmenttest::Goal.create(goal: "i added goal", date: "2022-10-06", account_id: current_user&.id, time_slot: "03:15 PM", is_complete: false ,focus_area_id: focus_area )   
    return goal
    end
    private

    TIMESTAMP = "2023-01-10 07:54:27"

    def create_assessment_test_question
      BxBlockAssessmenttest::AssesmentTestQuestion.find_or_create_by(id: 1, title: "stress", sequence_number: 1234)
    end
    
    def create_assessment_test_answer
      BxBlockAssessmenttest::AssesmentTestAnswer.find_or_create_by(id: 1, assesment_test_question_id: 1, answers: "good", title: "stress")
    end
    
    def create_assessment_test_type
      BxBlockAssessmenttest::AssesmentTestType.find_or_create_by(id: 1, question_title: "low stressed", test_type: "multipl selected answerss", sequence_number: "1", assesment_test_answer_id: 1)
    end
    
    def create_assessment_test_type_answer
      BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_or_create_by(assesment_test_type_id: 1, title: "test", answers: "test", test_type_id: 1)
    end
    
    def create_select_answer
      BxBlockAssessmenttest::SelectAnswer.find_or_create_by(id: 1, assesment_test_type_id: 1, assesment_test_type_answer_ids: [1], account_id: 1, multiple_answers: [1])
    end
    
    def create_multiple_upload_file(id)
      BxBlockUpload::MultipleUploadFile.find_or_create_by(id: id, choose_file: id - 2)
    end
    
    def create_top_focus_area
      TopfocusArea.find_or_create_by(account_id: 1, select_focus_area_id: [1], wellbeingfocus_id: [122])
    end
    
    def create_file_type(id)
      BxBlockUpload::FileType.find_or_create_by(
        id: id,
        file_name: "hjklj",
        file_discription: "hkh",
        assesment_test_type_answer_id: 1,
        multiple_upload_file_id: id,
        created_at: TIMESTAMP,
        updated_at: TIMESTAMP,
        focus_areas: ["1"],
        file_content: "hk"
      )
    end
  end
end