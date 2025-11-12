module BxBlockAddress
  class AssesmentTestAnswerSerializer 
    include JSONAPI::Serializer

    attributes :question do |object|
      object&.title
    end

    attributes :answers do |object|
      object&.assesment_test_answers if object.present?
    end
  
  end
end
