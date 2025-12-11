namespace :app do
  desc "Seed complete assessment flow - Questions 1, 2, and 3 with all answers"
  task seed_complete_assessment: :environment do
    puts "=" * 80
    puts "🌱 SEEDING COMPLETE ASSESSMENT FLOW"
    puts "=" * 80

    # ============================================================
    # PART 1: Questions 1 & 2 (assesment_test_questions)
    # ============================================================
    
    puts "\n📝 Part 1: Creating Questions 1 & 2..."
    
    # Question 1
    q1 = BxBlockAssessmenttest::AssesmentTestQuestion.find_or_initialize_by(sequence_number: 1)
    q1.title = "In Personal Life what do you want to talk about?"
    q1.save!
    puts "✓ Question 1: #{q1.title} (ID: #{q1.id})"

    # Question 1 Answers
    answers_q1 = [
      "Stress Management",
      "Relationship Issues",
      "Self-Confidence",
      "Life Balance",
      "Personal Growth"
    ]
    
    answers_q1.each do |answer_text|
      a = BxBlockAssessmenttest::AssesmentTestAnswer.find_or_initialize_by(
        assesment_test_question_id: q1.id,
        answers: answer_text
      )
      a.title = answer_text
      a.save!
      puts "  ✓ #{answer_text}"
    end

    # Question 2
    q2 = BxBlockAssessmenttest::AssesmentTestQuestion.find_or_initialize_by(sequence_number: 2)
    q2.title = "My Professional Life"
    q2.save!
    puts "\n✓ Question 2: #{q2.title} (ID: #{q2.id})"

    # Question 2 Answers - Store IDs for linking to Question 3
    answers_q2 = {
      "Work-Life Balance" => nil,
      "Career Development" => nil,
      "Conflict Resolution" => nil,
      "Leadership Skills" => nil,
      "Job Satisfaction" => nil
    }
    
    answers_q2.each_key do |answer_text|
      a = BxBlockAssessmenttest::AssesmentTestAnswer.find_or_initialize_by(
        assesment_test_question_id: q2.id,
        answers: answer_text
      )
      a.title = answer_text
      a.save!
      answers_q2[answer_text] = a.id  # Store ID for linking
      puts "  ✓ #{answer_text} (ID: #{a.id})"
    end

    # ============================================================
    # PART 2: Question 3 variants (assesment_test_types)
    # ============================================================
    
    puts "\n📝 Part 2: Creating Question 3 variants (linked to Q2 answers)..."
    
    # Question 3 for "Work-Life Balance"
    if answers_q2["Work-Life Balance"]
      q3_wlb = BxBlockAssessmenttest::AssesmentTestType.find_or_initialize_by(
        assesment_test_answer_id: answers_q2["Work-Life Balance"]
      )
      q3_wlb.question_title = "What would you like to talk about today?"
      q3_wlb.save!
      puts "\n✓ Question 3 (Work-Life Balance path) - ID: #{q3_wlb.id}"

      ["Time Management", "Setting Boundaries", "Prioritization", "Energy Management", "Self-Care"].each do |answer|
        a = BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_or_initialize_by(
          assesment_test_type_id: q3_wlb.id,
          answers: answer
        )
        a.save!
        puts "  ✓ #{answer}"
      end
    end

    # Question 3 for "Career Development"
    if answers_q2["Career Development"]
      q3_career = BxBlockAssessmenttest::AssesmentTestType.find_or_initialize_by(
        assesment_test_answer_id: answers_q2["Career Development"]
      )
      q3_career.question_title = "What would you like to talk about today?"
      q3_career.save!
      puts "\n✓ Question 3 (Career Development path) - ID: #{q3_career.id}"

      ["Career Goals", "Skill Development", "Career Transition", "Professional Growth", "Networking"].each do |answer|
        a = BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_or_initialize_by(
          assesment_test_type_id: q3_career.id,
          answers: answer
        )
        a.save!
        puts "  ✓ #{answer}"
      end
    end

    # Question 3 for "Conflict Resolution"
    if answers_q2["Conflict Resolution"]
      q3_conflict = BxBlockAssessmenttest::AssesmentTestType.find_or_initialize_by(
        assesment_test_answer_id: answers_q2["Conflict Resolution"]
      )
      q3_conflict.question_title = "What would you like to talk about today?"
      q3_conflict.save!
      puts "\n✓ Question 3 (Conflict Resolution path) - ID: #{q3_conflict.id}"

      ["Team Dynamics", "Communication Skills", "Difficult Conversations", "Negotiation", "Emotional Intelligence"].each do |answer|
        a = BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_or_initialize_by(
          assesment_test_type_id: q3_conflict.id,
          answers: answer
        )
        a.save!
        puts "  ✓ #{answer}"
      end
    end

    # Question 3 for "Leadership Skills"
    if answers_q2["Leadership Skills"]
      q3_leadership = BxBlockAssessmenttest::AssesmentTestType.find_or_initialize_by(
        assesment_test_answer_id: answers_q2["Leadership Skills"]
      )
      q3_leadership.question_title = "What would you like to talk about today?"
      q3_leadership.save!
      puts "\n✓ Question 3 (Leadership Skills path) - ID: #{q3_leadership.id}"

      ["Leadership Style", "Team Management", "Decision Making", "Motivating Others", "Strategic Thinking"].each do |answer|
        a = BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_or_initialize_by(
          assesment_test_type_id: q3_leadership.id,
          answers: answer
        )
        a.save!
        puts "  ✓ #{answer}"
      end
    end

    # Question 3 for "Job Satisfaction"
    if answers_q2["Job Satisfaction"]
      q3_satisfaction = BxBlockAssessmenttest::AssesmentTestType.find_or_initialize_by(
        assesment_test_answer_id: answers_q2["Job Satisfaction"]
      )
      q3_satisfaction.question_title = "What would you like to talk about today?"
      q3_satisfaction.save!
      puts "\n✓ Question 3 (Job Satisfaction path) - ID: #{q3_satisfaction.id}"

      ["Finding Purpose", "Work Environment", "Recognition", "Job Security", "Growth Opportunities"].each do |answer|
        a = BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_or_initialize_by(
          assesment_test_type_id: q3_satisfaction.id,
          answers: answer
        )
        a.save!
        puts "  ✓ #{answer}"
      end
    end

    # ============================================================
    # SUMMARY
    # ============================================================
    puts "\n" + "=" * 80
    puts "✅ SEEDING COMPLETE!"
    puts "=" * 80
    puts "Questions 1-2: #{BxBlockAssessmenttest::AssesmentTestQuestion.count}"
    puts "Answers for Q1-2: #{BxBlockAssessmenttest::AssesmentTestAnswer.where(assesment_test_question_id: [q1.id, q2.id]).count}"
    puts "Question 3 variants: #{BxBlockAssessmenttest::AssesmentTestType.count}"
    puts "Answers for Q3: #{BxBlockAssessmenttest::AssesmentTestTypeAnswer.count}"
    puts "=" * 80
  end

  desc "Clear all assessment data (CAREFUL!)"
  task clear_all_assessment: :environment do
    puts "⚠️  Clearing ALL assessment data..."
    BxBlockAssessmenttest::AssesmentTestTypeAnswer.delete_all
    BxBlockAssessmenttest::AssesmentTestType.delete_all
    BxBlockAssessmenttest::AssesmentTestAnswer.delete_all
    BxBlockAssessmenttest::AssesmentTestQuestion.delete_all
    puts "✓ All assessment data cleared"
  end
end





