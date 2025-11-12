module BxBlockAssessmenttest
	class AssesmentTestAnswersController < ApplicationController
		def show
			@que_detail = BxBlockAssessmenttest::AssesmentTestQuestion.find_by(id: params[:id])

			if @que_detail.present?
				render json: BxBlockAddress::AssesmentTestAnswerSerializer.new(@que_detail).serializable_hash, status: :ok
			else
				render json: {errors: [{message: "assesment test question id not found"}]}
			end
		end
	end
end
