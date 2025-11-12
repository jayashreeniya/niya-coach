module BxBlockForgotPassword
  class EmailOtpMailer < ApplicationMailer
    def otp_email
      @account = params[:otp]
      @host = params[:host]
      mail(
          to: @account.email,
          subject: 'Reset Your Password ') do |format|
        format.html { render 'bx_block_forgot_password/email_otp.html.erb' }
      end
    end
    
  end
end
