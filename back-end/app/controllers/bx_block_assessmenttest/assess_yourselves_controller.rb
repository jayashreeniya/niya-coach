module BxBlockAssessmenttest
	class AssessYourselvesController < ApplicationController
		def questions
			@que = BxBlockAssessmenttest::AssessYourselve.all
			if @que.present?
				render json: BxBlockAddress::AssessYourselveSerializer.new(@que).serializable_hash, status: :created
			else
				render json: {errors: [{message: "question not found"}]}
			end

		end
	end
end
