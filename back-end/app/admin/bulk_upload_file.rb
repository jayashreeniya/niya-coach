require 'csv'

ActiveAdmin.register  BxBlockUpload::BulkUpload, as: "Bulk Upload File" do
  config.filters = false
  NAME = 'Bulk upload files'
  menu priority: 9
  menu parent: "Upload File", label: "Bulk Upload File"
  permit_params :name, :csv_file
  actions :all
  action_item 'sample csv file', only: :new do
    link_to 'Download sample csv file' ,download_sample_csv_path
  end

  after_create do |object|
    # bulk_upload = BxBlockUpload::BulkUpload.find(object.id)
    # csv_blob = bulk_upload.csv_file.blob
    # csv_data = CSV.parse(csv_blob.download, headers: true)
    # data = []
  
    # csv_data.each do |row|
    #   data << {
    #     type: row['file type'],
    #     path: row['file path'],
    #     content: row['file content'],
    #     name: row['file name'],
    #     description: row['file description'],
    #     focus_area: row['focus areas']
    #   }
    # end
  
    # data.each do |obj|
    #   if %w[audios videos docs].include?(obj[:type])
    #     focus_areas = obj[:focus_area].split(',')
    #     file_type = obj[:type]
    #     mutiplefileupload = BxBlockUpload::MultipleUploadFile.create(choose_file: file_type)
    #     id = BxBlockAssessmenttest::AssesmentTestTypeAnswer.first.id
  
    #     file_upload = BxBlockUpload::FileType.create(
    #       file_name: obj[:name],
    #       file_discription: obj[:description],
    #       assesment_test_type_answer_id: id,
    #       multiple_upload_file_id: mutiplefileupload.id,
    #       focus_areas: focus_areas,
    #       file_content: obj[:content]
    #     )
  
    #     if obj[:path].present?
    #       drive_path = obj[:path]
    #       file_id = drive_path.match(/[-\w]{25,}/).to_s
    #       download_link = "https://drive.google.com/uc?export=download&id=#{file_id}"
    #       file_contents = URI.open(download_link).read
    #       blob = ActiveStorage::Blob.create_and_upload!(
    #         io: StringIO.new(file_contents),
    #         filename: obj[:name],
    #         content_type: 'audio/mpeg'
    #       )
          
    #       file_upload.multiple_file.attach(blob)
    #       if mutiplefileupload.choose_file == 'docs'
    #         blob = file_upload.multiple_file.blob
    #         DocumentProcessingWorker.perform_async(blob.id , file_upload.id)
    #       end
    #     end
    #   end
    # end
  
    BulkUploadWorker.perform_async(object.id)
  end

  form title: "Add New Bulk Upload File"do |f|
    f.inputs "Bulk Upload Details" do
      f.input :name
      f.input :csv_file, as: :file
    end
    f.actions do
      f.submit "Submit"
    end
  end
  
  show do
    attributes_table do
      row :id
    end
    panel NAME do
      table_for resource do
        column :id
        column :file_link do |object|
          link_to(object.csv_file.name, rails_blob_path(object.csv_file, disposition: 'attachment')) if object.csv_file.attached?
        end
      end
    end
  end 
end
