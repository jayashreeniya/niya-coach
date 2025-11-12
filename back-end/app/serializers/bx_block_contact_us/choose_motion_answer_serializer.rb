module BxBlockContactUs
  class ChooseMotionAnswerSerializer < BaseSerializer
    include JSONAPI::Serializer
    
    attributes *[
      :account_id
    ]

     attribute :question do |object|
     object&.motion_question_id
    end 

    attribute :answer do |object|
      object&.motion_answer_id
    end 
  end
end
