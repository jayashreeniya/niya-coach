module BxBlockAssessmenttest
	class AssessYourselfChooseAnswersController < ApplicationController
		include BuilderJsonWebToken::JsonWebTokenValidation
		protect_from_forgery with: :null_session
		before_action :validate_json_web_token
		before_action :account_user, only: [:create]
		def create
			question = BxBlockAssessmenttest::AssessYourselfQuestion.find_by(id:  request_params[:assess_yourself_question_id])
			answer = question.assess_yourself_answers.where(id: request_params[:assess_yourself_answer_id])
			if answer.present?
				@selected_answer = BxBlockAssessmenttest::AssessYourselfChooseAnswer.create(request_params.merge(account_id: @token.id))
				# question_count = BxBlockAssessmenttest::AssessYourselfTestType.where(assess_yourself_answer_id: params[:assess_yourself_answer_id]).count
				BxBlockAssessmenttest::AssessSelectAnswer.where(account_id: @token.id, assess_yourself_answer_id: params[:assess_yourself_answer_id]).delete_all
				if @selected_answer.present? 

					render json: BxBlockAddress::AssessYourselfChooseAnswerSerializer.new(@selected_answer, params: {account_id: @token.id, mood_id: request_params[:assess_yourself_answer_id]}).serializable_hash, status: :created
				else
					render json: {errors: [{message: "question or answer not found"}]}
				end
			else 
				render json: {errors: [{message: "answer not match with this question "}]}
			end 
		end

		private
		def request_params
			params.permit(:assess_yourself_question_id, :assess_yourself_answer_id)
		end
		def account_user
			@current_user = AccountBlock::Account.find_by(id: @token.id)
		end
	end
end
