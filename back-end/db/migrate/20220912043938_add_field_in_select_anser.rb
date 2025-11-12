class AddFieldInSelectAnser < ActiveRecord::Migration[6.0]
  def change
    remove_column :select_answers, :multiple_answers if column_exists?(:select_answers, :multiple_answers)
    add_column :select_answers, :multiple_answers, :jsonb, array: true, default: "{}" unless column_exists?(:select_answers, :multiple_answers)
  end
end
