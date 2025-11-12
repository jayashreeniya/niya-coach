class AddFieldInChooseAns < ActiveRecord::Migration[6.0]
  def change
    add_column :choose_answers, :select_answer_id, :integer
    add_column :choose_answers, :assesment_test_type_answer_id, :integer
    add_column :choose_answers, :assesment_test_type_id, :integer
    
  end
end
