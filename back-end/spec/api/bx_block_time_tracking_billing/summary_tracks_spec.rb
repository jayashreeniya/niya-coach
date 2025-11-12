require 'swagger_helper'
SUMMARY_ROUTE = "/bx_block_time_tracking_billing/summary_tracks"
SUMMARY_ROUTE1 = "/bx_block_time_tracking_billing/summary_tracks/all_account"
SUMMARY_ROUTE2 = "/bx_block_time_tracking_billing/summary_tracks/month_wise_record"
TYPE = 'application/json'
RSpec.describe  BxBlockTimeTrackingBilling::SummaryTracksController, type: :request do
  before(:each)  do
    @account =  Support::SharedHelper.new.current_user 
    @token = BuilderJsonWebToken.encode(@account.id)
  end
  path SUMMARY_ROUTE do
    get 'Summary tracks index' do
    tags "Summary_Tracks"
    produces TYPE
    parameter name: :token, in: :header, type: :string, description: "Summary tracks"
    
    response '200', 'Summary_tracks' do
      let(:token) { @token }
        it "returns Summary track data" do
          expect(response).to have_http_status(200)
          expect(BxBlockTimeTrackingBilling::SummaryTrack.count).to be >= 0
        end
        it "returns time-track-data" do
          get SUMMARY_ROUTE , params:{token: token, start_date: '2022-12-06'}
          expect(response).to have_http_status(200)
        end
        run_test!
      end
    end
  end
  path SUMMARY_ROUTE1 do
    get 'Summary tracks #all_account' do
    tags "Summary_Tracks"
    produces TYPE
    parameter name: :token, in: :header, type: :string, description: "all_account"
    
    response '200', 'Summary_tracks' do
      let(:token) { @token }
        it "returns Summary-track data" do
          get SUMMARY_ROUTE1 ,params:{token: token}
          expect(response).to have_http_status(200)
        end
        it "returns Summary-track data" do
          get SUMMARY_ROUTE1 ,params:{token: token ,limit: "5",page: 0}
          expect(response).to have_http_status(200)
        end
        run_test!
      end
    end
  end
  path SUMMARY_ROUTE2 do
    get 'Summary tracks #month_wise_record' do
    tags "Summary_Tracks1"
    produces TYPE
    parameter name: :token, in: :header, type: :string, description: "all_account"
    
    response '422', 'Summary_tracks1' do
      let(:token) { @token }
        it "returns Summary track-data" do
          expect(response).to have_http_status(422)
        end
        run_test!
      end
    end
  end
  path SUMMARY_ROUTE2 do
    get 'Summary tracks #month_wise_record' do
    tags "Summary Track"
    produces TYPE
    parameter name: :token, in: :header, type: :string, description: "month_wise_record"
    
    response '422', 'month_wise_record' do
      let(:account){@account}
      let(:token) { @token }
        it "returns Summary track data" do
          get SUMMARY_ROUTE2 ,params:{account_id: account.id}
          expect(response).to have_http_status(200)
        end
        it "returns Summarytracks data" do
          get SUMMARY_ROUTE2 ,params:{account_id: account.id , page: 0 ,limit: 3}
          expect(response).to have_http_status(200)
        end
        run_test!
      end
    end
  end
end