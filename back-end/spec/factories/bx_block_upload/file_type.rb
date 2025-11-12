# spec/factories/bx_block_upload/file_types.rb

FactoryBot.define do
  factory :file_type, class: 'BxBlockUpload::FileType' do
    sequence(:file_name) { |n| "file_#{n}.docx" }
    file_discription { "Sample description" }
    association :multiple_upload_file, factory: :multiple_upload_file
    assesment_test_type_answer_id { FactoryBot.create(:bx_block_assessmenttest_type_answer).id } # Update this line
    file_content { "audio file" }
    focus_areas { ["60", "61", "62"] }
    well_being_focus_areas { [] }

    # Add this block if you want to attach a dummy file
    after(:build) do |file_type|
      file_type.multiple_file.attach(io: File.open(Rails.root.join('spec', 'fixtures', 'test.docx')), filename: 'test.docx', content_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    end
  end
end
