FactoryBot.define do
  factory :bx_block_assessmenttest_question, class: 'BxBlockAssessmenttest::AssesmentTestQuestion' do
    title { 'testing' }
  end

  factory :bx_block_assessmenttest_answer, class: 'BxBlockAssessmenttest::AssesmentTestAnswer' do
    association :assesment_test_question, factory: :bx_block_assessmenttest_question
    answers { 'tesing' }
    title { 'testing' }
  end

  factory :bx_block_assessmenttest_type, class: 'BxBlockAssessmenttest::AssesmentTestType' do
    association :assesment_test_answer, factory: :bx_block_assessmenttest_answer
    question_title { 'testing' }
    test_type { nil }
    sequence_number { nil }
  end

  factory :bx_block_assessmenttest_type_answer, class: 'BxBlockAssessmenttest::AssesmentTestTypeAnswer' do
    association :assesment_test_type, factory: :bx_block_assessmenttest_type
    title { nil }
    answers { 'testing' }
    test_type_id { nil }
  end
end