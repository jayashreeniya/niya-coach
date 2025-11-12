class AddFieldInAssesmentTestType < ActiveRecord::Migration[6.0]
  def change
    add_reference :assesment_test_types, :assesment_test_answer 
  end
end
