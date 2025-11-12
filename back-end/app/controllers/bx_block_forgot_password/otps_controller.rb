module BxBlockForgotPassword
  class OtpsController < ApplicationController
    def create
      if params['email'].present?
        @email_account = AccountBlock::Account.where("LOWER(email) = ?", params['email'].downcase).last
      elsif params['full_phone_number'].present?
        phone = Phonelib.parse(params['full_phone_number']).sanitized
        unless Phonelib.valid?(phone)
          return render json: {
            errors: [{
              full_phone_number: 'Invalid phone number format',
            }],
          }, status: :unprocessable_entity
        end
        @sms_account = AccountBlock::Account.where(full_phone_number:  params['full_phone_number']).last
      else
        return render json: {
          errors: [{
            otp: 'Email or phone number are required',
          }],
        }, status: :unprocessable_entity
      end  

      if @sms_account.present?
        sms_otp = AccountBlock::SmsOtp.new(full_phone_number: @sms_account.full_phone_number)
        if sms_otp.save
          render json: { message: "sms otp sent successfully.", meta: { token: token_for(@sms_account, @sms_account.id) } }, status: :ok
        else
          render json: { errors: "Unable to sent otp due to invalid number" }, status: :unprocessable_entity 
        end
      elsif @email_account.present?
        email_otp = AccountBlock::EmailOtp.new(email: @email_account.email)
        if email_otp.save
          send_email_for email_otp
          render json: { message: "OTP sent successfully.",meta: {token: token_for(@email_account, @email_account.id)}}
        end 
      else 
         render json: {errors: [{account: "Account not found",}],}, status: :unprocessable_entity
      end
    end

    private

    def send_email_for(otp_record)
      EmailOtpMailer
        .with(otp: otp_record, host: request.base_url)
        .otp_email.deliver_later
    end

    def token_for(otp_record, account_id)
      BuilderJsonWebToken.encode(
        otp_record.id,
        5.minutes.from_now,
        type: otp_record.class,
        account_id: account_id,
        token_type: 'forgot_password',
        activated: false
      )
    end
  end
end
