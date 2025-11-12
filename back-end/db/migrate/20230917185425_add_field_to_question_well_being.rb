class AddFieldToQuestionWellBeing < ActiveRecord::Migration[6.0]
  def change
    add_column :question_well_beings, :sequence, :integer
  end
end
