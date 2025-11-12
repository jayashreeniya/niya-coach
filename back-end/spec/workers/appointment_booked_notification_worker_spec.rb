require 'rails_helper'
require 'googleauth'
RSpec.describe BxBlockCalendar::AppointmentBookedNotificationWorker, type: :worker do
  describe '#perform' do
    let(:worker) { described_class.new }
    let(:current_user_id) { 1 }
    let(:booking_date) { '2024-06-12' }
    let(:start_time) { '08:00:00' }
    let(:device_token) { 'device_token' }
    let(:fcm_client) { instance_double(FCM) }
    let(:access_token) { 'mock_access_token' }
    let(:project_id) { 'mock_project_id' }
    FCM_CREDENTIALS_PATH = Rails.root.join('config', 'fcm_push_notification.json').to_s
    
    before do
      allow(UserDeviceToken).to receive(:find_by).with(account_id: current_user_id).and_return(double(device_token: device_token))
      allow(worker).to receive(:product_id_method).and_return(project_id)
      allow(FCM).to receive(:new).with(FCM_CREDENTIALS_PATH, project_id).and_return(fcm_client)
    end

    it 'sends FCM notification to the user' do
      notification_options = {
        data: { type: 'booking' },
        notification: {
          title: 'Appointment Booked',
          body: "Your appointment is booked successfully for #{Date.parse(booking_date).strftime('%d/%m/%Y')} at #{Time.parse(start_time).strftime('%I:%M:%S %p')}"
        }
      }

      allow(fcm_client).to receive(:send_v1).with(notification_options.merge(token: device_token))

      worker.perform(current_user_id, booking_date, start_time)

      expect(UserDeviceToken).to have_received(:find_by).with(account_id: current_user_id)
      expect(FCM).to have_received(:new).with(FCM_CREDENTIALS_PATH, project_id)
      expect(fcm_client).to have_received(:send_v1).with(notification_options.merge(token: device_token))
    end
  end

  describe '#product_id_method' do
    let(:worker) { described_class.new }
    let(:mock_authorizer) { instance_double(Google::Auth::ServiceAccountCredentials) }
    let(:mock_project_id) { 'mock_project_id' }

    before do
      allow(File).to receive(:open).with(FCM_CREDENTIALS_PATH).and_return(double)
      allow(Google::Auth::ServiceAccountCredentials).to receive(:make_creds)
        .with(json_key_io: anything, scope: 'https://www.googleapis.com/auth/firebase.messaging')
        .and_return(mock_authorizer)
      allow(mock_authorizer).to receive(:project_id).and_return(mock_project_id)
    end

    it 'returns the project id' do
      expect(worker.send(:product_id_method)).to eq(mock_project_id)
    end
  end
end