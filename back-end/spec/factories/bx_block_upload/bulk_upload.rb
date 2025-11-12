FactoryBot.define do
  factory :bulk_upload, class: BxBlockUpload::BulkUpload do
    name {"test"} 
    after(:build) do |bulk_upload|
      bulk_upload.csv_file.attach(io: File.open(Rails.root.join('spec', 'fixtures', 'test_file.csv')), filename: "test_file.csv", content_type: 'text/csv')
    end 
  end
end
