module BxBlockAddress
  class AssessYourselfChooseAnswerSerializer 
    include JSONAPI::Serializer

    attributes :assess_yourself_question do |object|
      BxBlockAssessmenttest::AssessYourselfQuestion.find_by(id: object&.assess_yourself_question_id) if object&.assess_yourself_question_id.present?
    end

    attributes :assess_yourself_answer do |object|
      BxBlockAssessmenttest::AssessYourselfAnswer.find_by(id: object&.assess_yourself_answer_id) if object&.assess_yourself_answer_id.present?
    end

     attributes :total_score do |object,params|
      total_s = []
      tt_s = BxBlockAssessmenttest::TotalScoreOfAssess.where(account_id: params[:account_id])
      tt_score = tt_s.where(mood_id: params[:mood_id])  if tt_s.present?
      if tt_score.present?
        sum = tt_score&.last&.total_score.to_i
        BxBlockAssessmenttest::AnixetyCutoff.where(category_id: params[:mood_id]).each do |i_i|
              grade = sum.between?(i_i.min_score, i_i.max_score)
              i_i.update(total_score: sum)
              if grade
                total_s << i_i
              end
            end
            total_s
      else 
        []
      end  
    end


    attributes :upcoming_questions_and_answers do |object|
      answer = []
       BxBlockAssessmenttest::AssessYourselfAnswer.find_by(id: object.assess_yourself_answer_id).assess_yourself_test_types.each do |ans|
         answer<<  {queston: ans, answer: ans.assess_tt_answers}
       end  
       answer
    end
  end
end
