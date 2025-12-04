ActiveAdmin.register QuestionWellBeing do
  menu parent: "Well Being", label: 'Question Well Being'

  permit_params :question, :category_id, :subcategory_id, :sequence ,answer_well_beings_attributes: [:id, :answer, :score, :_destroy, :_edit]
  remove_filter :answer_well_beings
  remove_filter :created_at
  remove_filter :updated_at

  controller do
    rescue_from StandardError, with: :handle_error

    def handle_error(exception)
      Rails.logger.error "=" * 80
      Rails.logger.error "ERROR IN QUESTION_WELL_BEINGS ADMIN"
      Rails.logger.error "Error class: #{exception.class}"
      Rails.logger.error "Error message: #{exception.message}"
      Rails.logger.error "Error backtrace:"
      Rails.logger.error exception.backtrace.join("\n")
      Rails.logger.error "=" * 80
      raise exception
    end

    def index
      Rails.logger.info "=== QUESTION_WELL_BEINGS INDEX ACTION ==="
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
      Rails.logger.info "=== QUESTION_WELL_BEINGS NEW ACTION ==="
      begin
        super
      rescue => e
        Rails.logger.error "ERROR in new: #{e.class} - #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        raise
      end
    end

    def edit
      Rails.logger.info "=== QUESTION_WELL_BEINGS EDIT ACTION ==="
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
    id_column
    column :question
    column :answer, label: "Options" do |ques|
      ques.answer_well_beings.pluck(:answer).presence || []
    end
    column :category do |que|
      WellBeingCategory.find_by(id: que.category_id)&.category_name || "—"
    end
    column :sub_category do |que|
      WellBeingSubCategory.find_by(id: que.subcategory_id)&.sub_category_name || "—"
    end
    column :sequence
    actions
  end

  show do
    attributes_table title: "Question Details" do
      row :question
      row :answers, label: "Options" do |ques|
        ques.answer_well_beings.pluck(:answer, :score)
      end
    end
  end

  form title: "Add New Question Well Being" do |f|
    f.inputs do
      f.input :question
      f.input :sequence
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
      f.has_many :answer_well_beings, allow_destroy: true do |t|
        t.input :answer
        t.input :score
      end
    end
    f.actions do
      f.submit "Submit"
    end
  end
  
end
