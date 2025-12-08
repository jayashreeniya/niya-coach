ActiveAdmin.register CoachSpecialization do
  menu label: "Coach Specialization"
  permit_params :expertise, :focus_areas => []
  filter :expertise

  controller do
    def create
      # Clean up focus_areas before creating the record
      if params[:coach_specialization][:focus_areas].is_a?(Array)
        params[:coach_specialization][:focus_areas] = params[:coach_specialization][:focus_areas].reject(&:blank?)
      end
      super
    end

    def update
      # Clean up focus_areas before updating the record
      if params[:coach_specialization][:focus_areas].is_a?(Array)
        params[:coach_specialization][:focus_areas] = params[:coach_specialization][:focus_areas].reject(&:blank?)
      end
      super
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
