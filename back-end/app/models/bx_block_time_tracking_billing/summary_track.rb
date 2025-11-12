module BxBlockTimeTrackingBilling
  class SummaryTrack < ApplicationRecord
    self.table_name = :bx_block_time_tracking_billing_summary_tracks

    belongs_to :account, class_name: 'AccountBlock::Account', foreign_key: "account_id"
  end
end
