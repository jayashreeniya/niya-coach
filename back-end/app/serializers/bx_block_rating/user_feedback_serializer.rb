module BxBlockRating
    class UserFeedbackSerializer < BaseSerializer
        attributes :users_feedback do |object, params|
            users_feedback_for(object, params)
        end

        class << self

            def users_feedback_for(object, params)
                company = Company.where(employee_code: object.access_code)&.last
                rating = BxBlockRating::AppRating.where(account_id: object.id)&.last if object.present?

                image = params[:url]+Rails.application.routes.url_helpers.rails_blob_path(object.image, only_path: true) if object.image.attached? &&  params[:url].present?
                {
                    full_name: object&.full_name,
                    company_name: company&.name,
                    rating:(rating&.app_rating.to_f)&.round(1),
                    feedback: rating&.feedback,
                    code: company&.employee_code,
                    rated_at: rating&.updated_at,
                    image: image
                }
            end
        end
    end
  end
  
