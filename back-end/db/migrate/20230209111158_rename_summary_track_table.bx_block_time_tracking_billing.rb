class RenameSummaryTrackTable < ActiveRecord::Migration[6.0]
  def change
    rename_table :summary_tracks , :bx_block_time_tracking_billing_summary_tracks
  end
end
