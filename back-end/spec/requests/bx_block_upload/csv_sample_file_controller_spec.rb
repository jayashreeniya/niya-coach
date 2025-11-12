require 'rails_helper'

RSpec.describe BxBlockUpload::CsvSampleFileController, type: :controller do
  describe 'GET #download_sample_csv' do
    it 'returns a CSV file with the expected headers and data' do
      get :download_sample_csv

      expect(response).to have_http_status(:success)
      expect(response.content_type).to eq 'text/csv'
      expect(response.headers['Content-Disposition']).to include('attachment; filename="sample-csv-file.csv"')

      csv_data = CSV.parse(response.body)
      expect(csv_data[0]).to eq(["file type", "file path", "file content", "file name", "file description", "focus areas"])
      expect(csv_data[1]).to eq(["audios", "https://drive.google.com/file/d/1NYPf61odHtKZVXPjEdqHIDXrsl4LRg__/view?usp=sharing", "audio file", "Crowd-cheering.mp3", "enter mp3 format only for audios", "60,61,62"])
      expect(csv_data[2]).to eq(["docs", "https://docs.google.com/document/d/15KQSle-E3fT0lOwC8SUlwW8zKmK6W1Um/edit?usp=drive_link", "doc file", "sample-document.docx", "enter .docx format only for docs", "60,61,62"])
    end

    
  end
end
