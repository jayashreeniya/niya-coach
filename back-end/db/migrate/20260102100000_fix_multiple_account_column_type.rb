class FixMultipleAccountColumnType < ActiveRecord::Migration[6.1]
  def up
    # Change multiple_account from integer to text for JSON storage
    change_column :well_being_focus_areas, :multiple_account, :text, default: nil
    
    # Also fix the topfocus_areas columns that need to store arrays
    change_column :topfocus_areas, :select_focus_area_id, :text, default: nil
    change_column :topfocus_areas, :wellbeingfocus_id, :text, default: nil
  end

  def down
    change_column :well_being_focus_areas, :multiple_account, :integer, default: nil
    change_column :topfocus_areas, :select_focus_area_id, :integer, default: nil
    change_column :topfocus_areas, :wellbeingfocus_id, :integer, default: nil
  end
end












