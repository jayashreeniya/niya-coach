module BxBlockAssessmenttest
	class GoalsController < ApplicationController
		include BuilderJsonWebToken::JsonWebTokenValidation
		protect_from_forgery with: :null_session
		before_action :validate_json_web_token
		before_action :account_user
		def create
			storing_focus_area = BxBlockAssessmenttest::StoringFocusArea.where(account_id: @current_user&.id).last
			focus_areas = storing_focus_area&.focus_areas_id
			
			# Handle various data formats (string, array, nil)
			if focus_areas.is_a?(String)
				focus_areas = JSON.parse(focus_areas) rescue []
			end
			focus_areas = [] if focus_areas.nil? || !focus_areas.is_a?(Array)
			focus_areas = focus_areas.flatten.map(&:to_i)
			
			Rails.logger.info "GoalsController#create: account_id=#{@current_user&.id}, focus_areas=#{focus_areas.inspect}, requested_focus_area_id=#{params[:focus_area_id]}"
			
		if focus_areas.present? && focus_areas.include?(params[:focus_area_id].to_i)
			begin
				@goal = BxBlockAssessmenttest::Goal.new(create_params.merge(account_id: @current_user&.id, focus_area_id: params[:focus_area_id].to_i))
				# change the goal length 25 to 50
				return render json: {error: "Goal should not be more than 50 letter"},status: :unprocessable_entity if @goal.goal.to_s.length >= 50
				
				Rails.logger.info "GoalsController#create: Parsing date=#{@goal.date.inspect}, time_slot=#{@goal.time_slot.inspect}"
				
				# Parse date and time more safely
				if @goal.date.present? && @goal.time_slot.present?
					parsed_date = DateTime.parse(@goal.date.to_s)
					parsed_time = Time.parse(@goal.time_slot)
					utc_datetime = parsed_date.change(hour: parsed_time.hour, min: parsed_time.min).in_time_zone('UTC').to_datetime
					@goal.date = utc_datetime.utc.to_s
					Rails.logger.info "GoalsController#create: Converted date to UTC: #{@goal.date}"
				end
				
				if @goal.save
					@goal.update(is_complete: false)
					Rails.logger.info "GoalsController#create: Goal saved successfully, id=#{@goal.id}"
					render json: BxBlockAddress::GoalSerializer.new(@goal).serializable_hash, status: :created
				else
					Rails.logger.error "GoalsController#create: Save failed - #{@goal.errors.full_messages.join(', ')}"
					render json: {errors: @goal.errors}, status: :unprocessable_entity
				end
			rescue => e
				Rails.logger.error "GoalsController#create: Exception - #{e.class}: #{e.message}"
				Rails.logger.error e.backtrace.first(5).join("\n")
				render json: {error: "Failed to create goal: #{e.message}"}, status: :unprocessable_entity
			end
		else
			Rails.logger.warn "GoalsController#create: Invalid focus area. Requested: #{params[:focus_area_id]}, Available: #{focus_areas.inspect}"
			return render json: {error: "invalid focus area"},status: :unprocessable_entity
		end
		end


		def update
			return render json: {error: "Goal should not be more than 50 letter"},status: :unprocessable_entity if update_params[:goal].length >= 50
			@goal = BxBlockAssessmenttest::Goal.find_by(id: params[:id])
			if @goal&.present?
				@goal.update(update_params)
				render json: BxBlockAddress::GoalSerializer.new(@goal, meta:{message: "updated successfully"}).serializable_hash, status: :ok
			else
				render json: {errors: [message: "goal not found/updated"]}, status: :unprocessable_entity
			end
		end

		def current_goals
			
			@cur_goals = @current_user&.goals&.all.order(created_at: 'desc').where(is_complete: false)
			if @cur_goals.present?
				render json: BxBlockAddress::GoalSerializer.new(@cur_goals).serializable_hash, status: :ok 
			else
				render json: {message: "goals not found"}, status: :unprocessable_entity
			end
		end

		def completed_goals
			@goals = @current_user&.goals.all.order(created_at: 'desc').where(is_complete: true)
			if @goals.present?
				render json: BxBlockAddress::GoalSerializer.new(@goals).serializable_hash, status: :ok				
			else
				render json: {message: "goals not found"}, status: :unprocessable_entity
			end
		end

		def goal_boards
			if @current_user.present?
				goals = @current_user.goals
				goals.map do|obj|
					if obj.date.present? && (Time.now.utc + 5*60*60 +30*60) >= obj.date.utc 
						obj.update(is_complete: true)
					end
				end
				render json: BxBlockAddress::GoalBoardSerializer.new(@current_user).serializable_hash, status: :ok 
			end
		end

		def destroy
			@goal = BxBlockAssessmenttest::Goal.find_by(id: params[:id])
			if @goal&.present?
				@goal.destroy
				render json: {message:["Goal Deleted"]},status: :ok
			else
				render json: {message: ["Goal Not Found"]},status: :unprocessable_entity
			end
		end

		private
		def account_user
			@current_user = AccountBlock::Account.find_by(id: @token.id)
		end

		def create_params
			params.permit(:goal, :date, :time_slot)
		end

		def update_params
			params.permit(:goal, :is_complete, :date, :time_slot)
		end
	end
end
