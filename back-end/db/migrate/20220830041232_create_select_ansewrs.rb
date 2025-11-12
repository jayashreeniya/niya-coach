class CreateSelectAnsewrs < ActiveRecord::Migration[6.0]
  def change
    create_table :select_answers do |t|
      t.integer :assesment_test_type_id
      t.integer :assesment_test_type_answer_ids, array: true
      t.references :account

      t.timestamps
    end
  end
end
