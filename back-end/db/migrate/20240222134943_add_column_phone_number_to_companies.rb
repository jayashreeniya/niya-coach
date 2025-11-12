class AddColumnPhoneNumberToCompanies < ActiveRecord::Migration[6.0]
  def change
  	add_column :companies, :phone_number, :bigint
  end
end
