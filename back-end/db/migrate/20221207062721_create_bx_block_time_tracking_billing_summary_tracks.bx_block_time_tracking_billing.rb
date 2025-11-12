class CreateBxBlockTimeTrackingBillingSummaryTracks < ActiveRecord::Migration[6.0]
  def change
    create_table :summary_tracks do |t|
      t.bigint :account_id
      t.float :spend_time

      t.timestamps
    end
  end
end
