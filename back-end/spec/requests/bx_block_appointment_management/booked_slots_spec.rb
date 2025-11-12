require 'rails_helper'

RSpec.describe "BxBlockWellbeing::WellBeings", type: :request do
  before(:all) do
    @token = Support::SharedHelper.new.get_token
  end

  describe "GET /video_call" do
    it "returns http success for video call" do
      get '/bx_block_calendar/booked_slots/video_call', headers: { token: @token}
      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body).dig('errors')).to eq("Booked slot id should present")
    end
  end
end
