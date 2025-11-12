class CreateAssessYourselves < ActiveRecord::Migration[6.0]
  def change
    create_table :assess_yourselves do |t|
      t.string :title
      t.integer :test_type
      t.timestamps
    end
  end
end
