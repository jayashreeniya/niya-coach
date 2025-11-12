class CreateTermsAndConditions < ActiveRecord::Migration[6.0]
  def change
    create_table :terms_and_conditions do |t|
      t.text :terms_and_condition_content

      t.timestamps
    end
  end
end
