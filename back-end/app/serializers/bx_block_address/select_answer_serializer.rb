module BxBlockAddress
  class SelectAnswerSerializer 
    include JSONAPI::Serializer

    attributes :assesment_test_type do |object|
      BxBlockAssessmenttest::AssesmentTestType.find_by(id: object&.assesment_test_type_id) if object&.assesment_test_type_id.present?
    end

    attributes :assesment_test_type_answers do |object|
      BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: object&.multiple_answers.flatten) if object&.multiple_answers.present?
    end
  
  end
end
