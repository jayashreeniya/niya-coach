require 'rails_helper'

RSpec.describe BxBlockAppointmentManagement::CoachLeave, type: :model do
  describe '#coach_off_time' do
    let(:account){Support::SharedHelper.new.current_user}
    let(:coach_leave) { create(:coach_leave, account: account) }

    before do
      # Create some availability records for the account
      create(:availability, service_provider: account)
    end

    it 'deletes coach off availability records' do
      # Create coach off dates
      coach_leave_dates = [Date.today, Date.tomorrow]
      coach_leave_dates.each do |date|
        create(:coach_leave, account: account, start_date: date)
      end

      expect {
        coach_leave.send(:coach_off_time)
        expect(response).to have_http_status(:ok)
      }
      coach_leave_dates.each do |date|
        expect(BxBlockAppointmentManagement::Availability.where(service_provider: account, availability_date: date).exists?).to be_falsey
      end
    end
  end
end
