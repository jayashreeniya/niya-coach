require 'swagger_helper'
ROUTE = "/bx_block_time_tracking_billing/time_tracks"
TYPE = 'application/json'
RSpec.describe BxBlockTimeTrackingBilling::TimeTracksController, type: :request do
  before(:each)  do
    account =  Support::SharedHelper.new.current_user 
    @token = BuilderJsonWebToken.encode(account.id)
  end
  path ROUTE do
    get 'Time tracks #index' do
    tags "Time_Tracks"
    produces TYPE
    parameter name: :token, in: :header, type: :string, description: "time tracks"
    
    response '200', 'Time_tracks' do
      let(:token) { @token }
        it "returns time track data" do
          expect(response).to have_http_status(200)
          expect(BxBlockTimeTrackingBilling::TimeTrack.count).to be >= 0
        end
        it "returns time track data" do
          get ROUTE , params:{token: token, start_date: '2022-12-06'}
          expect(response).to have_http_status(200)
        end
        run_test!
      end
    end
  end
end