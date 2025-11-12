class RemoveColumnToUserCate < ActiveRecord::Migration[6.0]

  def change
    remove_reference :user_categories, :account
    # remove_column :user_categories, :category

  end
end
