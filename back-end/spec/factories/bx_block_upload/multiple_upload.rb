FactoryBot.define do
  factory :multiple_upload, class: BxBlockUpload::MultipleUploadFile do
    choose_file {"docs"} 
  end
end
