module AccountBlock
  class AccountsController < ApplicationController
    include BuilderJsonWebToken::JsonWebTokenValidation

    before_action :validate_json_web_token, only: [:search, :update, :get_hr_details, :delete_account]

    def delete_account
      session = JwtDenyList.find_by(account_id: current_user.id)
      if session.present?
        session.update(token: request.headers[:token])
      else
        JwtDenyList.create(token: request.headers[:token], account_id: current_user.id)
      end
      puts "{message: 'Logout Successfully'}"
      if current_user.deactivation == true
        return render json: {message: "Account Already Deleted "}, status: :ok 
      else
        current_user.update(activated: false , deactivation: true)
        return render json: {message: "Account Successfully Deleted. " , data: current_user  } ,status: :ok
      end

    end

    def update
      if current_user
        if current_user.email != params[:account]['email']
          query_email = params[:account]['email'].downcase
          account = EmailAccount.where('LOWER(email) = ?', query_email).first
          if account.present?
            return render json: {errors: [{account: 'Email already taken'}]}, status: :unprocessable_entity
          end
          validator = EmailValidation.new(params[:account]['email'])

          is_valid = validator.valid?

          unless is_valid
            error_message = validator.errors.full_messages.first
            return render json: {errors: [{Email: error_message}]}, status: :unprocessable_entity
          end
        end

        current_user.update(update_coach_params)
        current_user.gender = params[:account][:genders].to_s
        current_user.phone_number = params[:account][:phone_number].to_i
        current_user.save
        render json: AccountBlock::AccountSerializer.new(current_user)
      end
    end

    def get_hr_details
      if current_user.role_id == BxBlockRolesPermissions::Role.find_by_name(:hr).id
        render json: AccountBlock::HrSerializer.new(current_user)
      end
    end

    def privacy_policy
      begin
        file = PrivacyPolicy&.first&.policy_content
        render json: {data: [file]}
      rescue Exception => e
        render json:{errors: [
          {policy: 'No Data Found'},
        ]}
      end
    end

    def term_and_condition
      begin
        file = TermsAndCondition&.first&.terms_and_condition_content
        render json: {data: [file]}
      rescue Exception => e
        render json:{errors: [
          {policy: 'No Data Found'},
        ]},  status: :internal_server_error
      end
    end

    def create
      case params[:data][:type]
      
      when 'email_account'
        create_email_account
      else
        render_invalid_account_type
      end
    end
    
    private

    def create_email_account
      account_params = params["data"]["attributes"]
      device_token = account_params[:device_token]
      query_email = account_params['email'].downcase
      query_phone = account_params['full_phone_number']
    
      account = find_email_account(query_email, query_phone)
    
      if account.present?
        handle_existing_email_account(account, account_params)
      else
        create_new_email_account(account_params, device_token)
      end
    end
    
    def find_email_account(query_email, query_phone)
      EmailAccount.where('LOWER(email) = ?', query_email).first ||
        EmailAccount.where('full_phone_number = ?',  Phonelib.parse(query_phone).sanitized).first
    end
    
    def handle_existing_email_account(account, account_params)
      if account.deactivation == false
        if account[:email] == account_params[:email]
          return render_json_error('Email was already taken', :unprocessable_entity)
        elsif account[:full_phone_number] ==   Phonelib.parse(account_params[:full_phone_number]).sanitized
          return render_json_error('Mobile Number was already taken', :unprocessable_entity)
        end   
      else
        activate_existing_email_account(account, account_params)
      end
    end
    
    def activate_existing_email_account(account, account_params)
      account.update(activated: true, deactivation: false, access_code: account_params[:access_code])
      render_email_account_created(account)
    end
    
    def create_new_email_account(account_params, device_token)
      validator = EmailValidation.new(account_params['email'])
      password_validator = PasswordValidation.new(account_params['password_confirmation'])
    
      if !validator.valid?
        render_json_error({ Email: validator.errors.full_messages.first }, :unprocessable_entity)
      elsif !password_validator.valid?
        rule = "Password should be a minimum of 8 characters long, contain both uppercase and lowercase characters, at least one digit, and one special character."
        render_json_error({ Password: rule }, :unprocessable_entity)
      elsif !Phonelib.valid?(account_params['full_phone_number'])
        render_json_error({ full_phone_number: "Invalid or Unrecognized Phone Number" }, :unprocessable_entity)
      else
        create_and_render_new_email_account(account_params, device_token)
      end
    end
    
    def create_and_render_new_email_account(account_params, device_token)
      @account = EmailAccount.new(full_name: account_params[:full_name], email: account_params[:email], full_phone_number: account_params[:full_phone_number], password: account_params[:password], password_confirmation: account_params[:password_confirmation], access_code: account_params[:access_code])
    
      if @account.password == @account.password_confirmation
        if @account.save
          @account.update(activated: true)
          UserDeviceToken.create(account_id: @account.id, device_token: device_token)
          update_account_status(@account)
          render_email_account_created(@account)
        else
          render_json_error([{ full_phone_number: @account&.errors[:base]&.first }], :unprocessable_entity)
        end
      else
        render_json_error({ Password: "Password and Confirm Password Not Matched" }, :unprocessable_entity)
      end
    end
    
    def update_account_status(account)
      account_role = BxBlockRolesPermissions::Role.find_by_id(account&.role_id)&.name
      if account_role == 'hr' || account_role == 'employee'
        account_status = StatusAudit.where(account_id: account.id)&.last
    
        if account_status&.logged_time&.year != Time.now.year && Time.now.month != account_status&.month.to_i
          StatusAudit.create(account_id: account.id, active: true, logged_time: Time.now, month: Time.now.month)
        end
      end
    end
    
    def render_sms_account_created
      render json: SmsAccountSerializer.new(@account, meta: { token: encode(@account.id) }).serializable_hash, status: :created
    end
    
    def render_email_account_created(account)
      render json: EmailAccountSerializer.new(account, meta: { token: encode(account.id) }).serializable_hash, status: :created
    end
    
    def render_social_account_created
      render json: SocialAccountSerializer.new(@account, meta: { token: encode(@account.id) }).serializable_hash, status: :created
    end
    
    def render_invalid_account_type
      render json: { errors: [{ account: 'Invalid Account Type' }] }, status: :unprocessable_entity
    end
    
    def render_json_error(errors, status)
      errors_hash = errors.is_a?(String) ? [{ account: errors }] : errors
      render json: { errors: errors_hash }, status: status
    end
    
    
    def encode(id)
      BuilderJsonWebToken.encode id
    end

    def search_params
      params.permit(:query)
    end

    def update_coach_params
      params.require(:account).permit(:first_name, :last_name, :gender, :email, :phone_number, :image)
    end

    def current_user
      return unless @token
      @current_user ||= AccountBlock::Account.find(@token.id)
    end

  end
end
