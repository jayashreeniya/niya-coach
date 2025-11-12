ActiveAdmin.register BxBlockRating::CoachRating, as: "Video Call Feedback" do
  config.batch_actions = false
  permit_params :id , :account_id , :coach_rating, :app_rating, :coach_id, :feedback ,:organisation
  menu label: "Video Call Feedback"
  remove_filter :created_at
  remove_filter :updated_at
  filter :coach_id, label: 'Coach',as: :select, collection: proc { AccountBlock::Account.all.where(role_id: BxBlockRolesPermissions::Role.find_by_name("coach").id) }
  filter :account_id, label: "Employee", as: :select, collection: proc { AccountBlock::Account.all.where(role_id: BxBlockRolesPermissions::Role.find_by_name("employee").id) }
  filter :organisation, as: :select, collection: proc {Company.all.pluck(:name)}
  filter :coach_rating
  filter :app_rating

  actions :index
  index :download_links => false do
    selectable_column
    column :id
    column :account do |account|
      begin 
        "#{AccountBlock::Account.find(account.account_id)&.full_name} (#{account.account_id})"
      rescue
        "This account with id #{account.account_id} is deleted"
      end
    end

    column :organisation 

    column :coach do |account|
      begin 
        "#{AccountBlock::Account.find(account.coach_id)&.full_name} ( #{account.coach_id})"
      rescue
        account.delete
      end
    end

    column :coach_rating
    column :experience_rating do |obj|
      app_rating = BxBlockRating::AppRating.where(account_id: obj.account_id, id: obj.app_rating)&.last
      app_rating&.app_rating || 0
    end

    column :feedback do |feedback|
      if feedback.feedback.blank? || feedback.feedback.blank?
        "No Feedback for this coach" 
      else
        feedback.feedback
      end
    end

    actions
  end
  
end
