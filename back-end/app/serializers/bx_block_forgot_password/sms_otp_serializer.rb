module BxBlockForgotPassword
  class SmsOtpSerializer < BaseSerializer
    attributes :full_phone_number, :activated, :created_at
    attributes :pin, :valid_until
  end
end
