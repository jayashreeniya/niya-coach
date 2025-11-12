class CreateFocusAreaTexts < ActiveRecord::Migration[6.0]
  def change
    create_table :focus_area_texts do |t|
      t.string :focus_text_box

      t.timestamps
    end
  end
end
