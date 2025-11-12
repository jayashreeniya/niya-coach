class AddFieldInAssesmentAnwer < ActiveRecord::Migration[6.0]
  def change
    add_column :assesment_test_answers, :answers, :string
  end
end
