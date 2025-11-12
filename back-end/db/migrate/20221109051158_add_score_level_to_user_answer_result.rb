class AddScoreLevelToUserAnswerResult < ActiveRecord::Migration[6.0]
  def change
    add_column :user_answer_results, :score_level, :string
  end
end
