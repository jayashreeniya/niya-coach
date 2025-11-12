ActiveAdmin.register PrivacyPolicy do
  config.filters = false
  menu label: "Privacy Policy"
  permit_params :policy_content
  controller do
    before_action :set_form_title, only: [:new, :edit]

    def set_form_title
      if params[:action] == 'new'
        @form_title = "Add Policy Content"
      elsif params[:action] == 'edit'
        @form_title = "Edit Policy Content"
      end
    end
  end

  index :download_links => false do
    selectable_column
    column :id
    column :policy_content do |policy_content|
      simple_format(policy_content.policy_content)
    end
    actions
  end
  
  form title: proc { @form_title || "Add Policy Content" } do |f|
    f.inputs "policy_content" do
      f.input :policy_content, as: :quill_editor
    end
    f.actions do
      f.submit "Submit"
    end
  end
  show do |object|
    attributes_table title: "Policy Content" do
      row :id
      row :policy_content do
        simple_format(object.policy_content)
      end
    end
  end
end
