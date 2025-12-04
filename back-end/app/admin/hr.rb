ActiveAdmin.register AccountBlock::Account, as: "HR" do
  menu priority: 7,label: "HR"
  permit_params :full_name, :email, :full_phone_number, :password, :password_confirmation, :access_code   
  FULL_NAME = "Full Name"
  ACCESS_CODE = "Access Code"
  actions :all
  filter :full_name, as: :string, label: FULL_NAME
  filter :email, as: :string, label: "Email"
  filter :full_phone_number
  filter :access_code, as: :string, label: ACCESS_CODE
  controller do
    before_action :set_form_title, only: [:new, :edit]

    def set_form_title
      if params[:action] == 'new'
        @form_title = "Add New HR"
      elsif params[:action] == 'edit'
        @form_title = "Edit HR"
      end
    end
  end
  
  controller do
    before_action :check_all_validations , only: [:create ,:update]
    def check_all_validations
      account_params = params[:account] || params['account'] || params[:account_block_account] || params['account_block_account'] || {}
      email = account_params[:email] || account_params['email']
      return unless email
      
      account = AccountBlock::Account.where('LOWER(email) = ?', email.downcase).first
      if account&.id != params[:id].to_i && account.present? 
        return render json: {errors: [{account: 'Email already taken'}]}, status: :unprocessable_entity
      end
      full_name = account_params[:full_name] || account_params['full_name']
      return render json: {errors: [{full_name: "Full name is invalid. It should contain only letters, no special characters, and be between 1 and 30 characters in length."}]}, status: :unprocessable_entity if full_name && check_name_validation(full_name) == false
      
      full_phone_number = account_params[:full_phone_number] || account_params['full_phone_number']
      return render json: {errors: [{full_phone_number: "Invalid or Unrecognized Phone Number"}]}, status: :unprocessable_entity if full_phone_number && check_phone_number_validation(full_phone_number) == false
      
      password = account_params[:password] || account_params['password']
      if password.present? 
        rule = "Password is invalid.Password should be a minimum of 8 characters long,contain both uppercase and lowercase characters,at least one digit,and one special character."
        return render json: {errors: [{Password: "#{rule}"}]}, status: :unprocessable_entity if check_password_validation(password) == false
      end
      access_code = account_params[:access_code] || account_params['access_code']
      company = Company.find_by_hr_code(access_code) if access_code
      return render json: {errors: [{account: 'Access code was not valid'}]}, status: :unprocessable_entity if access_code && !company.present?
    end

    def scoped_collection
      hr_role = BxBlockRolesPermissions::Role.find_by_name('HR')
      if hr_role
        @accounts = AccountBlock::Account.where(role_id: hr_role.id)
      else
        @accounts = AccountBlock::Account.none
      end
    end

    def create
      account_params = params[:account] || params['account'] || params[:account_block_account] || params['account_block_account'] || {}
      
      @account = AccountBlock::Account.new(
        full_name: account_params[:full_name] || account_params['full_name'],
        email: account_params[:email] || account_params['email'],
        full_phone_number: account_params[:full_phone_number] || account_params['full_phone_number'],
        password: account_params[:password] || account_params['password'],
        password_confirmation: account_params[:password_confirmation] || account_params['password_confirmation'],
        access_code: account_params[:access_code] || account_params['access_code']
      )

      return render json: {errors: [{Password: "Password and Confirm Password Not Matched"}]}, status: :unprocessable_entity if @account.password != @account.password_confirmation

      hr_role = BxBlockRolesPermissions::Role.find_by_name('HR')
      @account.role_id = hr_role.id if hr_role
      if @account.save
        @account.update(activated: true)
        redirect_to admin_hrs_path
      else
        render json: {errors: [{full_phone_number: "already exists"}]}, status: :unprocessable_entity
      end
    end
    
    def check_name_validation(full_name)
      unless full_name =~ /^[a-zA-Z ]{1,30}$/ && !full_name.match(/\d/) && !full_name.match(/[^\w\s]/)
        return false
      end
      true
    end

    def check_phone_number_validation(phone_number)
      unless Phonelib.valid?(phone_number)
        return false
      end
      true
    end

    def check_password_validation(pass_confirmation)
      password = AccountBlock::PasswordValidation.new(pass_confirmation)
      password_valid = password.valid?

      unless password_valid
        return false
      end
      true
    end

    def update
      @hr = AccountBlock::Account.find(params[:id])
      
      # Extract account params from multiple possible keys
      account_params = params[:account] || params['account'] || params[:account_block_account] || params['account_block_account'] || {}
      
      full_name = account_params[:full_name] || account_params['full_name']
      if full_name.present?
        unless full_name =~ /^[a-zA-Z ]{1,30}$/ && !full_name.match(/\d/) && !full_name.match(/[^\w\s]/)
          return render json: { errors: [{ full_name: "Full name is invalid. It should contain only letters, no special characters, and be between 1 and 30 characters in length." }] }, status: :unprocessable_entity
        end
      end
      
      # Build update attributes
      update_attributes = {
        full_name: account_params[:full_name] || account_params['full_name'] || @hr.full_name,
        email: account_params[:email] || account_params['email'] || @hr.email,
        full_phone_number: account_params[:full_phone_number] || account_params['full_phone_number'] || @hr.full_phone_number,
        access_code: account_params[:access_code] || account_params['access_code'] || @hr.access_code
      }
      
      # Only update password if provided
      password = account_params[:password] || account_params['password']
      password_confirmation = account_params[:password_confirmation] || account_params['password_confirmation']
      if password.present?
        update_attributes[:password] = password
        update_attributes[:password_confirmation] = password_confirmation
      end
      
      if @hr.update(update_attributes)
        redirect_to admin_hrs_path
      else
        render :edit
      end
    end
  end


   

  index :title=> "HR's",:download_links => false do
    selectable_column
    id_column
    column :full_name
    column :email
    column :full_phone_number
    column :access_code
    column :created_at
    column :updated_at
    actions
  end

  show do
    attributes_table title: "HR Details" do
      row :full_name
      row :email 
      row :full_phone_number
      row :access_code
      row :created_at
      row :updated_at
    end
  end
  form title: proc { @form_title || "Add New HR" } do |f|
    f.inputs do
      if f.object.new_record?
        f.input :full_name, label: FULL_NAME
        f.input :email
        f.input :full_phone_number, label: "Full Phone Number"
        f.input :password
        f.input :password_confirmation, label: "Password Confirmation"
        f.input :access_code, label: ACCESS_CODE
      else
        f.input :full_name, label: FULL_NAME
        f.input :email
        f.input :full_phone_number, label: "Full Phone Number"
        f.input :password
        f.input :password_confirmation, label: "Password Confirmation"
        f.input :access_code, label: ACCESS_CODE
      end  
    end
    f.actions do
      f.submit "Submit"
    end
  end
end
