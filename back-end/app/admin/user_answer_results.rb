ActiveAdmin.register UserAnswerResult do
  menu parent: "Well Being", label: 'User Answer Result'

  permit_params :category_id, :subcategory_id, :advice, :min_score, :max_score, :score_level
  remove_filter :min_score
  remove_filter :max_score
  remove_filter :created_at 
  remove_filter :updated_at

  index :download_links => false do
    selectable_column
    column :id
    column  "Category", :category_id 
    column "SubCategory", :subcategory_id
    column :advice
    column :min_score
    column :max_score
    column :created_at
    column :updated_at
    column :score_level
    actions
  end

  form title: "Add New User Answer Result" do |f|
    f.inputs do
      f.input :category_id, as: :select, collection: WellBeingCategory.all.collect{|x| [x.category_name, x.id]}    
      f.input :subcategory_id, as: :select, collection: WellBeingSubCategory.all.collect{|x| [x.sub_category_name, x.id]}
      f.input :advice
      f.input :min_score
      f.input :max_score
      f.input :score_level
    end
    f.actions do
      f.submit "Submit"
    end
    
  end
  
end
