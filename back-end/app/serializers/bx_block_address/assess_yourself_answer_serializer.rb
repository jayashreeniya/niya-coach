module BxBlockAddress
  class AssessYourselfAnswerSerializer 
    include JSONAPI::Serializer

    attributes :question do |object|
      object&.question_title
    end

    attributes :answers do |object|
      object&.assess_yourself_answers if object.present?
    end
  
  end
end
