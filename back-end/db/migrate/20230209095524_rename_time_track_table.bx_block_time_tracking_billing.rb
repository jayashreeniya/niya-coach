class RenameTimeTrackTable < ActiveRecord::Migration[6.0]
  def change
    rename_table :time_tracks , :bx_block_time_tracking_billing_time_tracks
  end
end
