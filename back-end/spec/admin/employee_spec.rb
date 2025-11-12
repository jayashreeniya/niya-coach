require 'rails_helper'

RSpec.describe Admin::EmployeesController, type: :controller do
  render_views
  STRFTIME_FORMAT="%d/%m/%Y"
  PASS = "Rails@321"

  before do 
    @admin_user = FactoryBot.create(:admin_user)
    @company = FactoryBot.create(:company)
    # @account=Support::SharedHelper.new.get_coach_user
    sign_in @admin_user 
    emprole = BxBlockRolesPermissions::Role.find_by(name: "employee")
    @employee_account = AccountBlock::EmailAccount.new(full_name: "test", email: "ram1#{rand(0000..9999)}shree@gmail.com", full_phone_number: "91#{rand(10**10)}", password: PASS, password_confirmation: PASS, access_code: @company.employee_code )
    @employee_account&.save(validate: false)
    @focus_area_text = FocusAreaText.create(focus_text_box: "focus text", account_id: @employee_account.id,submitted_at: Date.today)
    @motion = BxBlockAssessmenttest::Motion.find_or_create_by(motion_title: "hello")
    @motion = BxBlockAssessmenttest::SelectMotion.find_or_create_by(account_id: @employee_account.id, motion_id: @motion.id,motion_select_date: Date.today )
    @motion_question = BxBlockAssessmenttest::MotionQuestion.find_or_create_by(emo_question: "hello test?", motion_id: @motion.id)
    @motion_answer = BxBlockAssessmenttest::MotionAnswer.find_or_create_by(emo_answer: "Hii", motion_question_id: @motion_question.id)
  end

  describe "GET #index" do
    it "listing index successfully" do
      get :index
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #show" do
    it "returns a success show response" do
      get :show ,params:{id: @employee_account.id}
      expect(response).to have_http_status(:success)
    end    
  end
end
