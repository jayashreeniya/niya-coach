class AddColumnToAssessSelectAnswer < ActiveRecord::Migration[6.0]
  def change
    add_column :assess_select_answers, :assess_yourself_answer_id, :integer
    add_column :assess_select_answers, :select_answer_status, :boolean, default: false
  end
end
