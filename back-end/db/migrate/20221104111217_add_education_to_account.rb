class AddEducationToAccount < ActiveRecord::Migration[6.0]
  def change
    add_column :accounts, :education, :string
  end
end
