class CreateAssesmentTestTypeAnswers < ActiveRecord::Migration[6.0]
  def change
    create_table :assesment_test_type_answers do |t|
      t.references :assesment_test_type
      t.string :title
      t.string :answers
      t.integer :test_type_id
      t.timestamps
    end
  end
end
