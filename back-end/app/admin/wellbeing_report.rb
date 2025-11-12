WELL_BEING_LABEL = "Well Being Report"
ActiveAdmin.register WellbeingScoreReport, as: WELL_BEING_LABEL do
  actions :all, except: [:new, :edit, :destroy]
  menu label: WELL_BEING_LABEL
  permit_params :category_id, :account_id, :category_result, :sub_category_result, :submitted_at
  
  filter :account_id, as: :select, collection: proc { AccountBlock::Account.all.map { |account| [account.full_name, account.id] }}
  # filter :submitted_at, as: :date_range, label: "Submitted Date Range"
  filter :submitted_at
  
  index title: "Well Being Reports", download_links: false do
    selectable_column
    id_column
    column :category_id
    column :account_id do |obj|
      "#{obj.account_id} (#{AccountBlock::Account.find_by_id(obj.account_id)&.full_name})"
    end
    column :submitted_at
    actions
  end

  show title: "Well Being Score Report" do
    attributes_table title: WELL_BEING_LABEL do
      row :account_id
      row :category_id
      row :submitted_at
    end

    panel "Category Result" do
      table_for [well_being_report.category_result] do
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
        if WellBeingCategory.find(resource.category_id).category_name == "Occupational Wellbeing"
          column "Profile Type" do |category|
            category["profile_type"]
          end
        end
      end
    end

    panel "Subcategory Results" do
      table_for well_being_report.sub_category_result do
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
