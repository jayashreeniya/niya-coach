ActiveAdmin.register BxBlockTimeTrackingBilling::SummaryTrack do
  config.batch_actions = false
  actions :all, except: [:destroy, :new, :edit]

  menu label: "Summary Track Record"
  filter :account, as: :select, collection: proc { AccountBlock::Account.all.pluck(:full_name, :id) }
  remove_filter :spend_time, :created_at, :updated_at
  index :title=> "Summary Track Records", :download_links => false do
    selectable_column
    id_column
    column :account do |summary|
      user_data = summary&.account&.full_name.blank? ? summary&.account&.email : summary&.account&.full_name 
      link_to "#{user_data}", admin_account_path(summary&.account) 
    end 
    column :spend_time do |track|
      ActiveSupport::Duration.build((track.spend_time * 60 ).to_i.abs).inspect
    end
    column :created_at
    actions
  end

  show do
    attributes_table title: "Record" do
      row :account do |summary|
        link_to "#{summary.account.full_name}", admin_account_path(summary.account)
      end
      row :updated_at
      row :spend_time do |track|
        ActiveSupport::Duration.build((track.spend_time * 60 ).to_i.abs).inspect
      end

      panel "Billing" do
        table do
          thead do
            tr do
              ['Months', 'Total Spend Time' ,'Billing'].each &method(:th)
            end
          end
          tbody do
            resource.account.summary_tracks.group_by { |m| m.created_at.beginning_of_month }.sort.reverse.each do |key, value|
              tr do
                td do
                  "#{key.strftime("%B")}, #{key.year}"
                end
                td do
                  "#{ActiveSupport::Duration.build((value.pluck(:spend_time).sum * 60 ).to_i.abs).inspect}"
                end
                td do
                  billing = 0
                  time = value.pluck(:spend_time).sum.to_f/60
                  if  time >= 1
                    billing = time.to_i * 80
                    "#{billing/80} USD"
                  else
                    "#{billing} USD"
                  end
                end
              end
            end
          end
        end
      end

    end
  end
end
