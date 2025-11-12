ActiveAdmin.register BxBlockAssessmenttest::AssessYourselfTestType, as: "AssessYourself Test Type Question" do 
  # menu priority: 5
       menu parent: "Assess Yourself", label: 'Test Type Question'

  permit_params :question_title, :assess_yourself_answer_id, :sequence_number, assess_tt_answers_attributes: [:id, :answer, :answer_score, :_destroy]
  filter :question_title
  form title: "Add Assess Yourself Test Type Question" do |f|
    f.semantic_errors :blah
    f.inputs class: 'question' do
      f.input :question_title, label: 'Question Title'
      f.input :sequence_number, label: 'Sequence Number'
      f.input :assess_yourself_answer_id, label: 'Assess Yourself Answer'

    end

    f.inputs do 
      has_many :assess_tt_answers, heading: "Assess Test Type Answer", new_record: "Add New Assess Test Type", class: 'assessment_test_type_answers', allow_destroy: true do |ans|
        ans.input :answer
        ans.input :answer_score, label: "Answer Score"
      end
    end
    f.actions do
      f.submit 'Submit'
    end
  end

  index :download_links => false do
      selectable_column
      column :id
      column :assess_yourself_answer_id
      column :question_title
      column :sequence_number
      column "Assess Test Type Answer Ids", :assess_tt_answer_ids
      actions
  end

  show do
    attributes_table do
      row "Question" do |top|
        top.question_title
      end
      row "Sequence Number" do |top|
        top.sequence_number
      end
      row "Assess Yourself Answer id" do |top|
        top.assess_yourself_answer_id
      end
    end
    panel "Answer" do
      table_for resource.assess_tt_answers do
        column :id
        column "Answer" do |que|
          que.answer
          que.answer_score
        end 
      end
    end
  end 
end

