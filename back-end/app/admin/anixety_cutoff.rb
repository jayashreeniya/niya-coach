ASSESSMENT_TITLE = "Assessment Score"
ActiveAdmin.register BxBlockAssessmenttest::AnixetyCutoff, as: ASSESSMENT_TITLE do 

  menu parent: "Assess Yourself", label: ASSESSMENT_TITLE
  permit_params :min_score, :max_score, :anixety_title, :category_id ,:color
  filter :anixety_title ,label: "Advice"
  filter :category_id, label: "Category"
  controller do 
    before_action :set_form_title, only: [:new, :edit]

    def set_form_title
      if params[:action] == 'new'
        @form_title = "Add New Assessment Details"
      elsif params[:action] == 'edit'
        @form_title = "Edit Assessment Details"
      end
    end
  end
  index :title=> "Assessment Scores", :download_links => false do
    selectable_column
    id_column
    column :min_score
    column :max_score
    column "Advice", :anixety_title
    column :category_id
    column :color 
    actions
  end

  show title: ASSESSMENT_TITLE do
    attributes_table do
      row :min_score
      row :max_score
      row "Advice" do |resource|
        resource&.anixety_title
      end
      row :category_id
      row :created_at
      row :updated_at
      row :color 
    end
  end


  form title: proc { @form_title || "Add New Assessment Deatils" } do |f|
    f.inputs do
      f.input :min_score,label: 'Min Score'
      f.input :max_score,label: 'Max Score'
      f.input :anixety_title, label: 'Assess Title',as: :text
      f.input :category_id , as: :select,  collection: BxBlockAssessmenttest::AssessYourselfAnswer.pluck(:id)
      f.input :color, as: :select, collection: ['Red', 'Orange', 'Yellow', 'Light-green', 'Green']
    end
    f.actions do
      f.submit 'Submit'
    end
  end 
end

