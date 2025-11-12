module BxBlockAddress
  class ChooseAnswerSerializer 
    include JSONAPI::Serializer
    attributes *[
      :account_id]

    attributes :assesment_test_question do |object|
      BxBlockAssessmenttest::AssesmentTestQuestion.find_by(id: object&.assesment_test_question_id)
    end
    attributes :assesment_test_answer do |object|
      BxBlockAssessmenttest::AssesmentTestAnswer.find_by(id: object&.assesment_test_answer_id)
    end

    attributes :upcoming_question do |object|
      BxBlockAssessmenttest::AssesmentTestType.find_by(assesment_test_answer_id: object&.assesment_test_answer_id)
    end

    attributes :upcoming_answers do |object|
      @assesment = BxBlockAssessmenttest::AssesmentTestType.find_by(assesment_test_answer_id: object&.assesment_test_answer_id)
      @assesment&.assesment_test_type_answers
    end

   
  
  end
end
