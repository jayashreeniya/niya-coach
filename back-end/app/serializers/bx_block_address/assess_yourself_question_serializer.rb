module BxBlockAddress
  class AssessYourselfQuestionSerializer 
    include JSONAPI::Serializer

    attributes *[
      :question_title
      
    ]

    attributes :answers do |object|
      object&.assess_yourself_answers if object.present?
    end
  end
end
