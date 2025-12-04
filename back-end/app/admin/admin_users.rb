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
      admin_role = BxBlockRolesPermissions::Role.find_by_name('ADMIN')
      if admin_role
        @accounts = AccountBlock::Account.where(role_id: admin_role.id)
      else
        @accounts = AccountBlock::Account.none
      end
    end

    def create
      # Handle email_account type for admin user creation (STI disabled)
      # ActiveAdmin uses snake_case of the model class name as the param key
      account_params_hash = params[:account_block_account] || params['account_block_account'] || params[:account] || params['account'] || {}
      account_type = account_params_hash[:type] || account_params_hash['type']
      
      case account_type
      when 'sms_account'
        # SMS account creation logic (if needed in admin)
        return render json: {errors: [{account: 'SMS accounts cannot be created via admin'}]}, status: :unprocessable_entity

      when 'email_account', nil
        # Use the account_params_hash we already extracted
        account_params = account_params_hash
        
        email = account_params[:email] || account_params['email']
        full_name = account_params[:full_name] || account_params['full_name']
        password = account_params[:password] || account_params['password']
        password_confirmation = account_params[:password_confirmation] || account_params['password_confirmation']
        full_phone_number = account_params[:full_phone_number] || account_params['full_phone_number']
        
        return render json: {errors: [{email: 'Email is required'}]}, status: :unprocessable_entity unless email
        
        query_email = email.downcase
        account = AccountBlock::Account.where('LOWER(email) = ?', query_email).first
        if account.present? 
          return render json: {errors: [{account: 'Email already taken'}]}, status: :unprocessable_entity
        end

        validator = AccountBlock::EmailValidation.new(email)
        password_validator = AccountBlock::PasswordValidation.new(password_confirmation)
        
        is_valid = validator.valid?
        password_valid = password_validator.valid? 

        unless is_valid 
          error_message = validator.errors.full_messages.first
          return render json: {errors: [{Email: error_message}]}, status: :unprocessable_entity
        end
        unless password_valid
          rule = "Password is invalid.Password should be a minimum of 8 characters long,contain both uppercase and lowercase characters,at least one digit,and one special character."
          error_message = password_validator.errors.full_messages.first
          return render json: {errors: [{Password: "#{rule}"}]}, status: :unprocessable_entity
        end  
        
        # Create AccountBlock::Account directly (STI disabled)
        @account = AccountBlock::Account.new(
          email: email, 
          full_name: full_name, 
          password: password, 
          password_confirmation: password_confirmation,
          full_phone_number: full_phone_number
        )
        
        if @account.password == @account.password_confirmation
          admin_role = BxBlockRolesPermissions::Role.find_by_name('ADMIN')
          @account.role_id = admin_role.id if admin_role
          if @account.save(validate: false)  
            @account.update(activated: true)
            redirect_to admin_admin_users_path
          else
            render json: {errors: [{full_phone_number: @account.errors.full_messages}]}, status: :unprocessable_entity
          end
        else
          render json: {errors: [{Password: "Password and Confirm Password Not Matched"}]},
            status: :unprocessable_entity
        end

      when 'social_account'
        return render json: {errors: [{account: 'Social accounts cannot be created via admin'}]}, status: :unprocessable_entity

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
