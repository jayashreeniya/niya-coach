class CreateBxBlockTimeTrackingBillingTimeTracks < ActiveRecord::Migration[6.0]
  def change
    create_table :time_tracks do |t|
      t.bigint :account_id
      t.references :company, null: false, foreign_key: true
      t.datetime :start_time
      t.datetime :end_time
      t.bigint :total_time

      t.timestamps
    end
  end
end
