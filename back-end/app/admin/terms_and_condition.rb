ActiveAdmin.register TermsAndCondition do
  config.filters = false
  permit_params :terms_and_condition_content

  index :download_links => false do
    selectable_column
    column :id
    column :terms_and_condition_content do |terms_and_condition|
      simple_format(terms_and_condition.terms_and_condition_content)
    end
    actions
  end
  
  form title: "Add Terms and condition"do |f|
    f.inputs "Terms and condition" do
      f.input :terms_and_condition_content, as: :quill_editor
    end
    f.actions do
      f.submit "Submit"
    end
  end
  show do |object|
    attributes_table title: "Terms and conditions" do
      row :id
      row :terms_and_condition_content do
        simple_format(object.terms_and_condition_content)
      end
    end
  end
  
end
