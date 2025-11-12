ActiveAdmin.register BxBlockAssessmenttest::AssesmentTestQuestion, as: "Niya Chat Board" do 
  menu parent: "Niya Board", label: 'Niya Chat Board'
  config.filters = false
  # menu priority: 1
  permit_params :title , :sequence_number, assesment_test_answers_attributes: [:id, :answers, :_destroy]
  controller do 
    before_action :set_form_title, only: [:new, :edit]

    def set_form_title
      if params[:action] == 'new'
        @form_title = "Add New Niya Chat Board"
      elsif params[:action] == 'edit'
        @form_title = "Edit Niya Chat Board"
      end
    end
  end
  form title: proc {@form_title || "Add Niya Chat Board"} do |f|
    f.semantic_errors :blah
    f.inputs class: 'question' do
      f.input :title
      f.input :sequence_number,label: 'Sequence Number'
    end
    f.inputs class: 'multiple_answer' do
      has_many :assesment_test_answers, allow_destroy: true, heading: "Assesment Test Answer", new_record: "Add New Assesment Test Answers" do |ans|
        ans.input :answers
      end
    end
    f.actions do
      f.submit "Submit"
    end
  end
  index :download_links => false do
      selectable_column
      column :id
      column :title
      column :sequence_number
      actions
  end

  show do
    attributes_table do
      row "Question" do |top|
        top.title
      end
    end
    panel "Answer" do
      table_for resource.assesment_test_answers do
        column :id
        column "Answer" do |que|
          que.answers
        end
        
      end
    end
  end
  
end

