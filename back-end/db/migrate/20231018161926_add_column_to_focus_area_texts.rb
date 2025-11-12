class AddColumnToFocusAreaTexts < ActiveRecord::Migration[6.0]
  def change
  	add_column :focus_area_texts , :account_id, :integer
  	add_column :focus_area_texts , :submitted_at, :date
  end
end
