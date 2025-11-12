class ChangeExpertiseInAccount < ActiveRecord::Migration[6.0]
  def change
    remove_column :accounts, :expertise, :string
    add_column :accounts, :expertise, :string, default: [], array: true
  end
end
