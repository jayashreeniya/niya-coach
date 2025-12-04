module BxBlockForgotPassword
  class OtpConfirmationsController < ApplicationController
    skip_before_action :verify_authenticity_token
    def create
      if params[:new_password].present? && params[:confirm_password].present? && params[:token].present?
        # Try to decode token with OTP information
        begin
          @token = BuilderJsonWebToken.decode(params[:token])
        rescue JWT::DecodeError => e
          return render json: {
            errors: [{
              token: 'Invalid token',
            }],
          }, status: :bad_request
        end
        begin
          @account = @token.type.constantize.find(@token.id)
        rescue ActiveRecord::RecordNotFound => e
          return render json: {
            errors: [{
              otp: 'Token invalid',
            }],
          }, status: :unprocessable_entity
        end
        if params[:new_password] == params[:confirm_password]
          @account.update(password: params[:new_password])
          render json: {
            messages: [{
              password: 'Password updated successfully',
            }],
          }, status: :created
        else
          return render json: {
            errors: [{
              otp: 'Password Not Match',
            }],
          }, status: :unprocessable_entity
        end
      else
        return render json: {
          errors: [{
            otp: 'Token and password are required',
          }],
        }, status: :unprocessable_entity
      end
    end

    def otp_confirmation
      if params[:otp].present? && params[:token].present?
        # Try to decode token with OTP information
        begin
          @token = BuilderJsonWebToken.decode(params[:token])
        rescue JWT::DecodeError => e
          return render json: {
            errors: [{
              token: 'Invalid token',
            }],
          }, status: :bad_request
        end
        begin
          @account = @token.type.constantize.find(@token.id)
        rescue ActiveRecord::RecordNotFound => e
          return render json: {
            errors: [{
              otp: 'Token invalid',
            }],
          }, status: :unprocessable_entity
        end
        email_otp = AccountBlock::EmailOtp.where(email: @account.email).last
        sms_otp = AccountBlock::SmsOtp.where(full_phone_number: @account.full_phone_number).last

        if email_otp&.pin.to_s == params[:otp].to_s || sms_otp&.pin.to_s == params[:otp].to_s
          render json: {message: "otp validation successfully."},status: :ok
          AccountBlock::EmailOtp.where(email: @account.email).delete_all
          AccountBlock::SmsOtp.where(full_phone_number: @account.full_phone_number).delete_all
         else 
           render json: {errors: [{otp: "OTP incorrect",}],}, status: :unprocessable_entity
         end 
      else 
        render json: {errors: [{otp: "Params is missing.",}],}, status: :unprocessable_entity
      end 
      
    end

    private

    def create_params
      params.require(:data)
        .permit(*[
          :email,
          :full_phone_number,
          :token,
          :password_confirmation,
          :new_password,
        ])
    end
  end
end
