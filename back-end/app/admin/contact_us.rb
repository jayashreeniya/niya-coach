ActiveAdmin.register BxBlockContactUs::Contact, as: "Contact_us" do
    config.filters = false
    menu priority: 10
    actions :all, except: [:new, :edit]
  
  permit_params :description , :account_id 

    index :title=> "Contact Us", :download_links => false do
      selectable_column
      id_column
      column :account
      column :description
      column :created_at
      actions
    end

    show do
      attributes_table title: "Contact" do
        row :account
        row :description
        row :created_at
      end
    end
end
