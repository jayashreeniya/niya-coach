class CreateFocusAreaActivities < ActiveRecord::Migration[6.0]
  def change
    create_table :focus_area_activities do |t|
      t.string :activity_text_box

      t.timestamps
    end
  end
end
