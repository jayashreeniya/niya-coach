ActiveAdmin.register BxBlockAssessmenttest::WellBeingFocusArea, as: "WellBeingFocusArea" do
  # menu parent: "Well Being", label: 'well_being'
  menu label: "Well Being Focus Area"
  config.batch_actions = true
 actions :all
  permit_params :answers, :well_being_sub_categoryid
  remove_filter :created_at
  remove_filter :updated_at
  remove_filter :multiple_account
  filter :answers, label: "Answer"
  filter :well_being_sub_categoryid, label: "Well Being Sub Category ID"
  controller do
    before_action :set_form_title, only: [:new, :edit]

    def set_form_title
      if params[:action] == 'new'
        @form_title = "Add New Well Being Focus Area"
      elsif params[:action] == 'edit'
        @form_title = "Edit Well Being Focus Area"
      end
    end
  end

  index :download_links => false do
      id_column
      column :answers
       column "Well Being Sub Category ID", 'well_being_sub_categoryid'
      actions
  end

  

  show do
    attributes_table title: "WellBeingFocusArea" do
      row :answers
      row "Well Being Sub Category Id" do |category|
        category.well_being_sub_categoryid
      end
    end
  end

  form title: proc { @form_title || "Add New Well Being Focus Area" } do |f|
    f.inputs do
      f.input :answers
      f.input :well_being_sub_categoryid ,label: "Well being sub category id", as: :select, collection: WellBeingSubCategory.all.collect{|x|  [x.id.to_i]} 
    end
    f.actions do
      f.submit "Submit"
    end
  end
end
