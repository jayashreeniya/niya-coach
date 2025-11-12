class AppointmentNotificationWorker
  include Sidekiq::Worker
  
   FCM_CREDENTIALS_PATH = Rails.root.join('config', 'fcm_push_notification.json').to_s
  def perform(appointment_id)
    appointment = BxBlockAppointmentManagement::BookedSlot.find(appointment_id)
    device_token = UserDeviceToken.find_by(account_id: appointment.service_user_id)&.device_token
    device_token1 = UserDeviceToken.find_by(account_id: appointment.service_provider_id)&.device_token
    user_name = AccountBlock::Account.find(appointment.service_user_id).full_name
    coach_name = AccountBlock::Account.find(appointment.service_provider_id).full_name

    fcm_client = FCM.new(
      FCM_CREDENTIALS_PATH,
      product_id_method
    )

    options = {
      data: {
        type: 'notification'
      },
      notification: {
        title: "Upcoming Appointment",
        body: "You have a session with the coach #{coach_name} just after 10 minutes"
      }
    }
    options1 = {
      data: {
        type: 'notification'
      },
      notification: {
        title: "Upcoming Appointment",
        body: "You have a session with the user #{user_name} just after 10 minutes"
      }
    }
    message = options.merge(token: device_token)
    response = fcm_client.send_v1(message)
    Rails.logger.info("FCM Push Notification- #{response}")

    message = options1.merge(token: device_token1)
    response = fcm_client.send_v1(message)
    Rails.logger.info("FCM Push Notification- #{response}")

  end

   private
    def access_token_method
      scope = "https://www.googleapis.com/auth/firebase.messaging"
      authorizer = Google::Auth::ServiceAccountCredentials.make_creds(json_key_io: File.open(FCM_CREDENTIALS_PATH), scope: scope)
      authorizer.fetch_access_token!
      return authorizer.access_token
    end

    def product_id_method
      scope = "https://www.googleapis.com/auth/firebase.messaging"
      authorizer = Google::Auth::ServiceAccountCredentials.make_creds(json_key_io: File.open(FCM_CREDENTIALS_PATH), scope: scope)
      authorizer.project_id
    end
end
