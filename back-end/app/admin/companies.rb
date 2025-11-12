ActiveAdmin.register Company do
  menu priority: 6, label: "Company"
  permit_params :name, :email, :address, :hr_code, :employee_code
  remove_filter :created_at
  remove_filter :updated_at
  remove_filter :time_tracks
  controller do
    before_action :check_validations , only: [:create ,:update]
    def check_validations 
      return render json: {errors: [{access_code: "Hr Code and Employee Code must be present"}]}, status: :unprocessable_entity if params[:company][:hr_code].blank? || params[:company][:employee_code].blank?
    end

    def scoped_collection
      @companies = Company.all
    end
  end
  controller do
    before_action :set_form_title, only: [:new, :edit]

    def set_form_title
      if params[:action] == 'new'
        @form_title = "Add New Company"
      elsif params[:action] == 'edit'
        @form_title = "Edit Company"
      end
    end

    def destroy
      AccountBlock::Account.where(access_code: Company.find_by_id(params[:id]).employee_code).destroy_all
      Company.find_by_id(params[:id]).destroy
      flash[:alert] = "Company and associated accounts are deleted"
      redirect_to admin_companies_path

    end
  end


  index :title=> "Companies", :download_links => false do
    selectable_column
    id_column
    column :name
    column :email
    column :address
    column :employee_code
    column :hr_code
    actions
  end

  show do |object|
    attributes_table title: "Company Details" do
      row :name
      row :email 
      row :address
      row :employee_code
      row :hr_code
      row :active_hrs do |obj|
        hrs = AccountBlock::Account.where(access_code: obj.hr_code)
        if hrs.present?
          "#{hrs.count}"
        else
          "No Active Hrs"
        end
      end
      row :active_employee do |obj|
        employee = AccountBlock::Account.where(access_code: obj.employee_code)
        if employee.present?
          "#{employee.count}"
        else
          "No Active Employees"
        end
      end
    end

    panel "HR List" do
      hr_accounts = AccountBlock::Account.where(access_code: object.hr_code)
      render "admin/hr_search_form", { object: object }
    
      if params[:hr_name].present?
        # Search for HR accounts by name
        searched_hr_accounts = hr_accounts.where("full_name ILIKE ?", "%#{params[:hr_name]}%")
    
        if searched_hr_accounts.any?
          table_for searched_hr_accounts do
            column "ID" do |hr_account|
              hr_account.id
            end
            column "HR name" do |hr_account|
              hr_account.full_name
            end
            column "HR email" do |hr_account|
              hr_account.email
            end
            column "View HR Details" do |hr_account|
              link_to "View", admin_account_path(hr_account)
            end
          end
        else
          para "No HRs found with the entered name."
        end
      else
        if hr_accounts.present?
          table_for hr_accounts do
            column "ID" do |hr_account|
              hr_account.id
            end
            column "HR name" do |hr_account|
              hr_account.full_name
            end
            column "HR email" do |hr_account|
              hr_account.email
            end
            column "View HR Details" do |hr_account|
              link_to "View", admin_account_path(hr_account)
            end
          end
        else
          para "No HRs found for this company."
        end
      end
    end
  
    panel "Employee List" do
      employee_accounts = AccountBlock::Account.where(access_code: object.employee_code)
      render "admin/employee_search_form", { object: object }
    
      if params[:employee_name].present?
        # Search for employee accounts by name
        searched_employee_accounts = employee_accounts.where("full_name ILIKE ?", "%#{params[:employee_name]}%")
    
        if searched_employee_accounts.any?
          table_for searched_employee_accounts do
            column "ID" do |employee_account|
              employee_account.id
            end
            column "Employee Name" do |employee_account|
              employee_account.full_name
            end
            column "Employee Email" do |employee_account|
              employee_account.email
            end
            column "WellBeing Report" do |employee_account|
              link_to "View", admin_account_path(employee_account)
            end
          end
        else
          para "No Employees found with the entered name."
        end
      else
        if employee_accounts.present?
          table_for employee_accounts do
            column "ID" do |employee_account|
              employee_account.id
            end
            column "Employee Name" do |employee_account|
              employee_account.full_name
            end
            column "Employee Email" do |employee_account|
              employee_account.email
            end
            column "WellBeing Report" do |employee_account|
              link_to "View", admin_account_path(employee_account)
            end
          end
        else
          para "No Employees found for this company."
        end
      end
    end
  end

  form title: proc { @form_title || "Add New Company" } do |f|
    if f.object.new_record?
      f.object.hr_code = SecureRandom.alphanumeric(6)
      f.object.employee_code = SecureRandom.alphanumeric(7)
      f.inputs do
        f.input :name
        f.input :email
        f.input :address
        f.input :employee_code, as: :hidden, label: "Employee Access Code"
        f.input :hr_code,as: :hidden, label: "HR Access Code"
      end
    else
      f.inputs do
        f.input :name
        f.input :email
        f.input :address
        f.input :employee_code, label: "Employee Access Code"
        f.input :hr_code, label: "HR Access Code"
      end
    end
    f.actions do
      f.submit "Submit"
    end
  end
end
