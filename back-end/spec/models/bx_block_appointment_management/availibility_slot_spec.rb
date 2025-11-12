require 'rails_helper'

RSpec.describe BxBlockAppointmentManagement::AvailabilitySlot, type: :model do

  before(:each) do

    @coach = AccountBlock::Account.new(full_name: "idea coach", full_phone_number: "919098065325", activated: true, role_id: 4, expertise: ["Career Management"], password: "Rails@123")
    @coach.save(validate: false)
    @availability = BxBlockAppointmentManagement::Availability.create(service_provider_id: @coach.id, start_time: "11:00 AM", end_time: "11:59 AM", availability_date: "02/09/2024")
    @availability_slot = BxBlockAppointmentManagement::AvailabilitySlot.create(from: "06:00 AM", to: "06:59 AM", booked_slot: false, sno: "1", availability_id: @availability.id)
  end

  describe 'validations' do
    
    it 'validates the time gap between start and end time' do
      @availability_slot.from = '06:00 AM'
      @availability_slot.to = '06:59 AM'

      expect(@availability_slot).to be_valid

      @availability_slot.from = '07:00 AM'
      @availability_slot.to = '08:59 AM'
      expect(@availability_slot).not_to be_valid
      expect(@availability_slot.errors[:end_time]).to include('must be within 59 minutes of the start time')
    end
  end

  describe 'callbacks' do
    describe 'after_create' do
      # let(:availability) { create(:availability) } # Assuming you have a factory defined for Availability

      it 'updates the availability timeslots' do
        # availability_slot = build(:availability_slot, availability: availability)

        expect {
          @availability_slot.save
        }.to change { @availability.reload.timeslots.size }.by(0)

        new_timeslot = @availability.timeslots.last
        expect(new_timeslot['from']).to eq(@availability_slot.from)
        expect(new_timeslot['to']).to eq(@availability_slot.to)

        # expect(new_timeslot['sno']).to eq(availability.timeslots.size)
        # expect(new_timeslot['booked_status']).to eq(@availability_slot.booked_slot)
      end
    end
  end
end
