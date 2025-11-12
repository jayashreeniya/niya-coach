require 'rails_helper'

RSpec.describe Admin::NiyaChatBoardsController, type: :controller do
  render_views

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @que=BxBlockAssessmenttest::AssesmentTestQuestion.create(id: 3, title:'hello')
    sign_in @admin_user 
  end
  describe "GET #index" do
    it "listing index successfully" do
      get :index
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #new" do
    it "new successfully" do
      get :new
      expect(response).to have_http_status(:ok)
    end

  end

  describe "GET #show" do
    it "returns a success response" do
      get :show ,params:{id: @que.id}
      expect(response).to have_http_status(:success)
    end
  end
end