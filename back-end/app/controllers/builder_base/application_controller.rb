module BuilderBase
  class ApplicationController < ::ApplicationController
    # JSONAPI::Deserialization removed - not available in production
    rescue_from ActiveRecord::RecordNotFound, :with => :not_found

    def not_found
      render :json => {'errors' => ['Record not found']}, :status => :not_found
    end
  end
end
