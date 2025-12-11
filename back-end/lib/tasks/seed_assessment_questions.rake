namespace :app do
  desc "Seed assessment test questions and answers"
  task seed_assessment_questions: :environment do
    puts "=" * 60
    puts "Seeding Assessment Test Questions and Answers..."
    puts "=" * 60

    # Question 1: Personal Life
    puts "\n📝 Creating Question 1: Personal Life..."
    q1 = BxBlockAssessmenttest::AssesmentTestQuestion.find_or_create_by!(
      sequence_number: 1
    ) do |q|
      q.title = "In Personal Life what do you want to talk about?"
    end
    puts "✓ Question 1 ID: #{q1.id}"

    # Answers for Question 1
    puts "  Adding answers for Question 1..."
    answers_q1 = [
      "Stress Management",
      "Relationship Issues", 
      "Self-Confidence",
      "Life Balance",
      "Personal Growth"
    ]

    answers_q1.each do |answer_text|
      BxBlockAssessmenttest::AssesmentTestAnswer.find_or_create_by!(
        assesment_test_question_id: q1.id,
        answers: answer_text
      ) do |a|
        a.title = answer_text
      end
      puts "    ✓ #{answer_text}"
    end

    # Question 2: Professional Life
    puts "\n📝 Creating Question 2: Professional Life..."
    q2 = BxBlockAssessmenttest::AssesmentTestQuestion.find_or_create_by!(
      sequence_number: 2
    ) do |q|
      q.title = "My Professional Life"
    end
    puts "✓ Question 2 ID: #{q2.id}"

    # Answers for Question 2
    puts "  Adding answers for Question 2..."
    answers_q2 = [
      "Work-Life Balance",
      "Career Development",
      "Conflict Resolution",
      "Leadership Skills",
      "Job Satisfaction"
    ]

    answers_q2.each do |answer_text|
      BxBlockAssessmenttest::AssesmentTestAnswer.find_or_create_by!(
        assesment_test_question_id: q2.id,
        answers: answer_text
      ) do |a|
        a.title = answer_text
      end
      puts "    ✓ #{answer_text}"
    end

    # Summary
    puts "\n" + "=" * 60
    puts "✅ Seeding Complete!"
    puts "=" * 60
    puts "Total Questions: #{BxBlockAssessmenttest::AssesmentTestQuestion.count}"
    puts "Total Answers: #{BxBlockAssessmenttest::AssesmentTestAnswer.count}"
    puts ""
    
    # Show what was created
    puts "Questions created:"
    BxBlockAssessmenttest::AssesmentTestQuestion.order(:sequence_number).each do |q|
      answer_count = BxBlockAssessmenttest::AssesmentTestAnswer.where(assesment_test_question_id: q.id).count
      puts "  #{q.sequence_number}. #{q.title} (#{answer_count} answers)"
    end
    puts "=" * 60
  end

  desc "Remove all assessment test questions and answers (CAREFUL!)"
  task clear_assessment_questions: :environment do
    puts "⚠️  Clearing all assessment questions and answers..."
    
    deleted_answers = BxBlockAssessmenttest::AssesmentTestAnswer.delete_all
    deleted_questions = BxBlockAssessmenttest::AssesmentTestQuestion.delete_all
    
    puts "✓ Deleted #{deleted_answers} answers"
    puts "✓ Deleted #{deleted_questions} questions"
  end

  desc "Reset and reseed assessment questions (clear + seed)"
  task reset_assessment_questions: :environment do
    Rake::Task['app:clear_assessment_questions'].invoke
    Rake::Task['app:seed_assessment_questions'].invoke
  end
end





