class AddDefaultValueForSpendTime < ActiveRecord::Migration[6.0]
  def change
    change_column :summary_tracks, :spend_time, :float, default: 0.0
  end
end
