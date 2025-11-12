class CreateBulkUpload < ActiveRecord::Migration[6.0]
  def change
    create_table :bulk_uploads do |t|
      t.string :name
      
      t.timestamps
    end
  end
end
