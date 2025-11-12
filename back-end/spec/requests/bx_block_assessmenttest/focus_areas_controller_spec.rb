require 'rails_helper'

RSpec.describe "BxBlockAssessmenttest::FocusAreasControllers", type: :request do
  before(:all) do
     @token = Support::SharedHelper.new.get_token
  end


  describe '#create' do
    context 'get focus areas' do
      it 'should pass  when get focus area successfully' do
        post '/bx_block_assessmenttest/focus_areas',headers: { token: @token}
          expect(response).to have_http_status :not_found
          expect(JSON.parse(response.body).dig('errors')).to eq([{"message"=>"Focus areas not found"}])
        end
    end 
  end

  describe '#activity' do
    context 'showing focus areas text' do
      it 'should pass  when get focus area successfully' do
        post '/bx_block_assessmenttest/activity',headers: { token: @token}
          expect(response).to have_http_status :ok
          expect(JSON.parse(response.body).dig('id')).to be_present
        end
    end 
  end
end
