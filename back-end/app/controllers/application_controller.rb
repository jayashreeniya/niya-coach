# Base application controller class to replace ApplicationController
class ApplicationController < ActionController::Base
  # Skip CSRF token verification for JSON API requests
  skip_before_action :verify_authenticity_token, if: :json_request?
  
  private
  
  def json_request?
    request.format.json?
  end
end
