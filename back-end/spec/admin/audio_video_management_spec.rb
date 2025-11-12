require 'rails_helper'

RSpec.describe Admin::MultipleUploadFilesController, type: :controller do
  render_views

  before do 
    account = Support::SharedHelper.new.current_user
    UserDeviceToken.find_or_create_by(account_id: account.id, device_token: "jbjhgudi78d8sd87sds8d8sdbnsdud")
    @admin_user = FactoryBot.create(:admin_user)
    @question = FactoryBot.create(:bx_block_assessmenttest_question)
    @answer = FactoryBot.create(:bx_block_assessmenttest_answer, assesment_test_question: @question)
    @que_test_type = FactoryBot.create(:bx_block_assessmenttest_type, assesment_test_answer: @answer)
    @test_type_answer = FactoryBot.create(:bx_block_assessmenttest_type_answer, assesment_test_type: @que_test_type)
    BxBlockAssessmenttest::SelectAnswer.find_or_create_by(assesment_test_type_id: @que_test_type.id, assesment_test_type_answer_ids: nil, account_id: account.id, created_at: "2023-11-21 18:38:00", updated_at: "2023-11-21 18:38:00", multiple_answers: [[59, 60, 61]])
    @multiple_upload = FactoryBot.create(:multiple_upload)
    FactoryBot.create(:file_type, multiple_upload_file: @multiple_upload)
    # Create a temporary CSV file
    csv_data = "This is sample file "
    csv_file = Tempfile.new(['test_bulk_upload', '.docx'])
    csv_file.write(csv_data)
    csv_file.rewind

    # Attach the CSV file to the bulk upload
    file = @multiple_upload.file_types.create(
      file_name: 'test.docx',
      file_discription: 'enter pdf format only for docs',
      assesment_test_type_answer_id: @test_type_answer.id,
      multiple_upload_file_id: @multiple_upload.id,
      created_at: '2023-07-02 10:04:43',
      updated_at: '2023-07-02 10:04:44',
      focus_areas: %w[59 60 61],
      text_file_to_str: nil,
      text_file: nil,
      file_content: 'audio file'
    )

    # Attach the file using Active Storage
    file.multiple_file.attach(io: csv_file, filename: 'test_bulk_upload.docx')

    # Dummy attachment for file_type.multiple_file
    # FactoryBot.create(:attachment, attachable: file.multiple_file)

    sign_in @admin_user
  end

  describe "GET #index" do
    it "listing index successfully" do
      get :index
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #new" do
    it "new successfully" do
      get :new
      expect(response).to have_http_status(:ok)
    end

    it "create successfully" do
      csv_file = Rack::Test::UploadedFile.new(Rails.root.join('spec', 'fixtures', 'test_file.csv'), 'text/csv')
      post :create, params: { bx_block_upload_multiple_upload_file: {"choose_file"=>"docs", "file_types_attributes"=>{"0"=>{file_content: csv_file, "assesment_test_type_answer_id"=> @test_type_answer.id, "focus_areas"=>["", "1"], "well_being_focus_areas"=>["", "4", "6"]} } } }
      expect(response).to have_http_status(302)
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      get :show, params: { id: @multiple_upload.id }
      expect(response).to have_http_status(:success)
    end
  end
end