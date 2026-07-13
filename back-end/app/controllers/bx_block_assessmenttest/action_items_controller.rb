module BxBlockAssessmenttest
	class ActionItemsController < ApplicationController
		include BuilderJsonWebToken::JsonWebTokenValidation
		include Pagy::Backend
		protect_from_forgery with: :null_session
		before_action :validate_json_web_token
   	    before_action :track_login, only: [:start_game]
		before_action :account_user
	def create
		@action = BxBlockAssessmenttest::ActionItem.new(create_params.merge(account_id: @current_user.id))
		return render json: {error: "Action item should not be more than 50 letter"},status: :unprocessable_entity if @action.action_item.length >= 50

		begin
			parsed_date = Date.strptime(params[:date], '%d/%m/%Y')
		rescue ArgumentError, TypeError
			begin
				parsed_date = Date.parse(params[:date])
			rescue
				return render json: {error: "Invalid date format. Use DD/MM/YYYY"}, status: :unprocessable_entity
			end
		end

		if params[:time_slot].present?
			begin
				parsed_time = Time.parse(params[:time_slot])
				ist_datetime = parsed_date.to_datetime.change(hour: parsed_time.hour, min: parsed_time.min)
				utc_datetime = ist_datetime - Rational(5, 24) - Rational(30, 1440)
			rescue
				utc_datetime = parsed_date.to_datetime
			end
		else
			utc_datetime = parsed_date.to_datetime
		end

		@action.date = utc_datetime.utc.to_s
		@action.is_complete = false
		if @action.save
			render json: BxBlockAddress::ActionItemSerializer.new(@action).serializable_hash, status: :created
		else
			render json: {errors: [message: "Action item not created"]},status: :unprocessable_entity
		end
	end

		def update
			return render json: {error: "Action item should not be more than 50 letter"},status: :unprocessable_entity if update_params[:action_item].present? && update_params[:action_item].length >= 50
			@action = BxBlockAssessmenttest::ActionItem.find_by(id: params[:id])
			if @action.present?
				attrs = update_params.to_h

				if attrs['date'].present?
					begin
						parsed_date = Date.strptime(attrs['date'], '%d/%m/%Y')
					rescue ArgumentError, TypeError
						begin
							parsed_date = Date.parse(attrs['date'])
						rescue
							return render json: {error: "Invalid date format"}, status: :unprocessable_entity
						end
					end

					if attrs['time_slot'].present?
						begin
							parsed_time = Time.parse(attrs['time_slot'])
							ist_datetime = parsed_date.to_datetime.change(hour: parsed_time.hour, min: parsed_time.min)
							attrs['date'] = (ist_datetime - Rational(5, 24) - Rational(30, 1440)).utc.to_s
						rescue
							attrs['date'] = parsed_date.to_datetime.utc.to_s
						end
					else
						attrs['date'] = parsed_date.to_datetime.utc.to_s
					end
				end

				@action.update(attrs)
				render json: BxBlockAddress::ActionItemSerializer.new(@action, meta:{message: "updated successfully"}).serializable_hash, status: :ok
			else
				render json: {errors: [message: "Action item not found/updated"]}, status: :unprocessable_entity
			end
		end

	def current_actions
		expired = @current_user&.action_items.where("is_complete = ? OR is_complete IS NULL", false).where("date IS NOT NULL AND date <= ?", Time.now.utc)
		expired.update_all(is_complete: true) if expired.any?

		@actions = @current_user&.action_items.where("is_complete = ? OR is_complete IS NULL", false).order(created_at: 'desc')
		if @actions.any?
			pagy, @actions = pagy(@actions, page: params[:page_no], items: params[:per_page])
			render json: BxBlockAddress::ActionItemSerializer.new(@actions, params: {current_user_id: @current_user.id}, meta: pagy_metadata(pagy)).serializable_hash, status: :ok
		else
			render json: { data: [] }, status: :ok
		end
	end

		def destroy
			@action = BxBlockAssessmenttest::ActionItem.find_by(id: params[:id])
			if @action.present?
				@action.destroy
				render json: {message:["Action Deleted"]}, status: :ok
			else
				render json: {message: ["Action Not Found"]}, status: :unprocessable_entity
			end
		end

		# def complete
		# 	@action = BxBlockAssessmenttest::ActionItem.find_by(id: params[:id])
		# 	if @action.present?
		# 		if !@action.completed == true
		# 			@action.update(completed: true)
		# 			render json: {message:["Action Completed"]}
		# 		else
		# 			render json: {message:["Action Already Completed"]}
		# 		end
		# 	else
		# 		render json: {message: ["Action Not Found"]}
		# 	end
		# end

		# def complete_date
		# 	@action = BxBlockAssessmenttest::ActionItem.find_by(id: params[:id])
		# 	if @action.present?
		# 		if !@action.completed == true
		# 			@action.update(date: params[:date], completed: true)
		# 			render json: {message:["action will complete till:", "#{params[:date]}"]}
		# 		else
		# 			render json: {message:["Action Already Completed"]}
		# 		end
		# 	else
		# 		render json: {message: ["Action Not Found"]}
		# 	end
		# end

		def start_game
			if account_user
        render json: {message: "Games started"}, status: 200
      end
    end

		private

		def account_user
			@current_user = AccountBlock::Account.find_by(id: @token.id)
		end

		def create_params
			params.permit(:action_item, :date, :time_slot)
		end

		def update_params
			params.permit(:action_item, :is_complete, :date, :time_slot)
		end

    def track_login
      return if current_admin_user

      validate_json_web_token if request.headers[:token] || params[:token]

      return unless @token
      account = AccountBlock::Account.find(@token.id)
      return unless account&.role_id.present?

      if account and AccountBlock::Account.find(account&.id).role_id == BxBlockRolesPermissions::Role.find_by_name(:employee).id
        BxBlockTimeTrackingBilling::TimeTrackService.call(AccountBlock::Account.find(account.id), true)
      end
    end
	end
end
