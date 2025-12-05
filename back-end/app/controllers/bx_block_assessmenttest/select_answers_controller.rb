module BxBlockAssessmenttest
	class SelectAnswersController < ApplicationController
		include BuilderJsonWebToken::JsonWebTokenValidation
		skip_before_action :verify_authenticity_token
		before_action :validate_json_web_token
		def create
			question = BxBlockAssessmenttest::AssesmentTestType.find_by(id:  params[:question_id])
			answers = question&.assesment_test_type_answers&.where(id: params[:answer_ids])
			if question.present?
				if answers.present? 
					if params[:answer_ids].count<=3
						@user = BxBlockAssessmenttest::ChooseAnswer.where(account_id: @token.id) if @user.present?
						@selected_answers = BxBlockAssessmenttest::SelectAnswer.new(assesment_test_type_id: params[:question_id], account_id: @token.id)
						if @selected_answers.save 
							@selected_answers.multiple_answers << params[:answer_ids]
							@selected_answers.save

							render json: BxBlockAddress::SelectAnswerSerializer.new(@selected_answers).serializable_hash, status: :created
						else
							render json: {errors: [{message: "account not found"}]}
						end
					else
						render json: {errors: [{message: "you can select maximum 3 answers"}]}
					end

				else 
					render json: {errors: [{message: "please select atleast 1 answer or answer not match with this question "}]}

	            end 
	        else 
					render json: {errors: [{message: "question  not found "}]}

	        end 

		end

	end
end
