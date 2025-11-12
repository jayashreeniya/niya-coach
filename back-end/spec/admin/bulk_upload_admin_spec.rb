require 'rails_helper'

RSpec.describe Admin::BulkUploadFilesController, type: :controller do
  render_views

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @bulk_upload = FactoryBot.create(:bulk_upload)
    
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
      post :create, params: { bx_block_upload_bulk_upload: {name: "test" ,csv_file: csv_file} }
      expect(response).to have_http_status(302)
    end
  end

 
  describe "GET #show" do
    it "returns a success response" do
      get :show, params: { id: @bulk_upload.id }
      expect(response).to have_http_status(:success)
    end
  end
end