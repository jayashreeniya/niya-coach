require 'rails_helper'

RSpec.describe Admin::WellBeingReportsController, type: :controller do
  render_views
  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @account=Support::SharedHelper.new.current_user
    @well_being_category = WellBeingCategory.find_or_create_by(id: 4, category_name: "Occupational Wellbeing")
    @wellbeing_report=WellbeingScoreReport.create(category_id: 4, account_id: @account.id, category_result: {"category_name"=>"Financial Wellbeing", "score"=>21, "question_count"=>5, "percentage"=>42, "advice"=>"No significant stress around Money", "submitted_at"=>"2023-09-20", "score_level"=>"high", "profile_type"=>nil}, sub_category_result: [{"sub_category"=>"Financial Wellbeing", "score"=>21, "question_count"=>5, "percentage"=>42}])
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
      get :show ,params:{id: @wellbeing_report.id}
      expect(response).to have_http_status(:success)
    end
  end
  
end