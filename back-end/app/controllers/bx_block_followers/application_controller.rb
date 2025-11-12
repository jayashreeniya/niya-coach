module BxBlockFollowers
  class ApplicationController < ApplicationController
    # include BuilderJsonWebToken::JsonWebTokenValidation - BuilderJsonWebToken not available
    # include Pundit - Pundit gem not available

    # before_action :validate_json_web_token - JWT validation removed

    rescue_from ActiveRecord::RecordNotFound, :with => :not_found

    # def current_user - depends on JWT validation which is removed
    #   begin
    #     @current_user = AccountBlock::Account.find(@token.id)
    #   rescue ActiveRecord::RecordNotFound => e
    #     return render json: {errors: [
    #       {message: 'Please login again.'},
    #     ]}, status: :unprocessable_entity
    #   end
    # end

    private

    def not_found
      render :json => {'errors' => ['Record not found']}, :status => :not_found
    end
    def format_activerecord_errors(errors)
        result = []
        errors.each do |attribute, error|
          result << { attribute => error }
        end
        result
    end
  end
end
