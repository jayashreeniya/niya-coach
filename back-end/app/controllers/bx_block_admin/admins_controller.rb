class BxBlockAdmin::AdminsController < ApplicationController
	include BuilderJsonWebToken::JsonWebTokenValidation

	before_action :validate_json_web_token
	EMAIL_ERR='Email already taken'
	ADMIN_ERR="You are not an admin"
	def create_coach
		if current_user and params[:account][:type] == 'email_account'
			account = AccountBlock::EmailAccount.get_user_email(params[:account]['email'].downcase).first
			return render json: {errors: [{account: EMAIL_ERR}]	}, status: :unprocessable_entity if account.present?
		
			password_validator = AccountBlock::PasswordValidation.new(params[:account]['password_confirmation'])
			password_valid = password_validator.valid?
		
			unless password_valid
				rule = "Password is invalid.Password should be a minimum of 8 characters long,contain both uppercase and lowercase characters,at least one digit,and one special character."
				return render json: {errors: [{Password: "#{rule}"}]}, status: :unprocessable_entity
			end
		
			unless Phonelib.valid?(params[:account]['full_phone_number'])
				return render json: {errors: [{full_phone_number: "Invalid or Unrecognized Phone Number"}]}, status: :unprocessable_entity
			end
			account_expertise=params[:account][:expertise]&.split(",")&.map {|x| x.to_i}
			expertise = CoachSpecialization.where(id: account_expertise).pluck(:expertise)

			@account = AccountBlock::EmailAccount.new(full_name: params[:account][:full_name], email: params[:account][:email], full_phone_number: params[:account][:full_phone_number], password: params[:account][:password], password_confirmation: params[:account][:password_confirmation], expertise: expertise)

			if @account.password == @account.password_confirmation
				@account.role_id = BxBlockRolesPermissions::Role.find_by_name(:coach).id
				if @account.save(validate: false)
				@account.update(activated: true)
				# CoachAvailabilityWorker.perform_in(Time.now+30.seconds, @account.id)
				create_availability(@account)
				render json: AccountBlock::EmailAccountSerializer.new(@account).serializable_hash, status: :created
				else
				render json: {errors: [{full_phone_number: "already exists"}]}, status: :unprocessable_entity
				end
			else
				render json: {errors: [{Password: "Password and Confirm Password Not Matched"}]},
				status: :unprocessable_entity
			end
		end			
	end

	def get_coach
		if current_user and params[:id].present?
			account = AccountBlock::Account.find(params[:id])
			render json: BxBlockAdmin::GetCoachAdminSerializer.new(account, params: {url: request.base_url}), status: 200
		end
	end

	def update_coach
		account = AccountBlock::Account.find(params[:account][:id])
		if current_user and params[:account][:email].present?
			query_email = params[:account]['email']&.downcase
			account = AccountBlock::EmailAccount.where('LOWER(email) = ?', query_email).first
			if account.present?
				return render json: {errors: [{account: EMAIL_ERR}]}, status: :unprocessable_entity
			end
			validator = AccountBlock::EmailValidation.new(params[:account]['email'])

			is_valid = validator.valid?

			unless is_valid
				error_message = validator.errors.full_messages.first
				return render json: {errors: [{Email: error_message}]}, status: :unprocessable_entity
			end
		end
		
		if params[:account][:password].present? and params[:account][:password]!=params[:account][:password_confirmation]
			return render json: {errors: [{password: 'Password and Confirm Password Not Matched'}]}
		end
	    account&.update(coach_params)
		account_expertise=params[:account][:expertise]&.split(",")&.map {|x| x.to_i}
		expertise = CoachSpecialization.where(id: account_expertise).pluck(:expertise)
		account&.expertise=expertise
		account&.image=params[:account][:image]
	    account&.save
	    render json: AccountBlock::AccountSerializer.new(account, params: {url: request.base_url}), status: 200
	end

	def get_hr
		if current_user.role_id == BxBlockRolesPermissions::Role.find_by_name(:admin).id
			account = AccountBlock::Account.find(params[:hr_id]) if params[:hr_id].present?
			hr_details = {full_name: account.full_name, first_name: account.first_name, last_name: account.last_name, email: account.email, mobile_no: account.full_phone_number}
			render json: {data: hr_details}
		else
			render json: {errors: ADMIN_ERR}
		end
	end

	def update_hr
		if current_user.role_id == BxBlockRolesPermissions::Role.find_by_name(:admin).id
			hr_id = params[:account][:hr_id] || params[:hr_id]
			account = AccountBlock::Account.find(hr_id) if hr_id.present?
			if params[:account][:email].present?
				query_email = params[:account]['email']&.downcase
				old_account = AccountBlock::EmailAccount.where('LOWER(email) = ?', query_email).first
				if old_account.present?
					return render json: {errors: [{account: 'Email already taken'}]}, status: :unprocessable_entity
				end
				validator=validate_email(params[:account]['email'])
				if validator
					return render json: {errors: [{Email: validator.errors.full_messages.first}]}, status: :unprocessable_entity
				end
			end

			if account and account.update(update_hr_params)
				render json: {message: "HR profile updated successfully"}, status: 200
			end
		else
			render json: {errors: ADMIN_ERR}
		end
	end

	def delete_hr
		if current_user.role_id == BxBlockRolesPermissions::Role.find_by_name(:admin).id
			begin
				account = AccountBlock::Account.find(params[:hr_id]) if params[:hr_id].present?
			rescue => exception
				account=nil
			end
			
			unless account
				return render json: {errors: "No account found"}
			end
			account.destroy
			render json: {message: "HR deleted successfully"}, status: 200
		else
			render json: {errors: "You are not an admin"}
		end
	end

	private
	def create_availability object
		(Date.today..6.months.from_now).each do |date|
		  	begin
				BxBlockAppointmentManagement::Availability.create!(start_time: "06:00", end_time: "23:00", availability_date: date.strftime("%d/%m/%Y"), service_provider_id: object.id)
		  	rescue => exception
				next
		  	end
		end
	end

	def validate_email(email)
		validator = AccountBlock::EmailValidation.new(email)
		is_valid = validator.valid?
		unless is_valid
			return validator
		end
		return false
	end

	def update_hr_params
		params.require(:account).permit(:full_name, :email, :full_phone_number)
	end

	def coach_params
		params.require(:account).permit(:full_name, :email, :full_phone_number, :password, :password_confirmation, :image)
	end


	def current_user
		return unless @token
    	@current_user ||= AccountBlock::Account.find(@token.id)
	end
end
