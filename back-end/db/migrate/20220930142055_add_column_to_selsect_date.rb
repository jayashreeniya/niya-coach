class AddColumnToSelsectDate < ActiveRecord::Migration[6.0]
  def change
    add_column :select_motions, :select_date, :string
  end
end
