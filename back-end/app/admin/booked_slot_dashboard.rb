ActiveAdmin.register  BxBlockAppointmentManagement::BookedSlot, as: "Session Wise Dashboard" do
  config.batch_actions = false
  menu label: "Session Wise Dashboard"
  permit_params :id , :start_time , :end_time , :service_provider_id , :booking_date , :service_user_id, :role_id ,:organisation
  actions :index
  filter :service_provider_id, label: 'Coach',as: :select, collection: proc { AccountBlock::Account.all.where(role_id: BxBlockRolesPermissions::Role.find_by_name("coach").id) }
  filter :service_user_id, label: "Employee", as: :select, collection: proc { AccountBlock::Account.all.where(role_id: BxBlockRolesPermissions::Role.find_by_name("employee").id) }
  filter :organisation, as: :select, collection: proc {Company.all.pluck(:name)}
  filter :booking_date
  filter :status
  index title:  "Session Wise Dashboard Reports", :download_links => false do
    selectable_column
    column :id
    column :coach do |coach|
      begin 
        name = AccountBlock::Account.find(coach.service_provider_id)&.full_name
        if name.blank?
          "#{coach.email}"
        else
          name
        end
      rescue
        "This account with id #{coach.service_provider_id} is deleted"
      end
    end
    
    column :employee do |account|
      begin 
        name = AccountBlock::Account.find(account.service_user_id)&.full_name
        if name.blank?
          "#{account.email}"
        else
          "#{AccountBlock::Account.find(account.service_user_id)&.full_name} (#{account.service_user_id})" 
        end
      rescue
        "This account with id #{account.service_user_id} is deleted"
      end
    end

    column :organisation

    column :booking_date
    column :start_time
    column :end_time
    column :status do |status|
      video_call = VideoCallDetail.find_by(booked_slot_id: status.id)

      current_time = Time.now + 5.hours + 30.minutes 
      start_time = Time.parse(status.start_time)
      
      status_name =
        if current_time <= start_time
          "upcoming"
        elsif !video_call.coach_presence && !video_call.employee_presence 
          "Both missed the call"
        elsif !video_call.coach_presence && video_call.employee_presence 
          "Coach Unavailable"
        elsif video_call.coach_presence && !video_call.employee_presence 
          "Completed (Employee did not join the video call)"
        else
          "Successfully Completed"
        end

      status.status = status_name
      status.save(validate: false)  
      status_name 
    end

    actions
  end

end
