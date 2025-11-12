class CreateStatusAudits < ActiveRecord::Migration[6.0]
  def change
    create_table :status_audits do |t|
      t.boolean :active
      t.string :account_id
      t.datetime :logged_time
      t.string :month

      t.timestamps
    end
  end
end
