require 'rails_helper'

RSpec.describe BxBlockRequestManagement::RequestsController, type: :controller do
  let(:emprole) { BxBlockRolesPermissions::Role.find_by(name: 'employee') }
  let(:company) { FactoryBot.create(:company, id: rand(1..1000)) }
  let(:coach_role) { Support::SharedHelper.new.coach_role }
  let(:current_account) { FactoryBot.create(:hr_account, role_id: emprole.id,access_code: company.employee_code)}
  let(:account_coach) { FactoryBot.create(:hr_account, role_id: coach_role.id,access_code: company.employee_code) }
  let(:token1) { BuilderJsonWebToken.encode(account_coach.id) }
  let(:token2) { BuilderJsonWebToken.encode(current_account.id) }
  let!(:requests) { FactoryBot.create(:request, sender_id: current_account.id, account_id: current_account.id) }
  let(:json_response) { JSON.parse(response.body) }

  before do
    request.headers['token'] = token2
  end

  describe 'GET #index' do
    context 'when requests exist' do
      it 'returns a list of requests' do
        get :index, params: { filter_by: 'newest_first', filter_by_request: 'pending' }

        expect(response).to have_http_status(:ok)
        expect(json_response).not_to be_empty
      end
    end

    context 'when no requests match the filters' do
      it 'returns an empty array' do
        get :index, params: { search_by_name: 'NonExistentName' }
        expect(response).to have_http_status(:not_found)
        expect(json_response).to eq([])
      end
    end
  end
end
