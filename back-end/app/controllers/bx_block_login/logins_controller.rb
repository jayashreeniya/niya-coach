module BxBlockLogin
  class LoginsController < ApplicationController
    include BuilderJsonWebToken::JsonWebTokenValidation
    before_action :validate_json_web_token, only: [:destroy]
    def create
      case params[:data][:type] #### rescue invalid API format
      when 'sms_account', 'email_account', 'social_account'
        account = OpenStruct.new(jsonapi_deserialize(params))
        account.type = params[:data][:type]

        output = AccountAdapter.new

        output.on(:account_not_found) do |account|
          render json: {
            errors: [{
              failed_login: 'Account not found or not activated',
            }],
          }, status: :unprocessable_entity
        end

        output.on(:failed_login) do |account|
          render json: {
            errors: [{
              failed_login: 'Login Failed',
            }],
          }, status: :unauthorized
        end

        #check
        output.on(:successful_login) do |account, token, refresh_token|
          account_user = AccountBlock::Account.find_by(email: account.email)
          if account_user && ['hr', 'employee'].include?(account_user.role&.name)
            account_status = StatusAudit.where(account_id: account_user.id).last
            
            if account_status&.logged_time&.year != Time.now.year && account_status&.logged_time.month != Time.now.month
              account_status = StatusAudit.create(account_id: account_user.id, active: true, logged_time: Time.now, month: Time.now.month)
            end
          end
          
          if account.role_id
            render json: {meta: {
              token: token,
              refresh_token: refresh_token,
              id: account.id,
              role: BxBlockRolesPermissions::Role.find(account&.role_id)&.name
            }}
          else
            render json: {meta: {
              token: token,
              refresh_token: refresh_token,
              id: account.id
            }}
          end
        end

        output.login_account(account)
      else
        render json: {
          errors: [{
            account: 'Invalid Account Type',
          }],
        }, status: :unprocessable_entity
      end
    end

    def destroy
      JwtDenyList.create(token: params[:token], account_id: current_user.id)
      render json: {message: "Logout Successfully"}
    end


    private
    def current_user
      return unless @token
      @current_user ||= AccountBlock::Account.find(@token.id)
    end
  end
end
