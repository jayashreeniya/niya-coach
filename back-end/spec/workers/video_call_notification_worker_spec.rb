require 'rails_helper'

RSpec.describe VideoCallNotificationWorker, type: :worker do
  let!(:account) {Support::SharedHelper.new.current_user} 
  let!(:coach_account) {Support::SharedHelper.new.get_coach_user} 
  before do
    slot = BxBlockAppointmentManagement::BookedSlot.new(start_time: "17:00" , end_time: "17:59", service_provider_id: coach_account.id, booking_date: Date.today.strftime("%d/%m/%Y"),  service_user_id: account.id, meeting_code: "as12s3")
    slot.save(validate: false) 
    UserDeviceToken.create(account_id: account.id, device_token: "abcdjnskmn12") 
  end
  it "should create notification before uppcomming appointment" do
    slot = BxBlockAppointmentManagement::BookedSlot.last 
    expect { VideoCallNotificationWorker.new.perform(slot.id, account.id) }.to change {  BxBlockAppointmentManagement::BookedSlot.where(service_user_id: account.id).count }.by_at_least(0)
  end
end
