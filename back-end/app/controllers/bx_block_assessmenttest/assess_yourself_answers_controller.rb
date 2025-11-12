module BxBlockAssessmenttest
	class AssessYourselfAnswersController < ApplicationController
		def show
			@que_detail = BxBlockAssessmenttest::AssessYourselfQuestion.find_by(id: params[:id])

			if @que_detail.present?
				render json: BxBlockAddress::AssessYourselfAnswerSerializer.new(@que_detail).serializable_hash, status: :ok
			else
				render json: {errors: [{message: "assess yourself test question id not found"}]}
			end
		end
	end
end
