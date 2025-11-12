class AddFieldInAssessYourselve < ActiveRecord::Migration[6.0]
  def change
    remove_column :assess_yourselves, :test_type
    add_column :assess_yourselves, :sub_title, :string 
  end
end
