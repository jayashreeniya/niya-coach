# Microsoft 365 / Office 365 SMTP Configuration
Rails.application.configure do
  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    address: 'smtp.office365.com',
    port: 587,
    domain: 'niya.app',
    user_name: ENV['MICROSOFT_EMAIL_USERNAME'], # hello@niya.app
    password: ENV['MICROSOFT_EMAIL_PASSWORD'],
    authentication: :login,
    enable_starttls_auto: true
  }
  config.action_mailer.perform_deliveries = true
  config.action_mailer.raise_delivery_errors = true
end











