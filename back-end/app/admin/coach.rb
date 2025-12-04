ActiveAdmin.register AccountBlock::Account, as: "coach" do
  menu priority: 5,label: "Coach"
  # include BuilderJsonWebToken::JsonWebTokenValidation
  # before_action :validate_json_web_token
  DATE = "%d/%m/%Y"
  
  permit_params :full_name, :email, :full_phone_number, :password, :password_confirmation, :access_code, :activated,:city, :education, expertise: [], user_languages_attributes: [:id, :language, :_destroy] 
  FULL_NAME = "Full Name"
  filter :full_name, as: :string, label: FULL_NAME
  filter :email, as: :string, label: "Email"
  filter :full_phone_number
  filter :activated, label: "Activated Account"
  after_update :check_activation
  controller do
    before_action :set_form_title, only: [:new, :edit]

    def set_form_title
      if params[:action] == 'new'
        @form_title = "Add New Coach"
      elsif params[:action] == 'edit'
        @form_title = "Edit Coach"
      end
    end
  end


  controller do
    before_action :check_validations , only: [:create ,:update]
    def check_validations
      account_params = params[:account] || params['account'] || params[:account_block_account] || params['account_block_account'] || {}
      email = account_params[:email] || account_params['email']
      return unless email
      
      account = AccountBlock::Account.where('LOWER(email) = ?', email.downcase).first
      if account&.id != params[:id].to_i  &&  account.present? 
        return render json: {errors: [{account: 'Email already taken'}]}, status: :unprocessable_entity 
      end
      full_name = account_params[:full_name] || account_params['full_name']
      return render json: {errors: [{full_name: "Full name is invalid. It should contain only letters, no special characters, and be between 1 and 30 characters in length."}]}, status: :unprocessable_entity if full_name && check_full_name_validation(full_name) == false
      
      full_phone_number = account_params[:full_phone_number] || account_params['full_phone_number']
      return render json: {errors: [{full_phone_number: "Invalid or Unrecognized Phone Number"}]}, status: :unprocessable_entity if full_phone_number && check_phone_validation(full_phone_number) == false
      
      password = account_params[:password] || account_params['password']
      if params[:action] == "create" || (params[:action] == "update" && password.present?)
        rule = "Password is invalid.Password should be a minimum of 8 characters long,contain both uppercase and lowercase characters,at least one digit,and one special character."
        return render json: {errors: [{Password: "#{rule}"}]}, status: :unprocessable_entity if check_pass_validator(password) == false
      end
    end

    def scoped_collection
      coach_role = BxBlockRolesPermissions::Role.find_by_name('COACH')
      if coach_role
        @accounts = AccountBlock::Account.where(role_id: coach_role.id)
      else
        @accounts = AccountBlock::Account.none
      end
    end

    def check_activation object
      unless object.activated
        BxBlockAppointmentManagement::BookedSlot.where(service_provider_id: params[:id]).destroy_all
        slots=nil
        begin
          ActiveRecord::Base.connection.execute("SET datestyle = dmy;")
          slots=BxBlockAppointmentManagement::Availability.where("service_provider_id = ? and Date(availability_date) >=?", object.id, Date.today)
        rescue => exception
          slots=nil
        end
        timeslots = [{"to"=>"06:59 AM", "sno"=>"1", "from"=>"06:00 AM", "booked_status"=>false},
          {"to"=>"07:59 AM", "sno"=>"2", "from"=>"07:00 AM", "booked_status"=>false},
          {"to"=>"08:59 AM", "sno"=>"3", "from"=>"08:00 AM", "booked_status"=>false},
          {"to"=>"09:59 AM", "sno"=>"4", "from"=>"09:00 AM", "booked_status"=>false},
          {"to"=>"10:59 AM", "sno"=>"5", "from"=>"10:00 AM", "booked_status"=>false},
          {"to"=>"11:59 AM", "sno"=>"6", "from"=>"11:00 AM", "booked_status"=>false},
          {"to"=>"12:59 PM", "sno"=>"7", "from"=>"12:00 PM", "booked_status"=>false},
          {"to"=>"01:59 PM", "sno"=>"8", "from"=>"01:00 PM", "booked_status"=>false},
          {"to"=>"02:59 PM", "sno"=>"9", "from"=>"02:00 PM", "booked_status"=>false},
          {"to"=>"03:59 PM", "sno"=>"10", "from"=>"03:00 PM", "booked_status"=>false},
          {"to"=>"04:59 PM", "sno"=>"11", "from"=>"04:00 PM", "booked_status"=>false},
          {"to"=>"05:59 PM", "sno"=>"12", "from"=>"05:00 PM", "booked_status"=>false},
          {"to"=>"06:59 PM", "sno"=>"13", "from"=>"06:00 PM", "booked_status"=>false},
          {"to"=>"07:59 PM", "sno"=>"14", "from"=>"07:00 PM", "booked_status"=>false},
          {"to"=>"08:59 PM", "sno"=>"15", "from"=>"08:00 PM", "booked_status"=>false},
          {"to"=>"09:59 PM", "sno"=>"16", "from"=>"09:00 PM", "booked_status"=>false},
          {"to"=>"10:59 PM", "sno"=>"17", "from"=>"10:00 PM", "booked_status"=>false},
          {"to"=>"11:59 PM", "sno"=>"18", "from"=>"11:00 PM", "booked_status"=>false}]
        slots&.update_all(timeslots: timeslots)
        ActiveRecord::Base.connection.execute("SET datestyle = ymd;")
      end
    end

    def destroy
      AccountBlock::Account.find(params[:id]).destroy
      BxBlockAppointmentManagement::Availability.where(service_provider_id: params[:id]).destroy_all
      BxBlockAppointmentManagement::BookedSlot.where(service_provider_id: params[:id]).destroy_all
      redirect_to admin_coaches_path
    end
    

    def create
      account_params = params[:account] || params['account'] || params[:account_block_account] || params['account_block_account'] || {}
      
      @account = AccountBlock::Account.new(
        full_name: account_params[:full_name] || account_params['full_name'],
        city: account_params[:city] || account_params['city'],
        education: account_params[:education] || account_params['education'],
        email: account_params[:email] || account_params['email'],
        full_phone_number: account_params[:full_phone_number] || account_params['full_phone_number'],
        password: account_params[:password] || account_params['password'],
        password_confirmation: account_params[:password_confirmation] || account_params['password_confirmation'],
        expertise: account_params[:expertise] || account_params['expertise']
      )
        
      if @account.password == @account.password_confirmation
        coach_role = BxBlockRolesPermissions::Role.find_by_name('COACH')
        @account.role_id = coach_role.id if coach_role
        if @account.save
          # Handle user_languages_attributes from various param keys
          languages_params = permitted_params[:account]&.[](:user_languages_attributes) || 
                            permitted_params[:account_block_account]&.[](:user_languages_attributes) ||
                            params[:account]&.[](:user_languages_attributes) ||
                            params['account']&.[]('user_languages_attributes') ||
                            params[:account_block_account]&.[](:user_languages_attributes) ||
                            params['account_block_account']&.[]('user_languages_attributes')
          
          if languages_params.present? && languages_params.is_a?(Hash)
            languages_params.each do |index, language_data|
              next unless language_data.is_a?(Hash)
              language = language_data[:language] || language_data['language']
              @account.user_languages.create(language: language) if language.present?
            end
          end
          @account.update(activated: true, role_id: coach_role.id)
          # CoachAvailabilityWorker.perform_in(Time.now+30.seconds, @account.id)
          redirect_to admin_coaches_path
        else
          render json: {errors: @account.errors.full_messages}, status: :unprocessable_entity
        end
      else
        render json: {errors: [{Password: "Password and Confirm Password Not Matched"}]},
          status: :unprocessable_entity
      end
    end

    def check_full_name_validation(full_name)
      unless full_name =~ /^[a-zA-Z ]{1,30}$/ && !full_name.match(/\d/) && !full_name.match(/[^\w\s]/)
        return false
      end
      true
    end

    def check_phone_validation(full_phone_number)
      unless Phonelib.valid?(full_phone_number)
        return false
      end
      true
    end

    def check_pass_validator(password_confirmation)
      password_validator = AccountBlock::PasswordValidation.new(password_confirmation)
      password_valid = password_validator.valid?

      unless password_valid
        return false
      end
      true
    end

    def update
      @coach = AccountBlock::Account.find(params[:id])
      
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
        full_name: account_params[:full_name] || account_params['full_name'] || @coach.full_name,
        city: account_params[:city] || account_params['city'],
        education: account_params[:education] || account_params['education'],
        email: account_params[:email] || account_params['email'] || @coach.email,
        full_phone_number: account_params[:full_phone_number] || account_params['full_phone_number'] || @coach.full_phone_number,
        expertise: account_params[:expertise] || account_params['expertise'] || @coach.expertise
      }
      
      # Only update password if provided
      password = account_params[:password] || account_params['password']
      password_confirmation = account_params[:password_confirmation] || account_params['password_confirmation']
      if password.present?
        update_attributes[:password] = password
        update_attributes[:password_confirmation] = password_confirmation
      end
      
      # Handle activated status
      activated_value = account_params[:activated] || account_params['activated']
      if activated_value.present?
        activated = activated_value == "1" || activated_value == 1 || activated_value == true
        update_attributes[:activated] = activated
        update_attributes[:deactivation] = !activated
      end
      
      if @coach.update(update_attributes)
        # Handle user_languages_attributes
        languages_params = account_params[:user_languages_attributes] || account_params['user_languages_attributes']
        if languages_params.present? && languages_params.is_a?(Hash)
          # Remove existing user_languages
          @coach.user_languages.destroy_all
          # Create new user_languages
          languages_params.each do |index, language_data|
            next unless language_data.is_a?(Hash)
            language = language_data[:language] || language_data['language']
            @coach.user_languages.create(language: language) if language.present?
          end
        end
        
        redirect_to admin_coaches_path
      else
        render :edit
      end
    end

  end

  
  index :title=> "Coaches", :download_links => false do
    selectable_column
    id_column
    column :full_name
    column :email
    column :full_phone_number
    column :activated
    column :created_at
    column :updated_at
    actions
  end

  show do
    attributes_table title: "Coach Details" do
      row :full_name
      row :email 
      row :full_phone_number
      row :created_at
      row :updated_at
    end
  end

  form title: proc { @form_title || "Add New Coach" } do |f|
    f.inputs do
      if f.object.new_record?
        f.input :full_name,label: FULL_NAME
        f.input :email
        f.input :full_phone_number,label: "Full Phone Number"
        f.input :password
        f.input :password_confirmation,label: "Password Confirmation"
        f.input :education
        f.input :city
        f.input :activated, label: "Active"
        f.has_many :user_languages,heading: "User Language", for: [:user_languages, UserLanguage.new], allow_destroy: true do |t|
          t.input :language
        end
        f.input :expertise, as: :check_boxes, collection: CoachSpecialization.all.pluck(:expertise)
      else
        f.input :full_name,label: FULL_NAME
        f.input :email
        f.input :full_phone_number,label: "Full Phone Number"
        f.input :password
        f.input :password_confirmation,label: "Password Confirmation"
        f.input :education
        f.input :city
        f.input :activated, label: "Active"
        f.has_many :user_languages,heading: "User Language", allow_destroy: true do |t|
          t.input :language
        end
        
        f.input :expertise, as: :check_boxes, collection: CoachSpecialization.all.pluck(:expertise), default: f.object.expertise
      end
    end
    f.actions do
      f.submit "Submit"
    end
  end
end
