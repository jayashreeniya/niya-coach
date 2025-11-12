module BxBlockProfile
  class ProfilesController < ApplicationController
      include BuilderJsonWebToken::JsonWebTokenValidation
      before_action :validate_json_web_token
      before_action :account_detail, :only => [:update_profile, :update_bio, :profile_details, :profile_update]


    # def create
    #   # @profile = current_user.create_profile(profile_params)
    #   @profile = BxBlockProfile::Profile.create(profile_params.merge({account_id: current_user.id}))

    #   if @profile.save
    #     render json: BxBlockProfile::ProfileSerializer.new(@profile
    #     ).serializable_hash, status: :created
    #   else
    #     render json: {
    #       errors: format_activerecord_errors(@profile.errors)
    #     }, status: :unprocessable_entity
    #   end
    # end

    # def show
    #   profile = BxBlockProfile::Profile.find(params[:id])
    #   if profile.present?
    #     render json: ProfileSerializer.new(profile).serializable_hash,status: :ok
    #   else
    #     render json: {
    #       errors: format_activerecord_errors(profile.errors)
    #     }, status: :unprocessable_entity
    #   end
    # end

    # def update
    #   status, result = UpdateAccountCommand.execute(@token.id, update_params)

    #   if status == :ok
    #     serializer = AccountBlock::AccountSerializer.new(result)
    #     render :json => serializer.serializable_hash,
    #       :status => :ok
    #   else
    #     render :json => {:errors => [{:profile => result.first}]},
    #       :status => status
    #   end
    # end


    # def destroy
    #   profile = BxBlockProfile::Profile.find(params[:id])
    #   if profile.present?
    #     profile.destroy
    #     render json:{ meta: { message: "Profile Removed"}}
    #   else
    #     render json:{meta: {message: "Record not found."}}
    #   end
    # end

    # def update_bio
    #   # profile = BxBlockProfile::Profile.find_by(id: params[:id])
    #   # profile.update(profile_params)
    #   # if profile&.photo&.attached?
    #   #   render json: ProfileSerializer.new(profile, meta: {
    #   #       message: "Profile Updated Successfully"
    #   #     }).serializable_hash, status: :ok
    #   # else
    #   #   render json: {
    #   #     errors: format_activerecord_errors(profile.errors)
    #   #   }, status: :unprocessable_entity
    #   # end
    #   already_account_phone = AccountBlock::Account.where(full_phone_number: params[:full_phone_number]).last
    #   unless params[:profile][:full_name].match?(/\A[A-Za-z\s]+\z/)
    #     return render json: {error: "can only contain 20 letters no special character"}, status: :unprocessable_entity
    #   end
    #   if already_account_phone.present? &&  @account.present?
    #     @message =  "phone number already present"
      
    #   elsif @account.present?
    #     @account.update(full_name: params[:full_name]) if params[:full_name].present?
    #     @account.update(email: params[:email])  if params[:email].present?
    #     @account.update(access_code: params[:access_code]) if params[:access_code].present?
    #     @account.update(gender: params[:gender]) if params[:gender].present?
    #     @account.update(full_phone_number: params[:full_phone_number]) if params[:full_phone_number].present?
    #     @account.update(image: params[:image]) if params[:image].present?

    #   else
    #      @message =  "Account Not Found"
    #   end
    #   if @message.present? 
    #     render json: {errors: @message}, status: :unprocessable_entity
    #   else   
    #     render json: AccountBlock::AccountSerializer.new(@account, params:{url: request.base_url}).serializable_hash, status: :ok
    #   end 
    # end

    def update_bio
      return render json: { error: "can only contain 20 letters no special character" }, status: :unprocessable_entity unless params[:profile][:full_name].match?(/\A[A-Za-z\s]+\z/)
      phone_number = params[:full_phone_number] || params[:profile][:full_phone_number]
      already_account_phone = AccountBlock::Account.find_by(full_phone_number: phone_number)
      already_account_email = AccountBlock::Account.find_by(email: params[:profile][:email])
      @account ||= AccountBlock::Account.find_by(id: params[:id])
      if already_account_phone.present? && @account.present? && already_account_phone&.id != @account&.id
        @message = "phone number already present"
      elsif already_account_email.present? && @account.present? && already_account_email&.id != @account&.id
        @message = "email already present"
      elsif @account.present?
        attributes_to_update = {
          full_name: params[:profile][:full_name],
          email: params[:profile][:email],
          # access_code: params[:profile][:access_code],
          gender: params[:profile][:gender],
          full_phone_number: params[:profile][:full_phone_number]
        }
          @account.image.attach(params[:profile][:image]) if params[:profile][:image].present?
        attributes_to_update.each do |attribute, value|
          @account[attribute] = value if value.present?
        end
        @account.save
      else
        @message = "Account Not Found"
      end
    
      if @message.present?
        render json: { errors: @message }, status: :unprocessable_entity
      else
        render json: AccountBlock::AccountSerializer.new(@account, params: { url: request.base_url }).serializable_hash, status: :ok
      end
    end

    def user_profiles
      profiles = current_user.profiles
      render json: ProfileSerializer.new(profiles, meta: {
        message: "Successfully Loaded"
      }).serializable_hash, status: :ok
    end

    def profile_details
      unless @account.present?
        render json: {errors: "Account Not Found"}, status: :unprocessable_entity
      end 
      render json: AccountBlock::AccountSerializer.new(@account, params:{url: request.base_url}).serializable_hash, status: :ok     
    end

    def profile_update
      if @account.present?
        @account.update(profile_name: params[:profile_name])
        render json: {message: "Profile name update successfully"}, status: :ok
      else
        render json: {message: "Account not found"}, status: :unprocessable_entity
      end
    end

    private

    def account_detail
      return unless @token
      @account ||= AccountBlock::Account.find(@token.id)
    end

    def update_bio_params
      params.require(:profile).permit(:full_name,:email, :access_code, :gender, :full_phone_number, :image)
    end


    def update_params
      params.require(:data).permit \
        :first_name,
        :last_name,
        :current_password,
        :new_password,
        :new_email,
        :new_phone_number
    end
  end
end
