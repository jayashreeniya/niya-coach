ActiveAdmin.register BxBlockAssessmenttest::Motion, as: "Motion" do
	config.filters = false
	menu label: "Motion"
  permit_params :motion_title
  
  index :download_links => false do
      selectable_column
      column :id
      column :motion_title
      column :created_at
      column :updated_at
      actions
  end

  form do |f|
    f.inputs do
      f.input :motion_title
    end
    f.actions
  end 
end

