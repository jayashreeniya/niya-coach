# Base application controller class to replace ApplicationController
class ApplicationController < ActionController::Base
  # Add any common controller functionality here
  
  # Helper method to deserialize JSON API formatted params
  # Replaces the missing jsonapi_deserialize from jsonapi-rails gem
  def jsonapi_deserialize(params)
    if params[:data] && params[:data][:attributes]
      params[:data][:attributes].to_unsafe_h
    elsif params[:data]
      params[:data].to_unsafe_h
    else
      params.to_unsafe_h
    end
  end
end
