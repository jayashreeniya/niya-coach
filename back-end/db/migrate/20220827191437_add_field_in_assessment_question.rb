class AddFieldInAssessmentQuestion < ActiveRecord::Migration[6.0]
  def change
    add_column :assesment_test_questions, :sequence_number, :integer
  end
end
