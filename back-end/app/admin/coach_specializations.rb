ActiveAdmin.register CoachSpecialization do
  menu label: "Coach Specialization"
  permit_params :expertise, :focus_areas => []
  filter :expertise

  controller do
    before_action :clean_focus_areas_params, only: [:create, :update]

    def clean_focus_areas_params
      if params[:coach_specialization] && params[:coach_specialization][:focus_areas].is_a?(Array)
        params[:coach_specialization][:focus_areas].reject!(&:blank?)
      end
    end
  end
  index :download_links => false do 
      selectable_column
      id_column
      column :expertise
      column :focus_areas
      column :created_at
      column :updated_at
      actions
  end

    form  do |f|
      f.inputs do
        f.input :expertise
        f.input :focus_areas, as: :check_boxes, collection: BxBlockAssessmenttest::AssesmentTestTypeAnswer.all.map{|x| [x.answers, x.id]},label: 'Focus Areas'
      end
    f.actions do
      f.submit "Submit"
    end
  end
end
