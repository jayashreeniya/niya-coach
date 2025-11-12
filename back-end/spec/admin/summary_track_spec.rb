require 'rails_helper'

RSpec.describe Admin::BxBlockTimeTrackingBillingSummaryTracksController, type: :controller do
  render_views

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @account = Support::SharedHelper.new.current_user
    @summary = BxBlockTimeTrackingBilling::SummaryTrack.find_or_create_by(account_id: @account.id, spend_time: 0.5530366)
    sign_in @admin_user 
  end
  
  describe "GET #index" do
    it "listing index successfully" do
      get :index
      expect(response).to have_http_status(:ok)
    end
  end


  describe "GET #show" do
    it "returns a success response" do
      get :show ,params:{id: @summary.id}
      expect(response).to have_http_status(:success)
    end
  end
end