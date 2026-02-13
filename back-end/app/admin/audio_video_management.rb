ActiveAdmin.register BxBlockUpload::MultipleUploadFile, as: "Multiple Upload File" do
  config.filters = false
  LABEL = 'Multiple Upload File'
  menu priority: 9
  menu parent: "Upload File", label: LABEL
  permit_params  :choose_file,:txt_info, file_types_attributes: [:id, :image, :file_name, :assesment_test_type_answer_id, :file_discription, :file_content, :multiple_file, :_destroy, :text_file, :text_file_to_str, focus_areas: [],well_being_focus_areas: []]
  actions :all, except: []

  before_create do |obj|
    obj.file_types.each do |ft|
      ft.focus_areas.delete("") if ft.focus_areas.first==""
    end
  end

  after_create do |obj|
    employee_role = BxBlockRolesPermissions::Role.find_by_name('EMPLOYEE')
    accounts = AccountBlock::Account.where(role_id: employee_role.id).joins(:select_answers) if employee_role
    accounts.each do |account|
      obj.file_types.each do |ft|
        focus_area = ft.focus_areas.map{|x| x.to_i}
        test_type_answer=BxBlockAssessmenttest::SelectAnswer.where(account_id: account.id)&.last
				user_focus_areas=BxBlockAssessmenttest::AssesmentTestTypeAnswer.where(id: test_type_answer&.multiple_answers).pluck(:id)
        unless (user_focus_areas & focus_area).empty?

          device_token = UserDeviceToken.find_by(account_id: account.id)&.device_token
          fcm_client = FCM.new(ENV['FCM_SERVER_KEY'])
          options = {
            priority: "high",
            collapse_key: "updated_score",
            data: {
              type: "Suggestion"
            },
            notification: {
              title: "Suggested for you",
              body: "New content is uploaded related to your focus areas."
            }
          }
          fcm_client.send(device_token, options)
        end
      end
    end
    obj.file_types.map do |obj1|
      if obj.choose_file == 'docs' && obj1.multiple_file.attached?
        blob = obj1.multiple_file.blob
        DocumentProcessingWorker.perform_async(blob&.id , obj1.id)
      end
    end
  end

  form title: LABEL do |f|
    f.semantic_errors :blah
    f.inputs class: 'file' do
      f.input :choose_file, label: 'File Type', default: f.object.choose_file, input_html: {class: 'choose_file', onchange: "(function(){
        let chooseFileInput = document.querySelector('.choose_file').value
        let fileFields=document.querySelectorAll('.file_type_select')
        if(chooseFileInput=='docs') {
          fileFields.forEach((ele)=>{
          ele.setAttribute('accept', '.docs, .pdf, .txt', 'docx', '.csv')
          })
        }
        if(chooseFileInput=='audios') {
          fileFields.forEach((ele)=>{
            ele.setAttribute('accept', '.mp3')
            })
        }
        if(chooseFileInput=='videos') {
          fileFields.forEach((ele)=>{
            ele.setAttribute('accept', '.mp4')
            })
        }
      })()", onclick: "(function(){
        let chooseFileInput = document.querySelector('.choose_file').value
        let fileFields=document.querySelectorAll('.file_type_select')
        if(chooseFileInput=='docs') {
          fileFields.forEach((ele)=>{
          ele.setAttribute('accept', '.docs, .pdf, .txt', 'docx', '.csv')
          })
        }
        if(chooseFileInput=='audios') {
          fileFields.forEach((ele)=>{
            ele.setAttribute('accept', '.mp3')
            })
        }
        if(chooseFileInput=='videos') {
          fileFields.forEach((ele)=>{
            ele.setAttribute('accept', '.mp4')
            })
        }
      })()"}
    end

    f.inputs class: 'file types file_type_select' do 
      has_many :file_types, multiple: true, allow_destroy: true, heading: 'Choose File', new_record: 'Add New File Type'  do |t|
        t.input :multiple_file, as: :file, label: 'File', input_html: {class: 'file_type_select', accept: '.none'}
        t.input :image, label: 'Thumbnail Image', as: :file
        t.input :file_content, label: "File Content"
        t.input :file_name, label: "File Name"
        t.input :file_discription , label: 'File Description'
        t.input :assesment_test_type_answer_id, :input_html => { :value => BxBlockAssessmenttest::AssesmentTestTypeAnswer.first&.id}, as: :hidden
        t.input :focus_areas, as: :check_boxes, label: 'Focus Area Point', collection: BxBlockAssessmenttest::AssesmentTestTypeAnswer.all.map{|x| [x.answers, x.id, {checked: (t.object.focus_areas || []).include?(x.id.to_s)}]}
        t.input :well_being_focus_areas, as: :check_boxes, label: 'Well Being Focus Area', collection: BxBlockAssessmenttest::WellBeingFocusArea.all.map{|x| [x.answers, x.id, {checked: (t.object.well_being_focus_areas || []).include?(x.id.to_s)}]}
        # t.input :text_file, as: :file, input_html: {accept: '.txt'}
       end
    end
    f.actions do
      f.submit "Submit"
    end
  end

  index :download_links => false do
    selectable_column
    column :id
    column :choose_file do |resource|
      if resource.file_types.present?
        table_for resource.file_types do
          column :file_link do |object|
            link_to(object.multiple_file.filename, rails_blob_path(object.multiple_file, disposition: 'attachment')) if object.multiple_file.attached?
          end
          column :file_name do |object|
            object&.file_name
          end
          column :file_description do |object|
            object&.file_discription
          end
          column :key_focus do |object|
            object&.focus_areas
          end
          column :well_being_focus_area do |object|
            object&.well_being_focus_areas
          end
          column :thumbnail do |object|
            object&.image.present? ? (image_tag object&.image, size: "31x31", style: "border-radius: 5px") : ""
          end
        end
      else
        span "No file types found"
      end
    end
    actions defaults: false do |resource|
      item "Edit", edit_admin_multiple_upload_file_path(resource), class: "member_link"
      item "Delete", admin_multiple_upload_file_path(resource), method: :delete, data: { confirm: "Are you sure you want to delete this?" }, class: "member_link"
    end
  end

  show do
    attributes_table do
      row :id
    end

    panel "Multiple Files" do
      table_for resource.file_types do
        column :id
        column :file_link do |object|
          link_to(object.multiple_file.filename, rails_blob_path(object.multiple_file, disposition: 'attachment')) if object.multiple_file.attached?
        end

        column :file_name do |object|
          object&.file_name
        end

        column :file_description do |object|
          object&.file_discription
        end

        column :key_focus do |object|
          object&.focus_areas
        end

        column :well_being_focus_area do |object|
          object&.well_being_focus_areas
        end
        
        column :thumbnail do |object|
          object&.image.present? ? (image_tag object&.thumb_image, size: "31x31", style: "border-radius: 5px") : ""
        end
      end
    end
  end 
end
