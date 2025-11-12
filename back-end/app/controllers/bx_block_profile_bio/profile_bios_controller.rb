# frozen_string_literal: true

module BxBlockProfileBio
  class ProfileBiosController < ApplicationController
    before_action :load_account, only: %i[show]
    before_action :check_account_activated, only: %i[update show]

    def create
      profile = BxBlockProfileBio::ProfileBio.includes(:account).find_by(accounts: { id: current_user.id })
      if profile.present?
        render json: { errors: [
          { profile: 'Profile has been already created' }
        ] }, status: :unprocessable_entity and return
      end

      begin
        image_data = params[:image].as_json || {}
        validator = BxBlockProfile::UpdateAccountValidator.new(current_user.id, account_update_params, image_data)
        profile_bio = current_user.build_profile_bio(profile_params)

        if profile_bio.valid? && validator.valid? && current_user.update(validator.attributes) && profile_bio.save
          create_location_and_render
        else
          render_create_validation_errors(profile_bio, validator)
        end
      rescue Exception => e
        render json: { errors: [e.message] },
               status: :unprocessable_entity
      end
    end

    def update
      profile = BxBlockProfileBio::ProfileBio.includes(:account)
                .find_by(accounts: { id: current_user.id }, id: params[:id])
      if profile.nil?
        render json: {
          message: "Profile doesn't exists"
        }, status: :not_found and return
      end

      image_data = params[:image].as_json || {}
      validator = BxBlockProfile::UpdateAccountValidator.new(current_user.id, account_update_params, image_data)
      profile.assign_attributes(profile_params)

      if profile.valid? && validator.valid?
        profile.save
        update_profile_bio(profile, validator)
      else
        render json: { errors: [
          { profile: profile.errors.full_messages },
          { account: validator.errors.full_messages }
        ] }, status: :unprocessable_entity
      end
    rescue Exception => e
      render json: { errors: [e.message] },
             status: :unprocessable_entity
    end

    def show
      return if @account.nil?
      find_distance_and_assign_values

      json_data = BxBlockProfileBio::BasicProfileSerializer.new(@account,
        params: { current_user_id: current_user.id }
      ).serializable_hash
      json_data[:favourite] = profile_favourite.present? ? profile_favourite.as_json : {}
      json_data[:like] = profile_like.present? ? profile_like.as_json : {}
      json_data[:is_profile] = @account.profile_bio.present?
      render json: json_data,
             status: :ok
    end

    def fetch_interests
      interests_values = BxBlockProfileBio::ProfileBio::INTERESTS_VALUES
      if params[:search_item].present?
        interests_values = interests_values.select { |item| item.downcase.include?(params[:search_item]) }
      end
      render json: interests_values,
             status: :ok
    end

    def fetch_personalities
      personalities_values = BxBlockProfileBio::ProfileBio::PERSONALITY_VALUES
      if params[:search_item].present?
        personalities_values = personalities_values.select { |item| item.downcase.include?(params[:search_item]) }
      end
      render json: personalities_values,
             status: :ok
    end

    private

    def profile_favourite
      @favourites ||= BxBlockFavourites::Favourite.where(
        favourite_by_id: current_user.id,
        favouriteable_id: @account.id,
        favouriteable_type: 'AccountBlock::Account'
      ).last
    end

    def profile_like
      @profile_like ||= BxBlockLike::Like.where(
        like_by_id: current_user.id,
        likeable_id: @account.id,
        likeable_type: 'AccountBlock::Account'
      ).last
    end

    def find_distance_and_assign_values
      @account.is_favourite = profile_favourite.present?
      @account.is_liked     = profile_like.present?
      return if current_user&.location.blank? || @account&.location.blank?

      @account.distance_away = Geocoder::Calculations.distance_between(
        [current_user.location.latitude, current_user.location.longitude],
        [@account.location['latitude'], @account.location['longitude']],
        units: :km
      ).round(2)
    end

    def update_profile_bio(profile, validator)
      current_user.update(validator.attributes)
      profile.save
      if params[:account_data][:attributes][:address].present?
        current_user.create_location(address: params[:account_data][:attributes][:address])
      end
      render json: BxBlockProfileBio::ProfileBioSerializer.new(current_user.reload).serializable_hash, status: :ok
    end

    def create_location_and_render
      if params[:account_data][:attributes][:address].present?
        current_user.create_location(address: params[:account_data][:attributes][:address])
      end
      serializer = BxBlockProfileBio::ProfileBioSerializer.new(current_user.reload)
      render json: serializer.serializable_hash,
             status: :ok
    end

    def render_create_validation_errors(profile_bio, validator)
      errors_arr = []
      errors_arr << profile_bio.errors.full_messages if profile_bio.errors.present?
      errors_arr << validator.errors.full_messages if validator.errors.present?
      errors_arr << current_user.errors.full_messages if current_user.errors.present?
      render json: { errors: errors_arr }, status: :unprocessable_entity
    end

    def account_update_params
      account_params = params.require(:account_data)[:attributes].permit(
        :new_email, :new_phone_number, :gender,
        :date_of_birth, :age, category_ids: [] )
      return account_params if params[:account_data][:attributes][:full_name].blank?

      full_name = params[:account_data][:attributes][:full_name].split
      account_params[:first_name] = full_name[0] if full_name[0].present?
      account_params[:last_name]  = full_name[1] if full_name[1].present?
      account_params
    end

    def image_params
      params.require(:image).permit \
        :data,
        :filename,
        :content_type
    end

    def profile_params
      params.require(:data)[:attributes].permit(
        :height, :weight, :height_type, :weight_type, :body_type, :mother_tougue,
        :religion, :zodiac, :marital_status, :smoking, :drinking, :looking_for,
        :about_me, :about_business, :category_id, languages: [], personality: [],
        interests: [],
        educations_attributes: %i[id qualification description year_from year_to _destroy],
        achievements_attributes: %i[id title achievement_date detail url _destroy],
        careers_attributes: [:id, :profession, :is_current, :experience_from,
          :experience_to, :payscale, :company_name, :sector, :_destroy, {
            accomplishment: []
          }
        ]
      )
    end

    def load_account
      @account = AccountBlock::Account.find_by(id: params[:id])

      if @account.nil?
        render json: {
          message: "Account doesn't exists"
        }, status: :not_found
      end
    end
  end
end
