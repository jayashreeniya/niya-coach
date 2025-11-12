require 'rails_helper'

RSpec.describe Admin::VideoCallFeedbacksController, type: :controller do
  render_views
  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @wc=BxBlockRating::CoachRating.create(account_id: 1, coach_rating: 4.0, coach_id: 4, feedback: "good", organisation: "company", app_rating: 4)
    sign_in @admin_user 
  end
  
  describe "GET #index" do
    it "listing index successfully" do
      get :index
      expect(response).to have_http_status(:ok)
    end
  end
  
end