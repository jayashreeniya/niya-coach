module BxBlockAssessmenttest
  class ApplicationController < ApplicationController
    include BuilderJsonWebToken::JsonWebTokenValidation
    protect_from_forgery with: :null_session

    before_action :validate_json_web_token

    rescue_from ActiveRecord::RecordNotFound, :with => :not_found

    private

    def not_found
      render :json => {'errors' => ['Record not found']}, :status => :not_found
    end
  end
end
