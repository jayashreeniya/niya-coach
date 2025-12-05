module BxBlockAssessmenttest
	class FocusAreasController < ApplicationController
		include BuilderJsonWebToken::JsonWebTokenValidation
		skip_before_action :verify_authenticity_token
		before_action :validate_json_web_token



		def create
		  @focus_areas = current_user&.select_answers&.last

		  unless @focus_areas
		    return render json: { errors: [{ message: "Focus areas not found" }] }, status: :not_found
		  end
		  render json: BxBlockAddress::FocusAreaSerializer.new(@focus_areas).serializable_hash, status: :ok
		end


		def my_progress
			if current_user.present?
				focus_areas_id = BxBlockAssessmenttest::StoringFocusArea.where(account_id: current_user&.id).last&.focus_areas_id
				return render json: {errors: "No focus area selected"}, status: :unprocessable_entity if focus_areas_id.nil?
				render json: BxBlockAddress::MyProgressSerializer.new(current_user).serializable_hash, status: :ok
			else
				render json: {errors: "Account Not Found"}, status: :unprocessable_entity
			end
		end

		def activity
			@activity = FocusAreaText.where(account_id: @token.id, submitted_at: Date.today).last
			if @activity.present?
				@activity.update(focus_text_box:params[:focus_text_box])
			else
				@activity = FocusAreaText.create(focus_text_box:params[:focus_text_box], account_id: @token.id,submitted_at: Date.today)
			end
			render json: @activity 
		end

		private

		def current_user
			return unless @token
	    	@current_user ||= AccountBlock::Account.find(@token.id)
		end
	end
end
