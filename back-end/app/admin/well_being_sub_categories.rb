ActiveAdmin.register WellBeingSubCategory do
  menu parent: "Well Being", label: 'Well Being Sub Category'
  permit_params :sub_category_name, :well_being_category_id

  filter :sub_category_name
  index :download_links => false do
      id_column
      column :sub_category_name
      actions
  end

  show do
    attributes_table title: "Question Details" do
      row :sub_category_name
    end
  end

  form title: "Add New Well Being Sub Category" do |f|
    f.inputs do
      f.input :sub_category_name
      f.input :well_being_category_id, as: :select, collection: WellBeingCategory.all.collect{|x| [x.category_name, x.id]} 
    end
    f.actions do
      f.submit "Submit"
    end
  end
end
