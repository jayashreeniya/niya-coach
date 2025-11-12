class CreateCompanies < ActiveRecord::Migration[6.0]
  def change
    create_table :companies do |t|
      t.string :name
      t.string :email
      t.string :address
      t.string :hr_code
      t.string :employee_code

      t.timestamps
    end
  end
end
