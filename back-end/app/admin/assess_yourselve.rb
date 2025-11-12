ActiveAdmin.register BxBlockAssessmenttest::AssessYourselfQuestion, as: "Assess Yourself Test Question" do 
     menu parent: "Assess Yourself", label: 'Test Question'
     config.filters = false
  # menu priority: 4
  permit_params :question_title, assess_yourself_answers_attributes: [:id, :answer_title, :_destroy]

  form title: "Assess Yourself Test Question" do |f|
    f.semantic_errors :blah
    f.inputs class: 'question' do
      f.input :question_title,label: 'Question Title'
    end
    f.inputs class: 'multiple_answer' do
      has_many :assess_yourself_answers, heading: "Assess Yourself Answers", new_record: "Add New Assess Yourself Answer", allow_destroy: true do |ans|
        ans.input :answer_title,label: 'Answer Title'
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
      column :assess_yourself_answer_ids
      actions
  end

  show title: "Assess Yourself Answer" do
    attributes_table do
      row "Question" do |top|
        top.question_title
      end
    end
    panel "Answer" do
      table_for resource.assess_yourself_answers do
        column :id
        column "Answer" do |que|
          que.answer_title
        end 
      end
    end
  end 
end

