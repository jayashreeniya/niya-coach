class AddFlogToBxBlockTimeTrackingBillingTimeTracks < ActiveRecord::Migration[6.0]
  def change
    add_column :time_tracks, :flag, :boolean, default: false
  end
end
