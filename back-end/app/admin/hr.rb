ActiveAdmin.register AccountBlock::Account, as: "HR" do
  menu priority: 7,label: "HR"
  permit_params :full_name, :email, :full_phone_number, :password, :password_confirmation, :access_code   
  FULL_NAME = "Full Name"
  ACCESS_CODE = "Access Code"
  actions :all, except: [:new]
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
      account = AccountBlock::EmailAccount.where('LOWER(email) = ?', params[:account]['email'].downcase).first
      if account&.id != params[:id].to_i && account.present? 
        return render json: {errors: [{account: 'Email already taken'}]}, status: :unprocessable_entity
      end
      full_name = params[:account][:full_name]
      return render json: {errors: [{full_name: "Full name is invalid. It should contain only letters, no special characters, and be between 1 and 30 characters in length."}]}, status: :unprocessable_entity if check_name_validation(full_name) == false
      return render json: {errors: [{full_phone_number: "Invalid or Unrecognized Phone Number"}]}, status: :unprocessable_entity if check_phone_number_validation(params[:account]['full_phone_number']) == false
      if params[:account][:password].present? 
        rule = "Password is invalid.Password should be a minimum of 8 characters long,contain both uppercase and lowercase characters,at least one digit,and one special character."
        return render json: {errors: [{Password: "#{rule}"}]}, status: :unprocessable_entity if check_password_validation(params[:account]['password']) == false
      end
      company = Company.find_by_hr_code(params[:account][:access_code])
      return render json: {errors: [{account: 'Access code was not valid'}]}, status: :unprocessable_entity if !company.present?
    end

    def scoped_collection
      @accounts = AccountBlock::Account.where(role_id: BxBlockRolesPermissions::Role.find_by_name(BxBlockRolesPermissions::Role.names[:hr]).id)
    end

    def create
      if params[:account][:type] == 'email_account'

        @account = AccountBlock::EmailAccount.new(full_name: params[:account][:full_name], email: params[:account][:email], full_phone_number: params[:account][:full_phone_number], password: params[:account][:password], password_confirmation: params[:account][:password_confirmation], access_code: params[:account][:access_code])

        return render json: {errors: [{Password: "Password and Confirm Password Not Matched"}]}, status: :unprocessable_entity if @account.password != @account.password_confirmation

          @account.role_id = BxBlockRolesPermissions::Role.find_by_name(:hr).id
          if @account.save
            @account.update(activated: true)
            redirect_to admin_hrs_path
          else
            render json: {errors: [{full_phone_number: "already exists"}]}, status: :unprocessable_entity
          end
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
      @coach = AccountBlock::Account.find(params[:id]) 
      full_name = params[:account][:full_name]
      unless full_name =~ /^[a-zA-Z ]{1,30}$/ && !full_name.match(/\d/) && !full_name.match(/[^\w\s]/)
        return render json: { errors: [{ full_name: "Full name is invalid. It should contain only letters, no special characters, and be between 1 and 30 characters in length." }] }, status: :unprocessable_entity
      end
      if @coach.update(permitted_params[:account])  
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
        f.input :type, :input_html => { :value => "email_account"}, as: :hidden
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
