class UpdateAssesmentQue < ActiveRecord::Migration[6.0]
  def change
    remove_reference :assesment_test_questions, :account
  end
end
