module AccountBlock
	class InsightSerializer < BaseSerializer
		include FastJsonapi::ObjectSerializer

		attributes :top_strength do |object|
			strength=[]
			# final_score=nil
			# WellBeingCategory.all.each do |cate|
			# 	sub_only_category_questions=QuestionWellBeing.where(category_id: cate.id).where(subcategory_id: nil).pluck(:id)
			# 	sub_userquestionanswer=UserQuestionAnswer.where(question_id: sub_only_category_questions).where(account_id: object.id)
			# 	sub_category_scores=AnswerWellBeing.where(id: sub_userquestionanswer.pluck(:answer_id)).pluck(:score)
			# 	if sub_category_scores.present?
			# 		sub_category_scores = sub_category_scores.map(&:to_i)
			# 	end
			# 	WellBeingSubCategory.where(well_being_category_id: cate&.id).each do |sub_cate|
			# 		cate_questions = QuestionWellBeing.where("category_id = ? and subcategory_id = ?", cate.id, sub_cate&.id)
			# 		questions = UserQuestionAnswer.where("account_id = ?", object.id).where(question_id: cate_questions.all.pluck(:id))
			# 		answers = questions.all.pluck(:answer_id)
			# 		scores=nil
			# 		scores=AnswerWellBeing.where(id: answers).pluck(:score)
			# 		scores = scores.map(&:to_i)
			# 		count = scores.count
			# 		final_score = scores.length > 0? scores.reduce(0, :+):0
			# 		sub_user_answer_result = UserAnswerResult.where(category_id: cate.id).where(subcategory_id: sub_cate.id)
			# 		sub_user_uar=nil
			# 		score_level=nil
			# 		sub_user_answer_result&.each do |uar|
			# 			if final_score>=uar&.min_score and final_score<=uar&.max_score
			# 				sub_user_uar=uar&.advice
			# 				score_level=uar&.score_level
			# 				break
			# 			end
			# 		end
			# 		substance_use = sub_cate.sub_category_name != WellBeingSubCategory.where("lower(sub_category_name) LIKE ?", "%"+"Substance Use".downcase+"%")&.last&.sub_category_name
			# 		strength<<{id: sub_cate.id, title: sub_cate.sub_category_name} if score_level == 'high' and substance_use
			# 	end
			# end
			# 		strength
			WellBeingCategory.all.each do |cate|
				report = WellbeingScoreReport.where(account_id: object&.id, category_id: cate.id).last
				if report.present?
					top_strength = report.sub_category_result.map{|obj| obj["sub_category"] if obj["score_level"] == "high"}.compact
					sub_cat = top_strength.map{|obj| WellBeingSubCategory.find_by(sub_category_name: obj)}
					value = sub_cat.map{|obj| {id: obj.id , title: obj.sub_category_name}}
					strength << value
				end
			end
			strength = strength.flatten.uniq
			strength
		end

		attributes :focus_areas do |object|
			user_focus_areas=[]
			@focus_areas = BxBlockAssessmenttest::SelectAnswer.where(account_id: object.id).last
			topfocus = TopfocusArea.where(account_id: object&.id).first
			topfocus = TopfocusArea.create(account_id: object&.id) if topfocus.blank?
			focus_area_ids = []
			stored_focus_areas = nil
			if @focus_areas.present?
				user_focus_areas = BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: @focus_areas&.multiple_answers).to_a
				focus_area_ids = BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: @focus_areas&.multiple_answers).ids
				topfocus.update(select_focus_area_id: focus_area_ids)
				stored_focus_areas = BxBlockAssessmenttest::StoringFocusArea.create(account_id: object.id, focus_areas_id: focus_area_ids)
			end
			
		# MySQL-compatible query: Find WellBeingFocusArea where multiple_account contains the user id
		# multiple_account is serialized as JSON array
		wll_obj_focus_area = []
		wll_obj_focus_areas_ids = []
		begin
			Rails.logger.info("InsightSerializer: Looking for focus areas for user #{object.id}")
			BxBlockAssessmenttest::WellBeingFocusArea.find_each do |fa|
				# Use the serialized attribute directly (model has serialize :multiple_account, JSON)
				accounts = fa.multiple_account
				
				# Handle various data states (including legacy double-serialized data)
				if accounts.is_a?(String)
					# Try to parse as JSON (handles double-serialized data)
					accounts = JSON.parse(accounts) rescue []
				end
				accounts = [] if accounts.nil? || !accounts.is_a?(Array)
				
				Rails.logger.info("InsightSerializer: Checking '#{fa.answers}' (id: #{fa.id}), accounts: #{accounts.inspect}")
				
				# Check for both integer and string versions of the user ID
				if accounts.include?(object.id) || accounts.include?(object.id.to_s)
					Rails.logger.info("InsightSerializer: MATCH! Found focus area '#{fa.answers}' for user #{object.id}")
					wll_obj_focus_area << fa
					wll_obj_focus_areas_ids << fa.id
				end
			end
			Rails.logger.info("InsightSerializer: Found #{wll_obj_focus_area.count} wellbeing focus areas for user #{object.id}")
		rescue => e
			Rails.logger.error("Error fetching WellBeingFocusArea: #{e.message}")
			Rails.logger.error(e.backtrace.first(5).join("\n"))
		end
			
			topfocus.update(wellbeingfocus_id: wll_obj_focus_areas_ids) if wll_obj_focus_areas_ids.present?
			if focus_area_ids.present? && wll_obj_focus_areas_ids.present?
				focus_area_ids << wll_obj_focus_areas_ids
			end
			if stored_focus_areas.present?
				stored_focus_areas.update(focus_areas_id: focus_area_ids.flatten.uniq)
			elsif focus_area_ids.present?
				BxBlockAssessmenttest::StoringFocusArea.create(account_id: object.id ,focus_areas_id: focus_area_ids&.flatten&.uniq)
			end
			if wll_obj_focus_area.present?
				user_focus_areas = user_focus_areas.concat(wll_obj_focus_area)
			end
			# user_focus_areas
			all_focus_areas = []
			user_focus_areas.map do |obj|
				all_focus_areas << {id: obj.id , answers: obj.answers} 
			end
			user_focus_areas = all_focus_areas.uniq { |fa| fa[:answers] }
			user_focus_areas
		end
	end
end
