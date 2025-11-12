require 'rails_helper'
RSpec.describe "BxBlockUpload::Audios", type: :request do
    # @get_datas = Support::SharedHelper.new.create_audio_list

    before(:all) do
        @question = BxBlockAssessmenttest::AssesmentTestQuestion.find_or_create_by(title: 'testing')
        @answer = BxBlockAssessmenttest::AssesmentTestAnswer.find_or_create_by(assesment_test_question_id: @question.id, answers: 'tesing', title: 'testing')
        @que_test_type = BxBlockAssessmenttest::AssesmentTestType.find_or_create_by(question_title: 'testing',test_type: nil, sequence_number: nil, assesment_test_answer_id: @answer.id)
        @test_type_answer = BxBlockAssessmenttest::AssesmentTestTypeAnswer.find_or_create_by(assesment_test_type_id: @que_test_type.id, title: nil, answers: 'testing', test_type_id: nil)
        @multiple_upload = BxBlockUpload::MultipleUploadFile.find_or_create_by(choose_file: 'audios')
        file = @multiple_upload.file_types.new(file_name: 'sample-document.pdf',file_discription: 'enter pdf format only for docs', assesment_test_type_answer_id: @test_type_answer.id, multiple_upload_file_id: @multiple_upload.id, created_at: '2023-07-02 10:04:43', updated_at: '2023-07-02 10:04:44', focus_areas: %w[60 61 62], text_file_to_str: nil, text_file: nil, file_content: 'audio file')
        
        file.save!(validate: false)
        @token = Support::SharedHelper.new.get_token
    end


    describe "audio_list" do
      it "should get audio list" do
        post '/audio_list', headers: { token: @token }, params: { per_page: 1, page: 1 }
        expect(response).to have_http_status(:ok)
      end
    end

    describe "docs_list" do 
        it 'should get doc list' do 
            get '/artical_list', headers: {token: @token},params: { per_page: 1, page: 1 }
            expect(response).to have_http_status :ok 
        end
    end
     
    describe "video_list" do 
        it 'should get video list' do 
            get '/video_list', headers: {token: @token},params: { per_page: 1, page: 1 }
            expect(response).to have_http_status :ok 
        end
    end

    describe "suggestion api" do 
        it 'should get video list ' do 
            get '/suggestion', headers: {token: @token}
            expect(response). to have_http_status :ok
        end
    end
end