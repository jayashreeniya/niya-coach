require 'rails_helper'

RSpec.describe BxBlockTimeTrackingBilling::TimeTrackService do
  describe '.call' do
    let(:current_user){Support::SharedHelper.new.current_user}
    let(:company) {  Company.find_by(employee_code: current_user.access_code)}

    let(:recent_entry) { double('TimeTrack', flag: false) }

    before do
      allow(BxBlockTimeTrackingBilling::TimeTrack).to receive(:where).and_return([recent_entry])
      allow(recent_entry).to receive(:touch)
    end

    context 'when flag is false' do
      it 'creates a new time track if no recent entry exist' do
        allow(BxBlockTimeTrackingBilling::TimeTrack).to receive(:last).and_return(nil)

        expect do
          described_class.call(current_user)
        end.to change(BxBlockTimeTrackingBilling::TimeTrack, :count).by(0)
      end

      it 'updates and creates a new time track if a recent entry exists' do
        expect(recent_entry).to receive(:touch)
        expect(recent_entry).to receive(:flag).and_return(true)
        expect(recent_entry).to receive(:update).with(flag: false)
        expect(BxBlockTimeTrackingBilling::TimeTrack).to receive(:create!).with(account_id: current_user&.id, company_id: company&.id)

        described_class.call(current_user)
      end
    end

    context 'when flag is true' do
      it 'updates the recent entry and creates a new time track' do
        expect(recent_entry).to receive(:touch)
        expect(recent_entry).to receive(:update).with(flag: false)
        expect(BxBlockTimeTrackingBilling::TimeTrack).to receive(:create!).with(account_id: current_user&.id, company_id: company&.id, flag: true)

        described_class.call(current_user, true)
      end
    end
  end
end