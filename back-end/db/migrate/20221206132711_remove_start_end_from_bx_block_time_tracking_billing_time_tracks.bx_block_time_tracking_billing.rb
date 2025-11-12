class RemoveStartEndFromBxBlockTimeTrackingBillingTimeTracks < ActiveRecord::Migration[6.0]
  def change
    remove_column :time_tracks, :start_time
    remove_column :time_tracks, :end_time
    remove_column :time_tracks, :total_time
  end
end
