ActiveAdmin.register BxBlockAppointmentManagement::Availability, as: "Availability" do
  config.filters = true
  config.batch_actions = false
  actions :all, except: [:new, :edit] 
  menu label: "Availability"
  permit_params :service_provider_id, :start_time, :end_time, :availability_date, :timeslots, :available_slots_count, availability_slots_attributes: [:id, :from, :to, :sno, :booked_slot, :_destroy]
  filter :service_provider, as: :select, collection: proc { 
    coach_role = BxBlockRolesPermissions::Role.find_by_name("COACH")
    coach_role ? AccountBlock::Account.all.where(role_id: coach_role.id) : []
  }
  filter :availability_date
  index :download_links => true do
    selectable_column
    id_column
    column :service_provider
    # column :start_time
    # column :end_time
    column :availability_date
    # column :timeslots
    # column :available_slots_count
    # column :service_provider_id
    # column :service_provider_id

    actions defaults: false do |availability|
      link_to "View", admin_availability_path(availability), method: :get
    end
  end

  # form do |f|
  #   f.semantic_errors *f.object.errors.keys
  #   f.inputs  do
  #     f.input :service_provider_id
  #     # f.input :start_time
  #     # f.input :end_time
  #     # f.input :availability_date
  #     f.input :timeslots, input_html: { readonly: true }
  #   end
  #   f.inputs  do
  #     has_many :availability_slots, allow_destroy: true do |a|
  #       a.input :from, :as => :select,include_blank: false, collection: ["06:00 AM",
  #                                                 "07:00 AM",
  #                                                 "08:00 AM",
  #                                                 "09:00 AM",
  #                                                 "10:00 AM",
  #                                                 "11:00 AM",
  #                                                 "12:00 PM",
  #                                                 "01:00 PM",
  #                                                 "02:00 PM",
  #                                                 "03:00 PM",
  #                                                 "04:00 PM",
  #                                                 "05:00 PM",
  #                                                 "06:00 PM",
  #                                                 "07:00 PM",
  #                                                 "08:00 PM",
  #                                                 "09:00 PM",
  #                                                 "10:00 PM",   
  #                                                 "11:00 PM"] 
  #       a.input :to, :as => :select,include_blank: false, collection:["06:59 AM",
  #                                               "07:59 AM",
  #                                               "08:59 AM",
  #                                               "09:59 AM",
  #                                               "10:59 AM",
  #                                               "11:59 AM",
  #                                               "12:59 PM",
  #                                               "01:59 PM",
  #                                               "02:59 PM",
  #                                               "03:59 PM",
  #                                               "04:59 PM",
  #                                               "05:59 PM",
  #                                               "06:59 PM",
  #                                               "07:59 PM",
  #                                               "08:59 PM",
  #                                               "09:59 PM",
  #                                               "10:59 PM",
  #                                               "11:59 PM"]
  #     end
  #   end
  #   f.actions
  # end
  show do
    attributes_table do
      row :id
      row :start_time
      row :end_time
      row :availability_date
    end
    panel "Timeslots" do
      table_for resource.timeslots do
        column :sno do |object|
          "#{object["sno"]}"
        end
        column :from do |object|
          "#{object["from"]}"
        end
        column :to do |object|
          "#{object["to"]}"
        end
        column :booked_status do |object|
          "#{object["booked_status"]}"
        end
      end 
    end
      link_to 'Delete Availability', admin_availability_path(resource), method: :delete, data: { confirm: 'Are you sure you want to delete this availability?' }, class: 'button'
  end 
  
  action_item :download_csv, only: :show do
    link_to 'Download CSV', download_csv_admin_availability_path(resource), class: 'button'
  end

  member_action :download_csv, method: :get do
    availability = BxBlockAppointmentManagement::Availability.find(params[:id])
    csv_data = CSV.generate do |csv|
      csv << ['ID', 'Start Time', 'End Time', 'Availability Date']
      csv << [availability.id, availability.start_time, availability.end_time, availability.availability_date]

      # csv << ['S.No', 'From', 'To', 'Booked Status']
      availability.timeslots.each do |slot|
        csv << [slot['sno'], slot['from'], slot['to'], slot['booked_status']]
      end
    end

    send_data csv_data, filename: "availability_#{availability.id}_details.csv"
  end

end
