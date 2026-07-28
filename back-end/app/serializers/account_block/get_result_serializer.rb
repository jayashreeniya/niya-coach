module AccountBlock
  class GetResultSerializer < BaseSerializer
    include FastJsonapi::ObjectSerializer

    attributes :user_result do |object, _params|
      answers = UserQuestionAnswer.where(account_id: object.id).pluck(:answer_id)
      AccountBlock::GetResultSerializer.user_result_for(answers)
    end

    attributes :results do |object, params|
      AccountBlock::GetResultSerializer.compute_results(object, params)
    end

    class << self
      def compute_results(object, params)
        account_id = object.id
        persist_side_effects = params[:value].to_s == "true"

        categories = WellBeingCategory.all.to_a
        questions_by_category = QuestionWellBeing.all.group_by { |q| q.category_id.to_i }
        subs_by_category = WellBeingSubCategory.all.group_by { |s| s.well_being_category_id.to_i }
        uars_by_category = UserAnswerResult.all.group_by { |u| u.category_id.to_i }
        focus_areas_by_sub = BxBlockAssessmenttest::WellBeingFocusArea.all.group_by { |f| f.well_being_sub_categoryid.to_s }

        ua_rows = UserQuestionAnswer.where(account_id: account_id).pluck(:question_id, :answer_id, :updated_at)
        answers_by_qid = {}
        ua_rows.each do |qid, aid, updated_at|
          answers_by_qid[qid.to_i] = { answer_id: aid, updated_at: updated_at }
        end

        answer_ids = ua_rows.map { |r| r[1] }.compact.uniq
        score_by_answer_id = AnswerWellBeing.where(id: answer_ids).pluck(:id, :score).to_h
        score_by_answer_id.transform_values! { |s| s.to_i }

        tests_by_category = WellbeingTest.where(account_id: account_id).group_by(&:category_id)

        result = []
        categories.each do |cate|
          cat_questions = questions_by_category[cate.id.to_i] || []
          next if cat_questions.blank?

          if cate.id.to_i == 3
            cat_questions = cat_questions.select { |q| q.sequence.present? }
          end

          cat_qids = cat_questions.map(&:id)
          answered = cat_qids.map { |qid| answers_by_qid[qid] }.compact
          next unless answered.length == cat_qids.length && cat_qids.present?

          if persist_side_effects
            well_test = Array(tests_by_category[cate.id]).last
            well_test.update(status: true) if well_test.present?
          end

          last_updated = answered.map { |a| a[:updated_at] }.compact.max
          next unless last_updated
          last_question_date = last_updated.to_date

          category_scores = answered.map { |a| score_by_answer_id[a[:answer_id]] || 0 }
          category_final_score = category_scores.sum
          cat_count = category_scores.length
          category_percentage = cat_count.zero? ? 0 : (category_final_score * 10) / cat_count

          cat_uars = Array(uars_by_category[cate.id.to_i])
          category_uars = cat_uars.select { |u| u.subcategory_id.blank? }
          user_uar, cat_score_level = match_uar(category_uars, category_final_score)

          maincatg = {
            category_name: cate.category_name,
            score: category_final_score,
            question_count: cat_count,
            percentage: category_percentage,
            advice: user_uar,
            submitted_at: last_question_date,
            score_level: cat_score_level
          }

          null_sub_qids = cat_questions.select { |q| q.subcategory_id.blank? }.map(&:id)
          null_scores = null_sub_qids.map do |qid|
            row = answers_by_qid[qid]
            row ? (score_by_answer_id[row[:answer_id]] || 0) : nil
          end.compact
          sub_maincatg = {}
          if null_scores.present?
            sub_maincatg = {
              sub_category: cate.category_name,
              score: null_scores.sum,
              question_count: null_scores.length,
              percentage: category_percentage
            }
            maincatg[:score] = sub_maincatg[:score]
          end

          catg = []
          catg << sub_maincatg if sub_maincatg.present?

          profile_labels = []
          Array(subs_by_category[cate.id.to_i]).each do |sub_cate|
            sub_qids = cat_questions.select { |q| q.subcategory_id.to_i == sub_cate.id.to_i }.map(&:id)
            sub_scores = sub_qids.map do |qid|
              row = answers_by_qid[qid]
              row ? (score_by_answer_id[row[:answer_id]] || 0) : nil
            end.compact
            count = sub_scores.length
            final_score = sub_scores.sum
            percentage = count.zero? ? nil : (final_score * 10) / count

            sub_uars = cat_uars.select { |u| u.subcategory_id.to_i == sub_cate.id.to_i }
            sub_user_uar, score_level = match_uar(sub_uars, final_score)

            if score_level.blank? && count.positive?
              score_level = inferred_score_level(sub_cate.sub_category_name, final_score, count)
            end

            focus_area_records = Array(focus_areas_by_sub[sub_cate.id.to_s])
            focus_area = focus_area_records.first&.answers

            catg << {
              sub_category: sub_cate.sub_category_name,
              score: final_score,
              question_count: count,
              percentage: percentage,
              advice: sub_user_uar,
              score_level: score_level,
              well_being_focus_area: focus_area,
              top_strength: score_level.to_s == "high" ? sub_cate.sub_category_name : "NA"
            }

            label = occupational_matrix_label(
              sub_cate.sub_category_name,
              score_level,
              sub_user_uar,
              final_score,
              count
            )
            profile_labels << label if label.present?

            if persist_side_effects && percentage.present?
              sync_focus_areas(focus_area_records, object.id, score_level)
            end
          end

          if cate.category_name == "Occupational Wellbeing"
            maincatg[:profile_type] = resolve_occupational_profile(profile_labels)
          end

          result << { category_result: maincatg, sub_category_result: catg }
        end

        get_wellbeing_report(result, object, params)
        result
      end

      def match_uar(uars, score)
        Array(uars).each do |uar|
          if score >= uar.min_score.to_i && score <= uar.max_score.to_i
            return [uar.advice, uar.score_level]
          end
        end
        [nil, nil]
      end

      def inferred_score_level(sub_category, score, question_count)
        name = sub_category.to_s.strip.downcase
        mean = score.to_f / question_count
        case name
        when "exhaustion", "cynicism"
          return "high" if mean <= 2.0
          return "medium" if mean <= 3.0
          "low"
        when "professional efficacy"
          return "high" if mean >= 4.0
          return "medium" if mean >= 3.0
          "low"
        else
          return "high" if mean >= 4.0
          return "medium" if mean >= 3.0
          "low"
        end
      end

      def occupational_matrix_label(sub_category, score_level, advice = nil, score = nil, question_count = nil)
        name = sub_category.to_s.strip.downcase
        return nil unless ["exhaustion", "cynicism", "professional efficacy"].include?(name)

        advice_text = advice.to_s.strip
        known = [
          "High Efficacy", "Low to Moderate Exhaustion", "Low to Moderate Cynicism",
          "High Exhaustion", "High Cynicism", "Low Exhaustion",
          "Low to Moderate Efficacy", "Low Professional Efficacy", "Low Cynicism"
        ]
        known_match = known.find { |k| k.casecmp(advice_text).zero? }
        return known_match if known_match

        level = score_level.to_s.strip.downcase
        case name
        when "exhaustion"
          return "Low Exhaustion" if level == "high"
          return "Low to Moderate Exhaustion" if level == "medium"
          return "High Exhaustion" if level == "low"
          return infer_symptom_label(advice_text, "Exhaustion") if advice_text.present?
          score_based_symptom_label("Exhaustion", score, question_count)
        when "cynicism"
          return "Low Cynicism" if level == "high"
          return "Low to Moderate Cynicism" if level == "medium"
          return "High Cynicism" if level == "low"
          return infer_symptom_label(advice_text, "Cynicism") if advice_text.present?
          score_based_symptom_label("Cynicism", score, question_count)
        when "professional efficacy"
          return "High Efficacy" if level == "high"
          return "Low to Moderate Efficacy" if level == "medium"
          return "Low Professional Efficacy" if level == "low"
          return infer_efficacy_label(advice_text) if advice_text.present?
          score_based_efficacy_label(score, question_count)
        end
      end

      def resolve_occupational_profile(profile_labels)
        type = Array(profile_labels).compact.uniq
        normalize = ->(arr) { Array(arr).compact.map { |v| v.to_s.downcase }.sort }
        type_key = normalize.call(type)

        advices1 = "High Efficacy"
        advices2 = "Low to Moderate Exhaustion"
        advices3 = "Low to Moderate Cynicism"
        advices4 = "High Exhaustion"
        advices5 = "High Cynicism"
        advices6 = "Low Exhaustion"
        advices7 = "Low to Moderate Efficacy"
        advices8 = "Low Professional Efficacy"
        advices9 = "Low Cynicism"

        type1 = [advices4, advices5, advices1]
        type2 = [advices4, advices5, advices8]
        type3 = [advices4, advices5, advices7]
        type4 = [advices4, advices9, advices1]
        type5 = [advices4, advices9, advices8]
        type6 = [advices4, advices9, advices7]
        type7 = [advices4, advices3, advices1]
        type8 = [advices4, advices3, advices8]
        type9 = [advices4, advices3, advices7]
        type10 = [advices6, advices5, advices1]
        type11 = [advices6, advices5, advices8]
        type12 = [advices6, advices5, advices7]
        type13 = [advices6, advices9, advices1]
        type14 = [advices6, advices9, advices8]
        type15 = [advices6, advices9, advices7]
        type17 = [advices2, advices5, advices1]
        type18 = [advices2, advices5, advices8]
        type19 = [advices2, advices5, advices7]
        type20 = [advices2, advices9, advices1]
        type21 = [advices6, advices3, advices8]
        type22 = [advices2, advices3, advices8]
        type23 = [advices6, advices3, advices1]
        type24 = [advices2, advices3, advices1]
        type25 = [advices6, advices3, advices7]
        type26 = [advices2, advices9, advices8]
        type27 = [advices2, advices9, advices7]
        type28 = [advices2, advices3, advices7]

        if [type13, type23, type20, type24].any? { |t| type_key == normalize.call(t) }
          "You seem to be Engaged at work"
        elsif [type14, type15, type21, type25, type26, type27, type22, type28].any? { |t| type_key == normalize.call(t) }
          "You seem to be Ineffective at work"
        elsif [type5, type6, type8, type9].any? { |t| type_key == normalize.call(t) }
          "You seem to be Overextended at work"
        elsif [type11, type12, type18, type19].any? { |t| type_key == normalize.call(t) }
          "You seem to be Disengaged at work"
        elsif [type2, type3].any? { |t| type_key == normalize.call(t) }
          "You seem to be Burnt Out"
        elsif type_key == normalize.call(type1)
          "You have high risk of getting Burnt Out"
        elsif [type7, type4].any? { |t| type_key == normalize.call(t) }
          "You have high chances of getting Overextended at work"
        elsif [type10, type17].any? { |t| type_key == normalize.call(t) }
          "You have high chances of getting Disengaged at work"
        end
      end

      def score_based_symptom_label(dimension, score, question_count)
        return nil if score.nil? || question_count.to_i <= 0
        mean = score.to_f / question_count
        return "Low #{dimension}" if mean <= 2.0
        return "Low to Moderate #{dimension}" if mean <= 3.0
        "High #{dimension}"
      end

      def score_based_efficacy_label(score, question_count)
        return nil if score.nil? || question_count.to_i <= 0
        mean = score.to_f / question_count
        return "High Efficacy" if mean >= 4.0
        return "Low to Moderate Efficacy" if mean >= 3.0
        "Low Professional Efficacy"
      end

      def infer_symptom_label(advice_text, dimension)
        text = advice_text.to_s.downcase
        return nil if text.empty?
        return "High #{dimension}" if text.match?(/high\s+(levels?\s+of\s+)?#{Regexp.escape(dimension.downcase)}/)
        return "Low to Moderate #{dimension}" if text.match?(/medium|moderate/)
        return "Low #{dimension}" if text.match?(/low\s+(levels?\s+of\s+)?#{Regexp.escape(dimension.downcase)}/)
        nil
      end

      def infer_efficacy_label(advice_text)
        text = advice_text.to_s.downcase
        return nil if text.empty?
        return "High Efficacy" if text.match?(/high\s+(professional\s+)?efficac/)
        return "Low to Moderate Efficacy" if text.match?(/medium|moderate|low to moderate/)
        return "Low Professional Efficacy" if text.match?(/low\s+(professional\s+)?efficac/)
        nil
      end

      def sync_focus_areas(focus_area_records, account_id, score_level)
        level = score_level.to_s
        focus_area_records.each do |focus|
          begin
            accounts = focus.multiple_account
            accounts = JSON.parse(accounts) if accounts.is_a?(String)
            accounts = [] if accounts.nil? || !accounts.is_a?(Array)

            if level == "low"
              unless accounts.include?(account_id)
                accounts << account_id
                focus.update!(multiple_account: accounts)
              end
            elsif level == "high" || level == "medium"
              if accounts.include?(account_id)
                accounts.delete(account_id)
                focus.update!(multiple_account: accounts)
              end
            end
          rescue StandardError => e
            Rails.logger.error("FAILED to sync focus area #{focus&.answers}: #{e.message}")
          end
        end
      end

      def get_wellbeing_report(result, object, params)
        result.each do |obj|
          next unless obj[:category_result].present?

          if obj[:category_result][:category_name] == "Occupational Wellbeing"
            sub_categories_order = ["Cynicism", "Exhaustion", "Professional Efficacy"]
            obj[:sub_category_result] = Array(obj[:sub_category_result]).sort_by do |sub_cat|
              sub_categories_order.index(sub_cat[:sub_category]) || Float::INFINITY
            end
          end

          next unless params[:value].to_s == "true"

          cate_id = WellBeingCategory.find_by(category_name: obj[:category_result][:category_name])&.id
          next unless cate_id

          reports = WellbeingScoreReport.where(
            category_id: cate_id,
            submitted_at: obj[:category_result][:submitted_at],
            account_id: object.id
          )
          if reports.present?
            already_saved = reports.any? { |r| obj[:category_result].to_json == r.category_result.to_json }
            next if already_saved
          end

          WellbeingScoreReport.create(
            category_id: cate_id,
            account_id: object.id,
            category_result: obj[:category_result],
            sub_category_result: obj[:sub_category_result],
            submitted_at: obj[:category_result][:submitted_at].to_s
          )
        end
      end

      def user_result_for(answers)
        scores = AnswerWellBeing.where(id: answers).pluck(:score)
        return nil if scores.blank?

        scores = scores.map(&:to_i)
        count = scores.count
        final_score = scores.sum / count
        { final_score: final_score, question_count: answers.count, percentage: (final_score * 100) / count }
      end
    end
  end
end
