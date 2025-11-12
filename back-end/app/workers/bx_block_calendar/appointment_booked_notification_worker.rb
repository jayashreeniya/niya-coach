require 'googleauth'
require 'fcm'
module BxBlockCalendar
  class AppointmentBookedNotificationWorker 
    include Sidekiq::Worker
    # queue_as :default

    FCM_CREDENTIALS_PATH = Rails.root.join('config', 'fcm_push_notification.json').to_s
    def perform(current_user_id, booking_date, start_time)
      device_token = UserDeviceToken.find_by(account_id: current_user_id)&.device_token

      fcm_client = FCM.new(FCM_CREDENTIALS_PATH, product_id_method)
      options = {
        data: {
          type: 'booking'
        },
        notification: {
          title: "Appointment Booked",
          body: "Your appointment is booked successfully for " + Date.parse(booking_date).strftime("%d/%m/%Y") + ' at ' + Time.parse(start_time).strftime("%I:%M:%S %p")

        }
      }
      message = options.merge(token: device_token)
      response = fcm_client.send_v1(message)
      Rails.logger.info("FCM Push Notification- #{response}")
    end

    private

    def product_id_method
      scope = "https://www.googleapis.com/auth/firebase.messaging"
      authorizer = Google::Auth::ServiceAccountCredentials.make_creds(json_key_io: File.open(FCM_CREDENTIALS_PATH), scope: scope)
      authorizer.project_id
    end
  end
end
