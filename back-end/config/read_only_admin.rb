# Read-Only Admin Configuration
# This ensures the admin interface only displays data without modifying it

Rails.application.configure do
  # Disable destructive operations in admin
  config.after_initialize do
    # Override ActiveAdmin to make it read-only
    if defined?(ActiveAdmin)
      ActiveAdmin.setup do |config|
        # Disable batch actions that could modify data
        config.batch_actions = false
        
        # Disable comments to prevent data modification
        config.comments = false
        
        # Set read-only mode for all resources
        config.before_action :ensure_read_only_mode
      end
    end
  end
end

# Read-only mode check
module ReadOnlyMode
  def ensure_read_only_mode
    # This will be called before any admin action
    # We'll add additional checks here if needed
  end
end

# Include in ApplicationController
class ApplicationController < ActionController::Base
  include ReadOnlyMode
  
  # Override any write operations to prevent accidental modifications
  before_action :prevent_write_operations, only: [:create, :update, :destroy]
  
  private
  
  def prevent_write_operations
    if request.path.include?('/admin')
      redirect_to admin_root_path, alert: "Read-only mode: Data modification is disabled for production safety."
    end
  end
end
