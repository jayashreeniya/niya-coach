module BxBlockContactUs
  class SelectMotionSerializer < BaseSerializer

    attribute :select_date do |object |
      object&.motion_select_date
    end


    attribute :motion do |object|
     BxBlockAssessmenttest::Motion.find_by(id: object&.motion_id) if object&.motion_id.present? 
    end 

    attribute :account do |object|
     AccountBlock::Account.find_by(id: object&.account_id)
    end 

    attribute :motion_question_answer do |object|
      if object.motion_id.present?
        arr= []
        count = 0
        BxBlockAssessmenttest::MotionQuestion.where(motion_id: object&.motion_id).each do |que|
         count = count+1
         arr << {"question_#{count}": que, answers: que.motion_answers}
        end  
      end
      arr 
    end 
  end
end

