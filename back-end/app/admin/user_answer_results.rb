ActiveAdmin.register UserAnswerResult do
  menu parent: "Well Being", label: 'User Answer Result'

  permit_params :category_id, :subcategory_id, :advice, :min_score, :max_score, :score_level
  remove_filter :min_score
  remove_filter :max_score
  remove_filter :created_at 
  remove_filter :updated_at

  controller do
    rescue_from StandardError, with: :handle_error

    def handle_error(exception)
      Rails.logger.error "=" * 80
      Rails.logger.error "ERROR IN USER_ANSWER_RESULTS ADMIN"
      Rails.logger.error "Error class: #{exception.class}"
      Rails.logger.error "Error message: #{exception.message}"
      Rails.logger.error "Error backtrace:"
      Rails.logger.error exception.backtrace.join("\n")
      Rails.logger.error "=" * 80
      raise exception
    end

    def index
      Rails.logger.info "=== USER_ANSWER_RESULTS INDEX ACTION ==="
      Rails.logger.info "Request path: #{request.path rescue 'unknown'}"
      begin
        super
      rescue => e
        Rails.logger.error "ERROR in index: #{e.class} - #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        raise
      end
    end

    def new
      Rails.logger.info "=== USER_ANSWER_RESULTS NEW ACTION ==="
      begin
        super
      rescue => e
        Rails.logger.error "ERROR in new: #{e.class} - #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        raise
      end
    end

    def edit
      Rails.logger.info "=== USER_ANSWER_RESULTS EDIT ACTION ==="
      Rails.logger.info "ID: #{params[:id]}"
      begin
        super
      rescue => e
        Rails.logger.error "ERROR in edit: #{e.class} - #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        raise
      end
    end
  end

  index download_links: false do
    selectable_column
    column :id
    column "Category" do |record|
      WellBeingCategory.find_by(id: record.category_id)&.category_name || "—"
    end
    column "SubCategory" do |record|
      WellBeingSubCategory.find_by(id: record.subcategory_id)&.sub_category_name || "—"
    end
    column :advice
    column :min_score
    column :max_score
    column :score_level
    column :created_at
    column :updated_at
    actions
  end

  form title: "Add New User Answer Result" do |f|
    f.inputs do
      begin
        categories = WellBeingCategory.order(:category_name).map { |x| [x.category_name, x.id] }
        Rails.logger.info "Loaded #{categories.count} categories for form"
        f.input :category_id, as: :select, collection: categories, include_blank: "Select Category"
      rescue => e
        Rails.logger.error "ERROR loading categories: #{e.class} - #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        f.input :category_id, as: :select, collection: [], include_blank: "Select Category"
      end
      begin
        subcategories = WellBeingSubCategory.order(:sub_category_name).map { |x| [x.sub_category_name, x.id] }
        Rails.logger.info "Loaded #{subcategories.count} subcategories for form"
        f.input :subcategory_id, as: :select, collection: subcategories, include_blank: "Select Subcategory"
      rescue => e
        Rails.logger.error "ERROR loading subcategories: #{e.class} - #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        f.input :subcategory_id, as: :select, collection: [], include_blank: "Select Subcategory"
      end
      f.input :advice
      f.input :min_score
      f.input :max_score
      f.input :score_level
    end
    f.actions do
      f.submit "Submit"
    end
    
  end
  
end
