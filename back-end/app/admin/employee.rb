ActiveAdmin.register AccountBlock::Account, as: "Employee" do
  # menu priority: 7
  config.batch_actions = false
  menu label: "Emotional Journey"
  actions :all, except: [:new, :destroy, :edit]
  permit_params :full_name, :email, :full_phone_number, :password, :password_confirmation, :access_code   

  filter :full_name, as: :string, label: "Full Name"
  filter :email, as: :string, label: "Email"
  filter :full_phone_number
  filter :access_code, as: :select, label: "Company Name", collection: proc { Company.all.pluck(:name, :employee_code) }
  
  controller do
    def scoped_collection
      employee_role = BxBlockRolesPermissions::Role.find_by_name('EMPLOYEE')
      if employee_role
        @accounts = AccountBlock::Account.where(role_id: employee_role.id)
      else
        @accounts = AccountBlock::Account.none
      end
    end
  end

   index :title=> "Emotional Journey", :download_links => false do
    selectable_column
    id_column
    column :full_name
    column :email
    column :full_phone_number
    column :access_code
    column :company_name do |employee| 
      company = Company&.find_by_employee_code("#{employee.access_code}")
      company&.name
    end
    column :created_at
    column :updated_at
    actions
  end
  show do
    attributes_table title: "Employee Emotional Journey Details" do
      row :full_name
      row :email 
      row :full_phone_number
      row :access_code
      row :company_name do |employee| 
        company = Company&.find_by_employee_code("#{employee.access_code}")
        company&.name
      end
      row :created_at
      row :updated_at
    end
    panel "Employee Emotional Journey" do
      select_motions = resource.select_motions.order(created_at: :desc).limit(60)
      if select_motions.present?
        table_for select_motions do
          column :id
          column "Date", :motion_select_date
          column :status do |motion|
            BxBlockAssessmenttest::Motion.find_by_id(motion.motion_id).motion_title
          end
          column "Motion Questions" do |obj|
            questions = obj.choose_motion_answers.map do |object|
              BxBlockAssessmenttest::MotionQuestion.find(object.motion_question_id).emo_question
            end
            questions = questions.last 2
            questions.join("<br>").html_safe
          end
          column "Motion Answers" do |obj|
            answers = obj.choose_motion_answers.map do |object|
              BxBlockAssessmenttest::MotionAnswer.find(object.motion_answer_id).emo_answer
            end
            answers = answers.last 2
            answers.join("<br>").html_safe
          end
          column "Please let us know ,what were you upto que" do |obj| 
            data = FocusAreaText.where(submitted_at: obj.motion_select_date.strftime("%Y-%m-%d")).last
            if data.present?
              activity_answer = data.focus_text_box
            else
              activity_answer = "Not Answered"
            end
            "#{activity_answer}".html_safe
          end
        end
      end
    end
  end

end
