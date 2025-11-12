ActiveAdmin.register QuestionWellBeing do
  menu parent: "Well Being", label: 'Question Well Being'

  permit_params :question, :category_id, :subcategory_id, :sequence ,answer_well_beings_attributes: [:id, :answer, :score, :_destroy, :_edit]
  remove_filter :answer_well_beings
  remove_filter :created_at
  remove_filter :updated_at

  index :download_links => false do
      selectable_column
      id_column
      column :question
      column :answer, label: 'Options' do | ques|
        ques.answer_well_beings.all.pluck(:answer)
      end
      column :category do |que|
        WellBeingCategory.find_by_id(que.category_id).category_name
      end

      column :sub_category do |que|
        WellBeingSubCategory.find_by_id(que&.subcategory_id)&.sub_category_name if que.subcategory_id
      end
      column :sequence

      actions
  end

  show do
    attributes_table title: "Question Details" do
      row :question
      row :answers, label: 'Options' do | ques|
        ques.answer_well_beings.all.pluck([:answer, :score])
      end
    end
  end

  form title: "Add New Question Well Being" do |f|
    f.inputs do
      f.input :question
      f.input :sequence
      f.input :category_id, as: :select, collection: WellBeingCategory.all.collect{|x| [x.category_name, x.id]}    
      f.input :subcategory_id, as: :select, collection: WellBeingSubCategory.all.collect{|x| [x.sub_category_name, x.id]}
      f.has_many :answer_well_beings, allow_destroy: true do |t|
        t.input :answer
        t.input :score
      end
    end
    f.actions do
      f.submit "Submit"
    end
  end
  
end
