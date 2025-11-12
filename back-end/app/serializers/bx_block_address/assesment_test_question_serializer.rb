module BxBlockAddress
  class AssesmentTestQuestionSerializer 
    include JSONAPI::Serializer

    attributes *[
      :title,
      :sequence_number
    ]

    attributes :answers do |object|
      object&.assesment_test_answers if object.present?
    end
  end
end
