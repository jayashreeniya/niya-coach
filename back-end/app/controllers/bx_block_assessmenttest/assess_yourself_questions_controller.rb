module BxBlockAssessmenttest
	class AssessYourselfQuestionsController < ApplicationController
		def questions
			@que = BxBlockAssessmenttest::AssessYourselfQuestion.all
			if @que.present?
				render json: BxBlockAddress::AssessYourselfQuestionSerializer.new(@que).serializable_hash, status: :created
			else
				render json: {errors: [{message: "question not found"}]}
			end

		end
	end
end
