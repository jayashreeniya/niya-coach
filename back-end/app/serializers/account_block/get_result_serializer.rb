module AccountBlock
  class GetResultSerializer < BaseSerializer
    include FastJsonapi::ObjectSerializer

    attributes :user_result do |object ,params|
      answers = UserQuestionAnswer.where("account_id = ?", object.id).pluck(:answer_id)

      user_result_for(answers)
    end

    attributes :results do |object , params|
      result =[]
      final_score=nil
      profile_type = []
      WellBeingCategory.all.each do |cate|
        catg=[]
        well_test = WellbeingTest.where(account_id: object.id ,category_id: cate.id).last
        well_test.update(status: true) if well_test.present?
        only_category_questions=QuestionWellBeing.where(category_id: cate.id).pluck(:id)
        userquestionanswer=UserQuestionAnswer.where(question_id: only_category_questions).where(account_id: object.id)
        if only_category_questions.count == userquestionanswer.count
          last_question_date=UserQuestionAnswer.where(question_id: only_category_questions).where(account_id: object.id)&.last&.updated_at.to_s
      
          category_scores=AnswerWellBeing.where(id: userquestionanswer.pluck(:answer_id)).pluck(:score)
      
          maincatg={}
          if cate.id == 3 
            only_category_questions = QuestionWellBeing.where(category_id: 3).select(&:sequence).pluck(:id)
            userquestionanswer = UserQuestionAnswer.where(question_id: only_category_questions ,account_id: object.id)
            category_scores=AnswerWellBeing.where(id: userquestionanswer.pluck(:answer_id)).pluck(:score)
          end
      
          if category_scores.present?
        
            category_scores = category_scores.map(&:to_i)
            cat_count = category_scores.count
            category_final_score = category_scores.reduce(0, :+) if category_scores.length > 0
            category_percentage=(category_final_score*10)/cat_count
            # Query for category-level results (where subcategory_id is null or empty)
            user_answer_result = UserAnswerResult.where(category_id: cate.id).where("subcategory_id IS NULL OR subcategory_id = ''")
            Rails.logger.info("Category #{cate.category_name}: score=#{category_final_score}, found #{user_answer_result.count} UserAnswerResult records")
            user_uar=nil
            cat_score_level=nil
            user_answer_result&.each do |uar|
              Rails.logger.info("  Checking UAR: min=#{uar&.min_score}, max=#{uar&.max_score}, score_level=#{uar&.score_level}")
              if category_final_score>=uar&.min_score.to_i and category_final_score<=uar&.max_score.to_i
                user_uar=uar&.advice
                cat_score_level=uar.score_level
                Rails.logger.info("  MATCHED! advice=#{user_uar&.truncate(50)}")
                break
              end
            end

            maincatg={category_name: cate.category_name, score: category_final_score, question_count: cat_count, percentage: category_percentage, advice: user_uar, submitted_at: Date.parse(last_question_date), score_level: cat_score_level}
          end

          sub_maincatg = {}
          sub_only_category_questions=QuestionWellBeing.where(category_id: cate.id).where(subcategory_id: nil).pluck(:id)
          sub_userquestionanswer=UserQuestionAnswer.where(question_id: sub_only_category_questions).where(account_id: object.id)
          sub_category_scores=AnswerWellBeing.where(id: sub_userquestionanswer.pluck(:answer_id)).pluck(:score)
          sub_maincatg={}
          if sub_category_scores.present?
            sub_category_scores = sub_category_scores.map(&:to_i)
            sub_count = sub_category_scores.count
            sub_category_final_score = sub_category_scores.reduce(0, :+) if sub_category_scores.length > 0
            sub_category_percentage=(sub_category_final_score*10)/sub_count
            sub_maincatg={sub_category: cate.category_name, score: sub_category_final_score, question_count: sub_count, percentage: category_percentage}
          end
          if sub_maincatg.present?
            maincatg[:score] = sub_maincatg[:score]
          end 
          catg<<sub_maincatg

          question=WellBeingSubCategory.where(well_being_category_id: cate&.id).each do |sub_cate|
            cate_questions = QuestionWellBeing.where("category_id = ? and subcategory_id = ?", cate.id, sub_cate&.id)
            questions = UserQuestionAnswer.where("account_id = ?", object.id).where(question_id: cate_questions.all.pluck(:id))
            answers = questions.all.pluck(:answer_id)
            scores=nil
            scores=AnswerWellBeing.where(id: answers).pluck(:score)
            scores = scores.map(&:to_i) 
            count = scores.count
            final_score = scores.length > 0? scores.reduce(0, :+):0 
            percentage=(final_score*10)/count if !count.zero?
            sub_user_answer_result = UserAnswerResult.where(category_id: cate.id).where(subcategory_id: sub_cate.id)
            focus_area = BxBlockAssessmenttest::WellBeingFocusArea.find_by(well_being_sub_categoryid: sub_cate.id.to_s)&.answers
            sub_user_uar=nil
            score_level=nil
            sub_user_answer_result&.each do |uar|
              if final_score>=uar&.min_score and final_score<=uar&.max_score
                sub_user_uar=uar&.advice
                score_level=uar&.score_level
                break
              end
            end

            catg<<{sub_category: sub_cate.sub_category_name, score: final_score, question_count: count, percentage: percentage, advice: sub_user_uar, score_level: score_level, well_being_focus_area: focus_area}
            
            catg.map do|obj|
              if obj[:score_level] == "high"
                obj[:top_strength] = obj[:sub_category]
              end
              if obj[:top_strength].nil?
                obj[:top_strength] = "NA"
              end
              if obj[:sub_category] == "Exhaustion"
                profile_type << obj[:advice]
              elsif obj[:sub_category] == "Cynicism"
                profile_type << obj[:advice]
              elsif obj[:sub_category]&.downcase == "professional efficacy"
                profile_type << obj[:advice]
              end
              percentage = obj[:percentage]
              # Query with string conversion for MySQL compatibility
              well_being_focus_area = BxBlockAssessmenttest::WellBeingFocusArea.where(well_being_sub_categoryid: sub_cate&.id.to_s)
              Rails.logger.info("Focus area update - subcategory: #{sub_cate&.sub_category_name}, id: #{sub_cate&.id}, score_level: #{obj[:score_level]}, found: #{well_being_focus_area.count}")
              
              if  (obj[:score_level] == "high" || obj[:score_level] == "medium") && percentage.present?
                well_being_focus_area.each do|well_being_focus_area1|
                  begin
                    well_being_focus_area1.reload
                    accounts = well_being_focus_area1.multiple_account
                    # Handle legacy double-serialized data
                    accounts = JSON.parse(accounts) if accounts.is_a?(String)
                    accounts = [] if accounts.nil? || !accounts.is_a?(Array)
                    if accounts.include?(object.id)
                      accounts.delete(object.id)
                      well_being_focus_area1.update!(multiple_account: accounts)
                      Rails.logger.info("Removed user #{object.id} from focus area #{well_being_focus_area1.answers}")
                    end
                  rescue => e
                    Rails.logger.error("FAILED to remove from focus area: #{e.message}")
                  end
                end
              end 
              if  obj[:score_level] == "low" && percentage.present?
                well_being_focus_area.each do|well_being_focus_area1|
                  begin
                    well_being_focus_area1.reload
                    accounts = well_being_focus_area1.multiple_account
                    # Handle legacy double-serialized data
                    accounts = JSON.parse(accounts) if accounts.is_a?(String)
                    accounts = [] if accounts.nil? || !accounts.is_a?(Array)
                    Rails.logger.info("Focus area #{well_being_focus_area1.answers}: current accounts = #{accounts.inspect}")
                    
                    unless accounts.include?(object.id)
                      accounts << object.id
                      well_being_focus_area1.update!(multiple_account: accounts)
                      Rails.logger.info("SAVED user #{object.id} to focus area #{well_being_focus_area1.answers}, new value: #{accounts.inspect}")
                    end
                  rescue => e
                    Rails.logger.error("FAILED to save focus area #{well_being_focus_area1.answers}: #{e.message}")
                    Rails.logger.error(e.backtrace.first(3).join("\n"))
                  end
                end
              end 
            end
          end
            type = profile_type.uniq
            advices1 = "High Efficacy"
            advices2 = "Low to Moderate Exhaustion"
            advices3 = "Low to Moderate Cynicism"
            advices4 = "High Exhaustion"
            advices5 = "High Cynicism"
            advices6 = "Low Exhaustion"
            advices7 = "Low to Moderate Efficacy"
            advices8 = "Low Professional Efficacy"
            advices9 = "Low Cynicism"

                      # Provided 14 combinations
            type1 = [advices4, advices5, advices1]  # High Exhaustion, High Cynicism, high efficacy
            type2 = [advices4, advices5, advices8]  # High Exhaustion, High Cynicism, Low Professional Efficacy
            type3 = [advices4, advices5, advices7]  # High Exhaustion, High Cynicism, Low to Moderate Efficacy
            type4 = [advices4, advices9, advices1]  # High Exhaustion, Low Cynicism, high efficacy
            type5 = [advices4, advices9, advices8]  # High Exhaustion, Low Cynicism, Low Professional Efficacy
            type6 = [advices4, advices9, advices7]  # High Exhaustion, Low Cynicism, Low to Moderate Efficacy
            type7 = [advices4, advices3, advices1]  # High Exhaustion, Low to Moderate Cynicism, high efficacy
            type8 = [advices4, advices3, advices8]  # High Exhaustion, Low to Moderate Cynicism, Low Professional Efficacy
            type9 = [advices4, advices3, advices7]  # High Exhaustion, Low to Moderate Cynicism, Low to Moderate Efficacy
            type10 = [advices6, advices5, advices1]  # Low Exhaustion, High Cynicism, high efficacy
            type11 = [advices6, advices5, advices8]  # Low Exhaustion, High Cynicism, Low Professional Efficacy
            type12 = [advices6, advices5, advices7]  # Low Exhaustion, High Cynicism, Low to Moderate Efficacy
            type13 = [advices6, advices9, advices1]  # Low Exhaustion, Low Cynicism, high efficacy 
            type14 = [advices6, advices9, advices8]  # Low Exhaustion, Low Cynicism, Low Professional Efficacy

            # Implementing the remaining 16 combinations
            type15 = [advices6, advices9, advices7]  # Low Exhaustion, Low Cynicism, Low to Moderate Efficacy
            type16 = [advices6, advices5, advices7]  # Low Exhaustion, High Cynicism, Low to Moderate Efficacy
            type17 = [advices2, advices5, advices1]  # Low to Moderate Exhaustion, High Cynicism, high efficacy
            type18 = [advices2, advices5, advices8]  # Low to Moderate Exhaustion, High Cynicism, Low Professional Efficacy
            type19 = [advices2, advices5, advices7]  # Low to Moderate Exhaustion, High Cynicism, Low to Moderate Efficacy
            type20 = [advices2, advices9, advices1]  # Low to Moderate Exhaustion, Low Cynicism, high efficacy
            type21 = [advices6, advices3, advices8]  # Low Exhaustion, Low to Moderate Cynicism, Low Professional Efficacy
            type22 = [advices2, advices3, advices8]  # Low to Moderate Exhaustion, Low to Moderate Cynicism, Low Professional Efficacy
            type23 = [advices6, advices3, advices1]  # Low Exhaustion, Low to Moderate Cynicism, high efficacy
            type24 = [advices2, advices3, advices1]  # Low to Moderate Exhaustion, Low to Moderate Cynicism, high efficacy
            type25 = [advices6, advices3, advices7]  # Low Exhaustion, Low to Moderate Cynicism ,Low to Moderate Efficacy
            type26 = [advices2, advices9, advices8]  # Low to Moderate Exhaustion, Low Cynicism, Low Professional Efficacy
            type27 = [advices2, advices9, advices7]  # Low to Moderate Exhaustion, Low Cynicism, Low to Moderate Efficacy
            type28 = [advices2, advices3, advices7]  # Low to Moderate Exhaustion, Low to Moderate Cynicism , Low to Moderate Efficacy  
            
            profile = if type.map(&:downcase).sort ==  type13.map(&:downcase).sort || type.map(&:downcase).sort == type23.map(&:downcase).sort || type.map(&:downcase).sort == type20.map(&:downcase).sort || type.map(&:downcase).sort == type24.map(&:downcase).sort
                    "You seem to be Engaged at work"
                  elsif type.map(&:downcase).sort ==  type14.map(&:downcase).sort || type.map(&:downcase).sort == type15.map(&:downcase).sort || type.map(&:downcase).sort == type21.map(&:downcase).sort || type.map(&:downcase).sort == type25.map(&:downcase).sort || type.map(&:downcase).sort == type26.map(&:downcase).sort || type.map(&:downcase).sort == type27.map(&:downcase).sort || type.map(&:downcase).sort == type22.map(&:downcase).sort || type.map(&:downcase).sort == type28.map(&:downcase).sort 
                    "You seem to be Ineffective at work"
                  elsif type.map(&:downcase).sort ==  type5.map(&:downcase).sort || type.map(&:downcase).sort == type6.map(&:downcase).sort || type.map(&:downcase).sort == type8.map(&:downcase).sort || type.map(&:downcase).sort == type9.map(&:downcase).sort
                    "You seem to be Overextended at work"
                  elsif type.map(&:downcase).sort ==  type11.map(&:downcase).sort || type.map(&:downcase).sort == type12.map(&:downcase).sort || type.map(&:downcase).sort == type18.map(&:downcase).sort || type.map(&:downcase).sort == type19.map(&:downcase).sort 
                    "You seem to be Disengaged at work"
                  elsif type.map(&:downcase).sort ==  type2.map(&:downcase).sort || type.map(&:downcase).sort ==  type3.map(&:downcase).sort
                    "You seem to be Burnt Out"
                  elsif type.map(&:downcase).sort == type1.map(&:downcase).sort  
                    "You have high risk of getting Burnt Out"
                  elsif type.map(&:downcase).sort ==  type7.map(&:downcase).sort || type.map(&:downcase).sort == type4.map(&:downcase).sort 
                    "You have high chances of getting Overextended at work"
                  elsif type.map(&:downcase).sort ==  type10.map(&:downcase).sort || type.map(&:downcase).sort == type17.map(&:downcase).sort
                    "You have high chances of getting Disengaged at work"
                  end

            if cate.category_name == "Occupational Wellbeing"
              maincatg[:profile_type] = profile
            end
            result<<{category_result: maincatg, sub_category_result: catg}
          end
          
          
        end
        get_wellbeing_report(result, object, params)
        result
      end


    class << self
      private
      def get_wellbeing_report(result , object, params)
    
        result.map do|obj|
          if obj[:category_result][:category_name] == "Occupational Wellbeing"
            sub_categories_order = ["Cynicism", "Exhaustion", "Professional Efficacy"]
            sub_categories = obj[:sub_category_result].sort_by do |sub_cat|
              sub_categories_order.index(sub_cat[:sub_category]) || Float::INFINITY
            end
            obj[:sub_category_result] = sub_categories
          end
          cate_id = WellBeingCategory.find_by(category_name: obj[:category_result][:category_name])&.id
          if cate_id && params[:value] == "true"
            reports = WellbeingScoreReport.where(category_id: cate_id ,submitted_at: obj[:category_result][:submitted_at],account_id: object.id)
            if reports.present?
              existing_reports = reports.map do |obj1|
                obj1 if obj[:category_result].to_json == obj1.category_result.to_json
              end
              if existing_reports.compact.blank? 
                WellbeingScoreReport.create(category_id: cate_id, account_id: object.id, category_result: obj[:category_result] ,sub_category_result: obj[:sub_category_result] , submitted_at: obj[:category_result][:submitted_at].to_s)
              end
            else
              WellbeingScoreReport.create(category_id: cate_id, account_id: object.id, category_result: obj[:category_result] ,sub_category_result: obj[:sub_category_result] , submitted_at: obj[:category_result][:submitted_at].to_s)
            end
          end
        end
      end

      def user_result_for(answers)
        scores=AnswerWellBeing.where(id: answers).pluck(:score)
        if scores.present?
          scores = scores.map(&:to_i)
          count = scores.count
          final_score = scores.reduce(0, :+)/count if scores.length > 0
          {final_score: final_score, question_count: answers.count, percentage: (final_score*100)/count}
        end
      end
    end
  end
end
