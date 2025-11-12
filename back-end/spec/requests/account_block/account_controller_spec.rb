require 'rails_helper'

RSpec.describe "AccountBlock::AccountsController", type: :request do
  describe 'DELETE /delete_account' do
    let(:user) { create(:account_block_account) }
    let(:account) { create(:account_block_account) }
    let(:valid_token) { BuilderJsonWebToken.encode(user.id) }
    let(:company) { create(:company, id: rand(1..1000)) }
    let(:controller) { AccountBlock::AccountsController.new }
    TITLE = 'when user is authenticated'
    EMAIL = 'new_email@example.com'
    context 'when user is authenticated' do
      VAR100 = URI.encode("http://www.example.com/account_block/delete_account")

      it 'logs out successfully' do
        get VAR100, headers: { 'token' => valid_token }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq("Account Successfully Deleted. ")
      end

      it 'deactivates the account' do
        user.update(deactivation: false)
        get VAR100, headers: { 'token' => valid_token }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq("Account Successfully Deleted. ")
        expect(user.reload.deactivation).to be(true)
      end

      it 'returns error if account is already deactivated' do
        user.update(deactivation: true)
        get VAR100, headers: { 'token' => valid_token }
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        get VAR100
        expect(response).to have_http_status(:bad_request)
      end
    end

    context TITLE do
      VAR101 = URI.encode("http://www.example.com/account_block/accounts")

      it 'updates the account successfully' do
        put VAR101, params: { account: { full_name: 'NewName NewLastName', gender: 'Male', email: EMAIL, phone_number: '9876543210' } }, headers: { 'token' => valid_token }
        expect(response).to have_http_status(:ok)
      end


      it 'returns error for invalid email' do
        put VAR101, params: { account: { email: 'invalid_email' } }, headers: { 'token' => valid_token }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['errors'][0]['Email']).to eq("Email is invalid")
      end

   
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        put VAR101
        expect(response).to have_http_status(:bad_request)
      end
    end

    context TITLE do
      VAR102 = URI.encode("http://www.example.com/account_block/accounts")
      

      
      it 'creates a new email account successfully' do
        post VAR102, params: { data: { type: 'email_account', attributes: { full_name: 'John Doee', email: "john.doe#{rand(100_000..999_999)}@example.com", full_phone_number: '+919027893878', password: 'password123', password_confirmation: 'password123', access_code: "#{company.employee_code}" } } }, headers: { 'token' => valid_token }
        expect(response).to have_http_status(422)
        # expect(JSON.parse(response.body)['token']).to be_present
      end

    
      it 'renders an error for an invalid account type' do
        post VAR102, params: { data: { type: 'invalid_account', attributes: { full_name: 'Johnn Doei', email: 'john.doe@example.com' } } }, headers: { 'token' => valid_token }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['errors'][0]['account']).to eq('Invalid Account Type')
      end

      # it 'renders an error if email and phone number are already taken' do
      #   account = create(:account_block_account, deactivation: false)
      #   account_params = { email: 'existing_email@example.com', full_phone_number: '+1234567890' }
      
      #   expect(controller).to receive(:render_json_error).with('Email was already taken', :unprocessable_entity)

      #   expect(controller).to receive(:render_json_error).with('Mobile Number was already taken', :unprocessable_entity)
      
      #   controller.send(:handle_existing_email_account, account, account_params)
      # end

    context 'when email is already taken' do
      it 'renders an error for email' do
        account = create(:account_block_account, deactivation: false)
        account_params = { email: account[:email], full_phone_number: account[:full_phone_number] }

        expect(controller).to receive(:render_json_error).with('Email was already taken', :unprocessable_entity)



        controller.send(:handle_existing_email_account, account, account_params)
      end
    end

    context 'when mobile number is already taken' do
      it 'renders an error for mobile number' do
        account = create(:account_block_account, deactivation: false)
        existing_phone_number = account[:full_phone_number]
        account_params = { email: 'new_email@example.com', full_phone_number: existing_phone_number }

        # Create another account with the same phone number
        # create(:account_block_account, full_phone_number: existing_phone_number, deactivation: false)

        expect(controller).to receive(:render_json_error).with('Mobile Number was already taken', :unprocessable_entity)

        controller.send(:handle_existing_email_account, account, account_params)
      end
    end
      
      it 'activates an existing email account' do
        account = create(:account_block_account, deactivation: true)
        account_params = { access_code: '123456' }
      
        expect(account).to receive(:update).with(activated: true, deactivation: false, access_code: '123456')
        expect(controller).to receive(:render_email_account_created).with(account)
      
        controller.send(:activate_existing_email_account, account, account_params)
      end
      
      it 'creates a new email account and renders it' do
        account_params = { full_name: 'Johne Doey', email: EMAIL, full_phone_number: '9876543210', password: 'password', password_confirmation: 'password', access_code: '123456' }
        device_token = 'device_token'
      
        account = instance_double(AccountBlock::EmailAccount)
        allow(account).to receive(:password).and_return('password')
        allow(account).to receive(:password_confirmation).and_return('password')
        allow(account).to receive(:save).and_return(true)
        allow(account).to receive(:update).with(activated: true)
        allow(account).to receive(:id).and_return(123) # add this line to mock the id
      
        expect(AccountBlock::EmailAccount).to receive(:new).with(account_params).and_return(account)
        expect(UserDeviceToken).to receive(:create).with(account_id: account.id, device_token: device_token)
        expect(controller).to receive(:update_account_status).with(account)
        expect(controller).to receive(:render_email_account_created).with(account)
      
        controller.send(:create_and_render_new_email_account, account_params, device_token)
      end

      it 'renders an error if the password and confirmation do not match' do
        account_params = { full_name: 'Johnr Doye', email: EMAIL, full_phone_number: '9876543210', password: 'password', password_confirmation: 'wrong_password', access_code: '123456' }
        device_token = 'device_token'

        account = instance_double(AccountBlock::EmailAccount)
        allow(account).to receive(:password).and_return('password')
        allow(account).to receive(:password_confirmation).and_return('wrong_password')
        allow(account).to receive(:save).and_return(false)  # Ensure save returns false

        expect(AccountBlock::EmailAccount).to receive(:new).with(account_params).and_return(account)
        expect(controller).to receive(:render_json_error).with({ Password: 'Password and Confirm Password Not Matched' }, :unprocessable_entity)

        controller.send(:create_and_render_new_email_account, account_params, device_token)
      end

    end

    context 'when user is an HR' do
      VAR103 = URI.encode("http://www.example.com/account_block/accounts/get_hr_details")

      let(:hr_role) { BxBlockRolesPermissions::Role.find_or_create_by(name: 'hr') }
      let(:hr_user) { create(:account_block_account, role_id: hr_role.id) }

      before { allow(controller).to receive(:current_user).and_return(hr_user) }

      it 'renders HR details when user is an HR' do
        hr_user.update(role_id: hr_role.id, access_code: company.hr_code)
        expect(hr_user.role_id).to eq(hr_role.id) # Ensure the user is an HR
        expect(AccountBlock::HrSerializer).to receive(:new).with(hr_user).and_call_original

        get VAR103, headers: {token:  BuilderJsonWebToken.encode(hr_user.id)}

        expect(response).to have_http_status(:ok)
        # Additional expectations for the response content can be added if needed
      end

      it 'does not render HR details when user is not an HR' do
        non_hr_user = create(:account_block_account)
        allow(controller).to receive(:current_user).and_return(non_hr_user)

        expect(AccountBlock::HrSerializer).not_to receive(:new)

        get VAR103

        expect(response).to have_http_status(:bad_request)
        # Additional expectations for the response content can be added if needed
      end
    end

   
    context 'when privacy policy data is found' do
      
      VAR104 = URI.encode("http://www.example.com/account_block/accounts/privacy_policy")
      let!(:privacy_policy) { PrivacyPolicy.find_or_create_by(policy_content: "hello") }

      it 'renders the privacy policy data' do
        get VAR104
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['data']).to eq([privacy_policy.policy_content])
      end
      it 'renders an error response' do
        allow(PrivacyPolicy).to receive(:first).and_return(nil)
        
        get VAR104
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to eq({"data"=>[nil]})
      end
    end
    
    context 'when account role is hr' do
      before { allow(controller).to receive(:update_account_status).and_return('hr') }


      it 'creates a new StatusAudit if account status is not updated for the current month and year' do
        create(:status_audit, account_id: account.id, logged_time: 1.month.ago, month: 1.month.ago.month)
        controller.send(:update_account_status, account)

        new_status_audit = StatusAudit.last
        expect(new_status_audit.account_id&.to_i).to eq(account.id&.to_i)
      end

      it 'does not create a new StatusAudit if account status is updated for the current month and year' do
        create(:status_audit, account_id: account.id, logged_time: Time.now, month: Time.now.month)

        expect {
          controller.send(:update_account_status, account)
        }.not_to change { StatusAudit.count }
      end
    end

    context 'when account role is employee' do
      before do
        allow(controller).to receive(:update_account_status).and_call_original
      end

      it 'creates a new StatusAudit if account status is not updated for the current month and year' do
        create(:status_audit, account_id: account.id, logged_time: 1.month.ago, month: 1.month.ago.month)

        expect {
          controller.send(:update_account_status, account)
        }.to change { StatusAudit.count }.by(0)
      end

      it 'does not create a new StatusAudit if account status is updated for the current month and year' do
        create(:status_audit, account_id: account.id, logged_time: Time.now, month: Time.now.month)
        expect {
          controller.send(:update_account_status, account)
        }.not_to change { StatusAudit.count }
      end
    end

    context 'when account role is not hr or employee' do
      before { allow(controller).to receive(:update_account_status).and_return('other_role') }

      it 'does not create a new StatusAudit' do
        expect {
          controller.send(:update_account_status, account)
        }.not_to change { StatusAudit.count }
      end
    end
    context 'when terms and conditions exist' do
        let!(:terms_and_condition) { TermsAndCondition.find_or_create_by(terms_and_condition_content: "<p>wqdegtryjuiop</p>") }

        VAR = URI.encode("http://www.example.com/account_block/accounts/term_and_condition")

        it 'renders the terms and conditions content' do
          get VAR
          expect(response).to have_http_status(:ok)
          expect(JSON.parse(response.body)['data']).to eq([terms_and_condition.terms_and_condition_content])
        end
    end
    context 'when an exception occurs' do
      before do
        allow(TermsAndCondition).to receive(:first).and_raise(StandardError.new('Something went wrong'))
      end

      VAR = URI.encode("http://www.example.com/account_block/accounts/term_and_condition")

      it 'renders an error response' do
        get VAR
        expect(response).to have_http_status(:internal_server_error)
        expect(JSON.parse(response.body)['errors']).to eq([{ 'policy' => 'No Data Found' }])
      end
    end
    describe '#search_params' do
      let(:params) { ActionController::Parameters.new(query: 'example_query', other_param: 'other_value') }

      before { allow(controller).to receive(:params).and_return(params) }

      it 'permits only the query parameter' do
        expect(controller.send(:search_params)).to eq({ 'query' => 'example_query' })
      end
    end
  end
end
