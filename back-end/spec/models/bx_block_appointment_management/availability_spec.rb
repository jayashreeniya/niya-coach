require 'rails_helper'
  RSpec.describe BxBlockAppointmentManagement::Availability, type: :model do

  let!(:get_coach_user) {Support::SharedHelper.new.get_coach_user}
  let!(:account) {Support::SharedHelper.new.current_user}
  let!(:availability) {Support::SharedHelper.new.get_availability}


  describe "Associations" do
    it { should belong_to(:service_provider) }
  end

  describe "Validations" do
    it "Availability date should present" do
      expect(availability.availability_date.present?).to eq true
    end
   
     it "start time should present" do
      expect(availability.start_time.present?).to eq true
     end

     it "end time should present" do
      expect(availability.end_time.present?).to eq true
     end
  end

  describe "scope" do
    STRFTIME="%d/%m/%Y"
    it "return service provider details" do
      sp_details = BxBlockAppointmentManagement::Availability.sp_details(account.id, Date.today.strftime(STRFTIME))
      expect(sp_details).to eq availability
    end

    it "return todays availabilities" do
      available = BxBlockAppointmentManagement::Availability.todays_availabilities
      expect(available.availability_date.present?).to eq true
    end

    it "return Availability filter by date" do
      filter_date_availabilities = BxBlockAppointmentManagement::Availability.filter_by_date((Date.today).strftime("%d/%m/%Y"))
      expect(filter_date_availabilities.count).to be >= 1
    end

    it "return service provider availability" do
      available_service_provider = BxBlockAppointmentManagement::Availability.available_service_provider((Date.today).strftime("%d/%m/%Y"))
      expect(available_service_provider.present?).to eq true
    end
  end

  describe "we test the Availability class" do
    it "return today online hours" do
      availability.service_provider_id.present?
      available_hours = availability.todays_online_hours
      available = available_hours
      expect(available).to eq 34.16666666666667
    end

    it "return slots list" do
      booked_slot = Support::SharedHelper.new.booked_slot
      available = availability.slots_list
      expect(available.class).to eq Array
    end

    it "return slot count" do
      available = availability.update_slot_count
      expect(available).to eq true
    end
  end
end
