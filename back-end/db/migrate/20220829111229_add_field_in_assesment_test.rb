class AddFieldInAssesmentTest < ActiveRecord::Migration[6.0]
  def change
    remove_reference :assesment_test_types, :assesment_test_questions
  end
end
