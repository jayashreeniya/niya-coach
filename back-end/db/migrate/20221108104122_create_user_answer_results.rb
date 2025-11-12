class CreateUserAnswerResults < ActiveRecord::Migration[6.0]
  def change
    create_table :user_answer_results do |t|
      t.integer :category_id
      t.integer :subcategory_id
      t.text :advice
      t.integer :min_score
      t.integer :max_score

      t.timestamps
    end
  end
end
