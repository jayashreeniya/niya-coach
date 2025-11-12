module BxBlockAssessmenttest
	class AssesmentTestQuestionsController < ApplicationController
		before_action :validate_json_web_token
		include BuilderJsonWebToken::JsonWebTokenValidation 

		def questions
			@que = BxBlockAssessmenttest::AssesmentTestQuestion.all
			if @que.present?
				render json: BxBlockAddress::AssesmentTestQuestionSerializer.new(@que).serializable_hash, status: :created
			else
				render json: {errors: [{message: "question not found"}]}
			end

		end

		def delete_answer
			if account_user
				ids = BxBlockAssessmenttest::AssessYourselfQuestion.all.pluck(:id)
				BxBlockAssessmenttest::AssessYourselfQuestion.all.destroy_all
				if ids.present?
					BxBlockAssessmenttest::AssessYourselfAnswer.where(assess_yourself_question_id: ids).destroy_all
		    	else
		    		BxBlockAssessmenttest::AssessYourselfAnswer.destroy_all
		    	end
				render json: {message: "Answer deleted successfully"},status: :ok
			end
		end

		private
		
		def account_user
	      AccountBlock::Account.find_by(id: @token.id)
	    end
	end
end
