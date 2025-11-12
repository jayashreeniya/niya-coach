class AddMonthYearToAccounts < ActiveRecord::Migration[6.0]
  def change
    add_column :accounts, :created_month_year, :date
  end
end
