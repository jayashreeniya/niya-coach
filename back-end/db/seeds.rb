# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

AdminUser.find_by_email('admin@example.com').destroy if AdminUser.find_by_email('admin@example.com')

unless AdminUser.find_by_email('nidhil@niya.app')
  AdminUser.create(email: 'nidhil@niya.app', password: "Niya@7k2TuY", password_confirmation: 'Niya@7k2TuY')
end

BxBlockRolesPermissions::Role.find_or_create_by(id: 1, name: "admin")
BxBlockRolesPermissions::Role.find_or_create_by(id: 2, name: "hr")
BxBlockRolesPermissions::Role.find_or_create_by(id: 3, name: "employee")
BxBlockRolesPermissions::Role.find_or_create_by(id: 4, name: "coach")

BxBlockAssessmenttest::Motion.find_or_create_by(motion_title: 'great')
BxBlockAssessmenttest::Motion.find_or_create_by(motion_title: 'good')
BxBlockAssessmenttest::Motion.find_or_create_by(motion_title: 'okayish')
BxBlockAssessmenttest::Motion.find_or_create_by(motion_title: 'bad')
BxBlockAssessmenttest::Motion.find_or_create_by(motion_title: 'terrible')




BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Nutritional Health", well_being_sub_categoryid: "1")  
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Balancing Energy", well_being_sub_categoryid: "2")  
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Physical Activity and Exercise", well_being_sub_categoryid: "3")  
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Maintaining Individuality", well_being_sub_categoryid: "4") 

BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Personal Growth", well_being_sub_categoryid: "5")  
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Inner Energy ", well_being_sub_categoryid: "6")  
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Positive Thinking", well_being_sub_categoryid: "7") 
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Sleep Concerns", well_being_sub_categoryid: "8")  

BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Emotional regulation", well_being_sub_categoryid: "9") 
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Adaptability", well_being_sub_categoryid: "10") 
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Interpersonal Relationships", well_being_sub_categoryid: "11")  
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Goal Setting", well_being_sub_categoryid: "12")  


BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Self Acceptance", well_being_sub_categoryid: "13")  
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Professional Development", well_being_sub_categoryid: "14")
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Managing work load", well_being_sub_categoryid: "15")
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Time Management, Emotional Regulation", well_being_sub_categoryid: "16")  

BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Goal Setting , Assertiveness", well_being_sub_categoryid: "17")
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Interpersonal Relationships", well_being_sub_categoryid: "18") 
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Assertiveness, Integrity", well_being_sub_categoryid: "19") 
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Goal Setting", well_being_sub_categoryid: "20") 
BxBlockAssessmenttest::WellBeingFocusArea.find_or_create_by(answers: "Financial Planning", well_being_sub_categoryid: "21")

# Seed default lookup tables via builder services (idempotent)
begin
  puts "Seeding default languages..."
  BxBlockLanguageOptions::BuildLanguages.call
rescue => e
  puts "Languages seed error: #{e.message}"
end

begin
  puts "Seeding default content types..."
  BxBlockContentManagement::BuildContentType.call
rescue => e
  puts "Content types seed error: #{e.message}"
end

begin
  puts "Seeding default categories/subcategories..."
  BxBlockCategories::BuildCategories.call
rescue => e
  puts "Categories seed error: #{e.message}"
end

# Seed Assessment Test Questions and Answers
puts "Seeding assessment test questions..."

# Question 1: Personal Life
q1 = BxBlockAssessmenttest::AssesmentTestQuestion.find_or_create_by!(sequence_number: 1) do |q|
  q.title = "In Personal Life what do you want to talk about?"
end

["Stress Management", "Relationship Issues", "Self-Confidence", "Life Balance", "Personal Growth"].each do |answer_text|
  BxBlockAssessmenttest::AssesmentTestAnswer.find_or_create_by!(
    assesment_test_question_id: q1.id,
    answers: answer_text
  ) do |a|
    a.title = answer_text
  end
end

# Question 2: Professional Life
q2 = BxBlockAssessmenttest::AssesmentTestQuestion.find_or_create_by!(sequence_number: 2) do |q|
  q.title = "My Professional Life"
end

["Work-Life Balance", "Career Development", "Conflict Resolution", "Leadership Skills", "Job Satisfaction"].each do |answer_text|
  BxBlockAssessmenttest::AssesmentTestAnswer.find_or_create_by!(
    assesment_test_question_id: q2.id,
    answers: answer_text
  ) do |a|
    a.title = answer_text
  end
end

puts "✓ Assessment questions seeded: #{BxBlockAssessmenttest::AssesmentTestQuestion.count} questions, #{BxBlockAssessmenttest::AssesmentTestAnswer.count} answers"