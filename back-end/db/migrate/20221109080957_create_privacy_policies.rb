class CreatePrivacyPolicies < ActiveRecord::Migration[6.0]
  def change
    create_table :privacy_policies do |t|
      t.text :policy_content

      t.timestamps
    end
  end
end
