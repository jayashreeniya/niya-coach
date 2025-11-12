ActiveAdmin.register AccountBlock::Account, as: "accounts" do
  menu priority: 1, label: "Account"
  actions :all
  permit_params :full_name, :email, :full_phone_number, :password, :password_confirmation, :access_code, :activated, :deactivation, :role_id

  filter :full_name, as: :string, label: "Full Name"
  filter :email, as: :string, label: "Email"
  filter :full_phone_number
  filter :access_code, as: :string, label: "Access Code"
  filter :activated, label: "Activated Account"
  filter :created_month_year, as: :select, collection: -> {
  AccountBlock::Account.where.not(created_month_year: nil).order(created_month_year: :desc).distinct.pluck(:created_month_year).map { |date| date.strftime('%B %Y') }
  }, label: "Created in Month", input_html: { multiple: true }
  

    controller do
      before_action :set_form_title, only: [ :edit]
      before_action :check_accounts ,only: [:index]
      before_action :check_all_validations , only: [:update]
      def set_form_title
        if params[:action] == 'edit'
          @form_title = "Edit Account"
        end
      end

      def check_all_validations
        account = AccountBlock::EmailAccount.where('LOWER(email) = ?', params[:account]['email'].downcase).first
        if account&.id != params[:id].to_i && account.present? 
          return render json: {errors: [{account: 'Email already taken'}]}, status: :unprocessable_entity
        end
      end

      def update
        super do |success, failure|
          if params[:account][:activated]
            resource.update(deactivation: params[:account][:activated] == "1" ? false : true)
          end
        end
      end

      def check_accounts
        destroy_accounts(AccountBlock::Account.where(role_id: BxBlockRolesPermissions::Role.find_by_name(:employee).id), :employee_code)
        destroy_accounts(AccountBlock::Account.where(role_id: BxBlockRolesPermissions::Role.find_by_name(:hr).id), :hr_code)
      end
      
      def destroy_accounts(accounts, access_code_column)
        accounts.each do |obj|
          company = Company.find_by(access_code_column => obj.access_code)
          obj.destroy if company.nil?
        end
      end
    end

    index :title=> "Accounts", :download_links => false do
      selectable_column
      id_column
      column :full_name
      column :email
      column :full_phone_number
      column :access_code
      column :activated
      column "Deactivated", :deactivation 
      column :created_at
      column :updated_at
      actions
    end

    show do
      attributes_table title: "Account Details" do
        row :full_name
        row :email 
        row :full_phone_number
        if resource.role && ['employee', 'hr'].include?(resource.role.name)
          row :access_code
        end
        row :created_at
        row :updated_at
      end

      if resource.role_id == BxBlockRolesPermissions::Role.find_by_name(:employee).id
        panel "Selected Focus Area" do
          table_for BxBlockAssessmenttest::SelectAnswer.where(account_id: resource.id).last do
            column "Focus Area" do |focus_area|
              if focus_area.nil?
                nil
              else
                BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: focus_area.multiple_answers).pluck(:answers)
              end
            end
          end
        end
        panel "Wellbeing Report" do
          table_for WellbeingScoreReport.where(account_id: resource.id).order(created_at: :desc) do
            column "Category Result" do |report|
              panel "Category Result" do
                table_for [report.category_result] do
                  column "Category Name" do |category|
                    category["category_name"]
                  end
          
                  column "Category Score" do |category|
                    category["score"]
                  end
          
                  column "Category Advice" do |category|
                    category["advice"]
                  end
          
                  column "Submitted At" do |category|
                    category["submitted_at"]
                  end
        
                  column "Score Level" do |category|
                    category["score_level"]
                  end

                  if WellBeingCategory.find_by_id(report&.category_id)&.category_name == "Occupational Wellbeing"
                    column "Profile Type" do |category|
                      category["profile_type"]
                    end
                  end
                end
              end
            end
        
            column "Subcategory Results" do |report|
              panel "Subcategory Results" do
                table_for report.sub_category_result do
                  column "Subcategory" do |sub_report|
                    sub_report["sub_category"]
                  end
        
                  column "Subcategory Score" do |sub_report|
                    sub_report["score"]
                  end
        
                  column "Subcategory Advice" do |sub_report|
                    sub_report["advice"]
                  end
                  column "Wellbeing Focus Area" do |sub_report|
                    sub_report["well_being_focus_area"]
                  end
                  column "Top Strength" do |sub_report|
                    sub_report["top_strength"]
                  end
                end
              end
            end
          end
        end
      end
    end

    form title: proc { @form_title || "Add New Account" } do |f|
    f.inputs do
      f.input :full_name,label: "Full Name"
      f.input :email
      f.input :full_phone_number, label: "Full Phone Number"
      f.input :role_id, as: :select, collection: BxBlockRolesPermissions::Role.all.map { |role| [role.name.humanize, role.id] }, label: "Role"
      f.input :password
      f.input :password_confirmation, label: "Password Confirmation"
      f.input :access_code, label: "Access Code", hint: "Required for Employee and HR roles"
      f.input :activated, label: "Active"
    end
    f.actions do
      f.submit 'Submit'
    end
  end


end
