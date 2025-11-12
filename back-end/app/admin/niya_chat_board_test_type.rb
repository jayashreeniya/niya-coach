ActiveAdmin.register BxBlockAssessmenttest::AssesmentTestType, as: "Niya Chat Board Test Type" do 
   config.filters = false
   menu parent: "Niya Board", label: 'Niya Chat Board Test Type'

  # menu priority: 2
  permit_params :question_title, :assesment_test_answer_id, assesment_test_type_answers_attributes: [:id, :answers, :_destroy]

  controller do 
    before_action :set_form_title, only: [:new, :edit]

    def set_form_title
      if params[:action] == 'new'
        @form_title = "Add Niya Chat Board Test Type"
      elsif params[:action] == 'edit'
        @form_title = "Edit Niya Chat Board Test Type Details"
      end
    end
  end

  form title: proc { @form_title || "Add Niya Chat Board Test Type"} do |f|
    f.semantic_errors :blah
    f.inputs class: 'question' do
      f.input :question_title, label: "Question Title"
      f.input :assesment_test_answer_id, label: "Assesment Test Answer"
      
    end

    f.inputs class: 'multiple_answer' do
      has_many :assesment_test_type_answers, heading: "Assesment Test Type Answer", new_record: "Add New Assesment Test Type Answer", allow_destroy: true do |ans|
        ans.input :answers, label: 'Answer'
      end
    end
    f.actions do
      f.submit "Submit"
    end
  end
  index :download_links => false do
      selectable_column
      column :id
      column :question_title
      column :assesment_test_type_answer_ids
      actions
  end

  show do
    attributes_table do
      row "Question" do |top|
        top.question_title
      end
    end
    panel "Answer" do
      table_for resource.assesment_test_type_answers do
        column :id
        column "Answer" do |que|
          que.answers
        end
        
      end
    end
  end
end


