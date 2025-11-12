ActiveAdmin.register AccountBlock::Account, as: "admin_user" do
  menu priority: 8, label: "Admin User"
  # include BuilderJsonWebToken::JsonWebTokenValidation
  # before_action :validate_json_web_token
  
  permit_params :email, :full_name, :password, :password_confirmation, :full_phone_number

  filter :full_name, as: :string, label: "Full Name"
  filter :email, as: :string, label: "Email"
  filter :full_phone_number

  controller do
    def scoped_collection
      @accounts = AccountBlock::Account.where(role_id: BxBlockRolesPermissions::Role.find_by_name(BxBlockRolesPermissions::Role.names[:admin]).id)
    end

    def create
      admin = AdminUser.new(email: params[:account][:email], password: params[:account][:password], password_confirmation: params[:account][:password_confirmation])
      admin.save(validate: false)
      case params[:account][:type] #### rescue invalid API format
      when 'sms_account'
        validate_json_web_token

        unless valid_token?
          return render json: {errors: [
            {token: 'Invalid Token'},
          ]}, status: :bad_request
        end

        begin
          @sms_otp = SmsOtp.find(@token[:id])
        rescue ActiveRecord::RecordNotFound => e
          return render json: {errors: [
            {phone: 'Confirmed Phone Number was not found'},
          ]}, status: :unprocessable_entity
        end

        params[:account][:full_phone_number] =
          @sms_otp.full_phone_number
        @account = SmsAccount.new(jsonapi_deserialize(params))
        @account.activated = true
        if @account.save
          render json: SmsAccountSerializer.new(@account, meta: {
            token: encode(@account.id)
          }).serializable_hash, status: :created
        else
          render json: {errors: format_activerecord_errors(@account.errors)},
            status: :unprocessable_entity
        end

      when 'email_account'
        account_params = params["account"]

        query_email = params[:account]['email'].downcase
        account = AccountBlock::EmailAccount.where('LOWER(email) = ?', query_email).first
        if account.present? 
          return render json: {errors: [{account: 'Email already taken'}]}, status: :unprocessable_entity
        end

        validator = AccountBlock::EmailValidation.new(params[:account]['email'])
        password_validator = AccountBlock::PasswordValidation.new(params[:account]['password_confirmation'])
        
        is_valid = validator.valid?
        password_valid = password_validator.valid? 
        
        # error_message = password_validation.errors.full_messages.first

        unless is_valid 
          error_message = validator.errors.full_messages.first
          return render json: {errors: [{Email: error_message}]}, status: :unprocessable_entity
        end
        unless password_valid
          rule = "Password is invalid.Password should be a minimum of 8 characters long,contain both uppercase and lowercase characters,at least one digit,and one special character."
            error_message = password_validator.errors.full_messages.first
            return render json: {errors: [{Password: "#{rule}"}]}, status: :unprocessable_entity
        end  
        @account = AccountBlock::EmailAccount.new(email: params[:account][:email], full_name: params[:account][:full_name], password: params[:account][:password], password_confirmation: params[:account][:password_confirmation],full_phone_number: params[:account][:full_phone_number])
        if @account.password == @account.password_confirmation
          @account.role_id = BxBlockRolesPermissions::Role.find_by_name(:admin).id
          if @account.save(validate: false)  
            @account.update(activated: true)
            redirect_to admin_admin_users_path
          else
            render json: {errors: [{full_phone_number: @account.errors}]}, status: :unprocessable_entity
          end
        else
          render json: {errors: [{Password: "Password and Confirm Password Not Matched"}]},
            status: :unprocessable_entity
        end

      when 'social_account'
        @account = AccountBlock::SocialAccount.new(jsonapi_deserialize(params))
        @account.password = @account.email
        if @account.save
          redirect_to admin_admin_users_path
        else
          render json: {errors: format_activerecord_errors(@account.errors)},
            status: :unprocessable_entity
        end

      else
        render json: {errors: [
          {account: 'Invalid Account Type'},
        ]}, status: :unprocessable_entity
      end
    end
  end



  
  index :title=> "Admin Users", :download_links => false do
    selectable_column
    id_column
    column :email
    column :full_name
    column :full_phone_number
    column :created_at
    column :updated_at
    actions
  end

  show do
    attributes_table title: "Account Details" do
      row :email
      row :full_name
      row :full_phone_number
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.inputs do
      f.input :type, :input_html => { :value => "email_account"}, as: :hidden
      f.input :email
      f.input :full_name, label: "Full Name"
      f.input :full_phone_number, label: 'Full Phone Number'
      f.input :password
      f.input :password_confirmation, label: "Password Confirmation"
    end
    f.actions do
      f.submit 'Submit'
    end
  end


end
