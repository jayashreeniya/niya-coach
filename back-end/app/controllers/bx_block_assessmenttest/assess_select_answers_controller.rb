module BxBlockAssessmenttest
	class AssessSelectAnswersController < ApplicationController
		include BuilderJsonWebToken::JsonWebTokenValidation 
		before_action :validate_json_web_token
		def create
			question = BxBlockAssessmenttest::AssessYourselfTestType.find_by(id:  params[:question_id])
			answer = question&.assess_tt_answers&.where(id: params[:answer_id])
			if question.present?
				if answer.present? && question.sequence_number == params[:sequence_number].to_i
					select_answer = BxBlockAssessmenttest::AssessSelectAnswer.where(select_answer_status: true, assess_yourself_test_type_id: params[:question_id], assess_tt_answer_id: params[:answer_id],assess_yourself_answer_id: question&.assess_yourself_answer_id,account_id: @token.id)
					if select_answer.present?
						return render json: {errors: [{message: "Answer already given"}]}, status: :unprocessable_entity
					else
						@selected_answer = BxBlockAssessmenttest::AssessSelectAnswer.new(select_answer_status: true, assess_yourself_test_type_id: params[:question_id], assess_tt_answer_id: params[:answer_id],assess_yourself_answer_id: question&.assess_yourself_answer_id,account_id: @token.id)
						@selected_answer.save
						render json: BxBlockAddress::AssessSelectAnswerSerializer.new(@selected_answer).serializable_hash, status: :created
					end
				else 
					render json: {errors: [{message: "answer or sequence number not match with this question "}]}, status: :unprocessable_entity
				end 
			else 
				render json: {errors: [{message: "question id not found "}]},status: :unprocessable_entity
			end 
		end


		def assess_score
			account = AccountBlock::Account.find_by(id: @token.id)
			total_s = []
			if account.present?
				# selected_mood = account.assess_yourself_choose_answers.last.assess_yourself_answer_id
				selected_mood = params[:assess_yourself_id]

				if selected_mood.present?

                    # all question 
					all_question = BxBlockAssessmenttest::AssessYourselfTestType.where(assess_yourself_answer_id: selected_mood)
					
					#slected answer according to mood
					selected_answers = BxBlockAssessmenttest::AssessSelectAnswer.where(account_id: account.id)	
					selected_answers = selected_answers.where(assess_yourself_answer_id: selected_mood, select_answer_status: true)
					if all_question.count.to_i == selected_answers.count.to_i

						assess_tt = selected_answers.pluck(:assess_tt_answer_id)
						score = BxBlockAssessmenttest::AssessTtAnswer.where(id: assess_tt).pluck(:answer_score)

						sum = 0
						# score.each { |a| sum+=a.to_i }
						sum = score.map(&:to_i).sum
						ss = BxBlockAssessmenttest::AnixetyCutoff.where(category_id: selected_mood).pluck(:min_score).sort.last
						st = BxBlockAssessmenttest::AnixetyCutoff.where(category_id: selected_mood).pluck(:max_score).sort.last
						asd = true
						BxBlockAssessmenttest::AnixetyCutoff.where(category_id: selected_mood).each do |i|
							grade = sum.between?(i.min_score, i.max_score)
							if grade
								if i.min_score == ss && st ==i.max_score
									asd = false
								end
								total_s << i
							end
						end
						BxBlockAssessmenttest::TotalScoreOfAssess.create(account_id: account.id, mood_id: selected_mood,  total_score: sum)
						BxBlockAssessmenttest::AssessSelectAnswer.where(account_id: account.id).delete_all
                        total_s[0].update(total_score: sum, result: asd ) if total_s.present?
						render json: {score: total_s}, status: :ok

					else 
						render json: {errors: [{message: "some question remaining"}]}, status: :unprocessable_entity

					end 

				end
	
			end
		end

		def delete_assess_answer
			if account_user
				account_user.assess_select_answers.delete_all
				render json: {message: "All selected answer deleted"}, status: :ok
			end
		end


		private
		
		def account_user
	      current_user = AccountBlock::Account.find_by(id: @token.id)
	    end

	end

end
