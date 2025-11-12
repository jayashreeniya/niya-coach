class VideoCallNotificationWorker
  include Sidekiq::Worker
  
  FCM_CREDENTIALS_PATH = Rails.root.join('config', 'fcm_push_notification.json').to_s
  def perform(appointment_id ,current_user)
    appointment = BxBlockAppointmentManagement::BookedSlot.find(appointment_id)
    other_person = reciever_account(appointment ,current_user)
    waiting = waiting_account(appointment,current_user)
    device_token = UserDeviceToken.find_by(account_id: other_person.id)&.device_token
    reciever = AccountBlock::Account.find(other_person.id).full_name
    device_token1 = UserDeviceToken.find_by(account_id: waiting.id)&.device_token
    waiting_account = AccountBlock::Account.find(waiting.id).full_name
    # video_call_details = VideoCallDetail.find_by(booked_slot_id: appointment_id)
     
    fcm_client = FCM.new(
        FCM_CREDENTIALS_PATH,
        product_id_method
    )

    options = {
      data: {
        type: 'notification'
      },
      notification: {
        title: "Waiting for call",
        body: "Hi #{reciever} , Please join call #{waiting.full_name} waiting for you !"
      }
    }

    message = options.merge(token: device_token)
    response = fcm_client.send_v1(message)
    Rails.logger.info("FCM Push Notification- #{response}")

    fcm_client = FCM.new(
        FCM_CREDENTIALS_PATH,
        product_id_method
    )

    options = {
      data: {
        type: 'notification'
      },
      notification: {
        title: "Call started",
        body: "Hi #{waiting_account} , You have joined the call. You may leave after 15 mins if the other person doesn't join.!"
      }
    }

    message = options.merge(token: device_token1)
    response = fcm_client.send_v1(message)
    Rails.logger.info("FCM Push Notification- #{response}")
  end
  
  def reciever_account(appointment , current_user)
    if current_user != appointment.service_provider_id
      account = AccountBlock::Account.find_by(id: appointment.service_provider_id)
    else
      account = AccountBlock::Account.find_by(id: appointment.service_user_id)
    end
    return account
  end

  def waiting_account(appointment, current_user)
    if current_user == appointment.service_provider_id
      account = AccountBlock::Account.find_by(id: appointment.service_provider_id)
    else
      account = AccountBlock::Account.find_by(id: appointment.service_user_id)
    end
    return account
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
