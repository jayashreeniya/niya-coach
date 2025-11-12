class AddColumnToChooseMotionAnswers < ActiveRecord::Migration[6.0]
  def change
  	add_column :choose_motion_answers, :select_motion_id, :integer
  end
end
