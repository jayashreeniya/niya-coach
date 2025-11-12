class AccountBlock::RatingsController < ApplicationController
    include BuilderJsonWebToken::JsonWebTokenValidation
    before_action :current_user

    def create
      if is_employee
        if current_user
            if params[:rating][:coach_rating].present?
                unless params[:rating][:coach_id].present?
                    return render json: {errors: "coach_id must be present"}, status: :unprocessable_entity
                end
            end
            coach_rating = BxBlockRating::CoachRating.where("account_id = ? and coach_id = ?", current_user.id, params[:rating][:coach_id]).last if params[:rating][:coach_id].present?
            app_rating = BxBlockRating::AppRating.where(account_id: current_user.id).first
            coach_count = BxBlockRating::CoachRating.where(coach_id: params[:rating][:coach_id])&.count

            # if coach_rating.present?
            #     coach_rating.update(coach_rating_params)
            # else
            if params[:rating][:coach_id].present?
                organisation = Company.find_by(employee_code: AccountBlock::Account.find(current_user.id).access_code).name
                coach_rating = BxBlockRating::CoachRating.create(coach_rating_params.merge({account_id: current_user.id , organisation: organisation}))
            end
            # end

            if params[:rating][:app_rating].present?
                app_rating = BxBlockRating::AppRating.create(app_rating_params.merge({account_id: current_user.id}))
                BxBlockRating::CoachRating.last.update(app_rating: app_rating&.id) if BxBlockRating::CoachRating.last.present?
            end

            total_coach_rating = BxBlockRating::CoachRating.where(coach_id: params[:rating][:coach_id]).pluck(:coach_rating).map {|rat| rat.to_i}
            rating_count = total_coach_rating&.count 
            # total_coach_rating = total_coach_rating&.reduce(0, :+)
            total_coach_rating = total_coach_rating&.sum
            coach_account = AccountBlock::Account.find_by_id(params[:rating][:coach_id]) if params[:rating][:coach_id].present?

            if coach_account.present?
                # average_coach_rating= total_coach_rating.to_f/coach_count.to_f if coach_count.present?
                average_coach_rating = total_coach_rating.to_f/rating_count.to_f 
                coach_account.update(rating: average_coach_rating.to_f)
            end

            if coach_rating&.errors.present? or app_rating&.errors.present?
                render json: {errors: {coach_rating_error: coach_rating&.errors&.full_messages, app_rating: app_rating&.errors&.full_messages}}
            else
                render json: {coach_rating: coach_rating, app_rating: app_rating}
            end
        end
      else
        render json: {message: "Only employee can create feedback"}
      end
    end

    def all_users_feedbacks
        if current_user
            users_feedbacks=[]
            users_app_ratings = BxBlockRating::AppRating.pluck(:account_id, :app_rating).to_h
            users_app_ratings.each do |account_id, rating|
                account=AccountBlock::Account.where(id: account_id)&.last if account_id.present?
                full_name = AccountBlock::Account.where(id: account_id)&.last&.full_name if account_id.present?
                image = request.base_url+Rails.application.routes.url_helpers.rails_blob_path(account&.image, only_path: true) if account&.image&.attached? and account.present?
                if account.present?
                    users_feedbacks<<{id: account_id, full_name: full_name, rating: rating, image: image}
                end
            end
            render json: {data: users_feedbacks}
        end
    end

    #ratings_feedback
    def user_feedback
        if current_user
            user = AccountBlock::Account.where(id: params[:user_id]).last if params[:user_id].present?
            render json: BxBlockRating::UserFeedbackSerializer.new(user, params: {url: request.base_url})
        end
    end

    def delete_ratings
        BxBlockRating::AppRating.destroy_all
        BxBlockRating::CoachRating.destroy_all
        render json: {message: "All data deleted"}
    end

    private
    def current_user
        return unless @token
        @current_user ||= AccountBlock::Account.find(@token.id)
    end

    def coach_rating_params
        params.require(:rating).permit(:coach_rating, :coach_id, :feedback)
    end

    def app_rating_params
        params.require(:rating).permit(:app_rating, :feedback)
    end

    def is_employee
      current_user.role_id == BxBlockRolesPermissions::Role.find_by_name(:employee).id
  end
end
