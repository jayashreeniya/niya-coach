module BxBlockTimeTrackingBilling
  class TimeTrack < ApplicationRecord
    self.table_name = :bx_block_time_tracking_billing_time_tracks
    belongs_to :account, class_name: "AccountBlock::Account"

    after_update_commit :update_summary_track
    after_create :create_summary_track


    private

    def create_summary_track
      SummaryTrack.find_or_create_by!(created_at: Date.today.all_day, account_id: account_id)
    end

    def update_summary_track
      summary = SummaryTrack.find_or_create_by!(created_at: Date.today.all_day, account_id: account_id)
      summary.update(spend_time: 0.0)
      track = TimeTrack.where(created_at: Date.today.all_day).where(account_id: account_id)
      track.each do |data|
        minutes = (data.updated_at - data.created_at) / 60
        summary.update(spend_time: (summary.spend_time + minutes))
      end
    end
  end
end
