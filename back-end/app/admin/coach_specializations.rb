ActiveAdmin.register CoachSpecialization do
  menu label: "Coach Specialization"
  permit_params :expertise, :focus_areas => []
  filter :expertise

  controller do
    before_action :clean_focus_areas_params, only: [:create, :update]

    def clean_focus_areas_params
      if params[:coach_specialization] && params[:coach_specialization][:focus_areas].is_a?(Array)
        # Remove blank values and convert to integers
        params[:coach_specialization][:focus_areas] = params[:coach_specialization][:focus_areas]
          .reject(&:blank?)
          .map { |v| v.to_i }
          .reject(&:zero?)
      end
    end
    
    def create
      @coach_specialization = CoachSpecialization.new(permitted_params[:coach_specialization])
      
      if @coach_specialization.save
        redirect_to admin_coach_specializations_path, notice: 'Coach Specialization was successfully created.'
      else
        flash.now[:error] = @coach_specialization.errors.full_messages.join(", ")
        render :new
      end
    end
    
    def update
      @coach_specialization = CoachSpecialization.find(params[:id])
      
      if @coach_specialization.update(permitted_params[:coach_specialization])
        redirect_to admin_coach_specializations_path, notice: 'Coach Specialization was successfully updated.'
      else
        flash.now[:error] = @coach_specialization.errors.full_messages.join(", ")
        render :edit
      end
    end
  end
  
  index :download_links => false do 
    selectable_column
    id_column
    column :expertise
    column "Focus Areas" do |cs|
      if cs.focus_areas.is_a?(Array)
        cs.focus_areas.map { |id| 
          BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_by(id: id)&.answers 
        }.compact.join(", ")
      else
        cs.focus_areas
      end
    end
    column :created_at
    column :updated_at
    actions
  end

  show do
    attributes_table do
      row :id
      row :expertise
      row "Focus Areas" do |cs|
        if cs.focus_areas.is_a?(Array)
          cs.focus_areas.map { |id| 
            BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_by(id: id)&.answers 
          }.compact.join(", ")
        else
          cs.focus_areas
        end
      end
      row :created_at
      row :updated_at
    end
  end

  form do |f|
    f.inputs "Coach Specialization Details" do
      f.input :expertise, hint: "E.g., Anxiety Depression, Stress Management"
      f.input :focus_areas, 
        as: :check_boxes, 
        collection: BxBlockAssessmenttest::AssesmentTestTypeAnswer.all.order(:id).map { |x| [x.answers, x.id] },
        label: 'Focus Areas',
        hint: "Select at least one focus area that matches this expertise"
    end
    f.actions do
      f.submit "Save"
      f.cancel_link
    end
  end
end
