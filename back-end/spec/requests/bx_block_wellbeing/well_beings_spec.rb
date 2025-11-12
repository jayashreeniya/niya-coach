require 'rails_helper'

RSpec.describe "BxBlockWellbeing::WellBeings", type: :request do
  before(:all) do
    @token = Support::SharedHelper.new.get_token
  end

  let(:get_param){{
    "category_id": 10
}}

  describe "GET /index" do
    it "returns http success" do
      get '/bx_block_wellbeing/well_beings', params: get_param, headers: { token: @token}
      expect(response).to have_http_status(:success)
    end
  end

  describe "#get_result" do
    it "should return the result" do
      get '/bx_block_wellbeing/get_result', headers: { token: @token}
      expect(response).to have_http_status(:success)
    end
  end
end
