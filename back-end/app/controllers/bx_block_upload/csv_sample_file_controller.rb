module BxBlockUpload
  class CsvSampleFileController < ApplicationController
    before_action :validate_json_web_token , except: [:download_sample_csv]
    def download_sample_csv
      csv_data = CSV.generate do |csv|
        csv << ["file type", "file path", "file content", "file name", "file description", "focus areas"]
        csv << ["audios", "https://drive.google.com/file/d/1NYPf61odHtKZVXPjEdqHIDXrsl4LRg__/view?usp=sharing", "audio file", "Crowd-cheering.mp3", "enter mp3 format only for audios", "60,61,62"]
        csv << ["docs", "https://docs.google.com/document/d/15KQSle-E3fT0lOwC8SUlwW8zKmK6W1Um/edit?usp=drive_link", "doc file", "sample-document.docx", "enter .docx format only for docs", "60,61,62"]
        
      end
      send_data csv_data, filename: "sample-csv-file.csv", type: "text/csv"
    end
  end
end
