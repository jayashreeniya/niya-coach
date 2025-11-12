module BxBlockPushNotifications
  class PushNotificationsController < ApplicationController
    before_action :current_user
    # require 'fcm' - FCM gem not available in production

    def device_token
      if current_user
        user = UserDeviceToken.where(account_id: current_user.id).last
        if user.present?
          user.update(device_token: params[:device_token])
          return render json: {data: user}
        else
          user = UserDeviceToken.create(account_id: current_user.id, device_token: params[:device_token])
          return render json: {data: user}
        end
      end
    end

    def send_notifications
      role=params[:role]
      account_ids=AccountBlock::Account.where(role_id: BxBlockRolesPermissions::Role.find_by_name(role).id).pluck(:id) if role.present?
      account_token = UserDeviceToken.where(account_id: account_ids)
      #fcm_client = FCM.new(ENV['FCM_SERVER_KEY'])
      fcm_server_key = "AAAAD0jZVj4:APA91bGItqEdU6D10bq_b0MfmXUq6r0gdI-7Q7qcGwjpN4VthfXSFK0-QMQugF4CqKRySYD09gL4lQziv2QTTAEdx1qzF0lkQ0Eca-uqd7yQuuFW1KlIs3m-xMnxwspkJBqlWNNB-anT"
      fcm_client = FCM.new(fcm_server_key)
      options = {
        priority: "high",
        collapse_key: "updated_score",
        data: {
          type: params[:role]
        },
        notification: {
            title: params[:title],  
            body:params[:desc]
          }
        }
      registration_ids = account_token.pluck(:device_token)

      begin
        registration_ids.each_slice(20) do |registration_id|
          response = fcm_client.send(registration_id, options)
        end
        render json: {message: "Notification sent"}
      rescue => e
        p 'Rescue push notification----------->' + e
      end
    end

    # def index
    #   push_notifications = current_user.push_notifications
    #   if push_notifications.present?
    #     serializer = BxBlockPushNotifications::PushNotificationSerializer.new(
    #       push_notifications
    #     )
    #     render json: serializer.serializable_hash, status: :ok
    #   else
    #     render json: {
    #       errors: 'There is no push notification.'
    #     }, status: :not_found
    #   end
    # end

    # def create
    #   push_notification = BxBlockPushNotifications::PushNotification.new(
    #     push_notifications_params.merge({account_id: current_user.id})
    #   )
    #   if push_notification.save
    #     serializer = BxBlockPushNotifications::PushNotificationSerializer.new(push_notification)
    #     render json: serializer.serializable_hash, status: :ok
    #   else
    #     render json: {
    #       errors: [{
    #           push_notification: push_notification.errors.full_messages
    #       }]
    #     }, status: :unprocessable_entity
    #   end
    # rescue Exception => push_notification
    #   render json: {errors: [{push_notification: push_notification.message}]},
    #     status: :unprocessable_entity
    # end

    # def update
    #   push_notification = BxBlockPushNotifications::PushNotification.find_by(
    #     id: params[:id], push_notificable_id: current_user.id
    #   )
    #   return render json: { message: "Not Found" },
    #     status: :not_found if push_notification.blank?

    #   if push_notification.update(push_notifications_params)
    #     serializer = BxBlockPushNotifications::PushNotificationSerializer.new(push_notification)
    #     render json: serializer.serializable_hash,
    #       status: :ok
    #   else
    #     render json: { errors: [{push_notification: push_notification.errors.full_messages}]},
    #       status: :unprocessable_entity
    #   end
    # rescue Exception => push_notification
    #   render json: {errors: [{push_notification: push_notification.message}]},
    #     status: :unprocessable_entity
    # end

    # def show
    #   push_notification = current_user.push_notifications.find(params[:id])

    #   if push_notification.blank?
    #     render json: { message: "Push Notification Not Found" },
    #     status: :not_found
    #   else
    #     render json: BxBlockPushNotifications::PushNotificationSerializer.new(push_notification)
    #   end
    # end

    private

    def current_user
      return unless @token
      @current_user ||= AccountBlock::Account.find(@token.id)
    end

    def push_notifications_params
      params.require(:data)[:attributes].permit(
        :push_notificable_id,
        :push_notificable_type,
        :remarks, :is_read
      )
    end
  end
end
