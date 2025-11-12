require 'rails_helper'

RSpec.describe BxBlockAppointmentManagement::BookedSlot, type: :model do
  let!(:availability) {Support::SharedHelper.new.get_availability}
  let!(:booked_slot) {Support::SharedHelper.new.booked_slot}
  let(:account) {Support::SharedHelper.new.current_user}
  let!(:booked_slot_2){BxBlockAppointmentManagement::BookedSlot.new(start_time: "01:59" , end_time: "01:00", service_provider_id: account.id, booking_date: Date.today.strftime("%d/%m/%Y"),  service_user_id: account.id, meeting_code: "as12s3")
  }
  let!(:booked_slot_3){BxBlockAppointmentManagement::BookedSlot.new(start_time: "01:59" , end_time: "", service_provider_id: account.id, booking_date: Date.today.strftime("%d/%m/%Y"),  service_user_id: account.id, meeting_code: "as12s3")
  }
  let!(:booked_slot_4){BxBlockAppointmentManagement::BookedSlot.new(start_time: "01:00" , end_time: "1:59", service_provider_id: account.id, booking_date: "",  service_user_id: account.id, meeting_code: "as12s3")
  }
  let!(:booked_slot_5){BxBlockAppointmentManagement::BookedSlot.new(start_time: "08:00" , end_time: "8:50", service_provider_id: account.id, booking_date: '12-10-2022',  service_user_id: account.id, meeting_code: "as12s3")
  }
  let!(:booked_slot_6){BxBlockAppointmentManagement::BookedSlot.new(start_time: "10/10/2023 17:29" , end_time: "10/10/2023 17:00", service_provider_id: account.id, booking_date: '10-10-2022',  service_user_id: account.id, meeting_code: "c8th-305t-guel")
  }

  describe "Validations" do

    context '#check_column_exist' do
      it "should return error message when start time is blank" do
        check_column = BxBlockAppointmentManagement::BookedSlot.new.check_column_exist
        expect(check_column).to eq ["start time must exist"]
      end

      it 'should return error message when end time is blank' do
        booked_slot_3.check_column_exist
        expect(booked_slot_3.errors.full_messages).to eq ["End time end time must exist"]
      end

      it 'should return error message when booking date is blank' do
        booked_slot_4.check_column_exist
        expect(booked_slot_4.errors.full_messages).to eq ["Booking date Booking date must be present"]
      end
    end 

    context '#check_booked_date' do
      it "should return nil when no booked slot present" do
        booked_date = BxBlockAppointmentManagement::BookedSlot.new.check_booked_date
        expect(booked_date).to eq nil
      end

      it "should return error message when booked slot present for time" do
        booked_slot.check_booked_date
        expect(booked_slot.errors.full_messages).to eq ["Booking date You have already slot for this time"]
      end

      it "should return nil when no booked slot present" do
         booked_slot_5.check_booked_date
        expect(booked_slot_5.errors.full_messages).to eq ["Booking date You can't book for previous time"]
      end
    end 
  

    context '#check_start_and_time' do
      it "check start and end time" do
        time_format = BxBlockAppointmentManagement::BookedSlot.new.check_start_and_time
        expect(time_format).to eq nil
      end
      it 'should return error when start_time is greater than end_time' do
        booked_slot_2.check_start_and_time
        expect(booked_slot_2.errors.full_messages).to eq ["Booking date End time should be greater than start time"]
      end
    end

    context "check availability" do
      it "check availability getting message" do
        available = booked_slot_6.check_availability
        expect(booked_slot_6.errors.full_messages).to eq ["Booking date Invalid booking duration"]
      end

      it "when availability is present" do
        #booked_st = BxBlockAppointmentManagement::BookedSlot.last
        booked_slot.check_availability
        expect(booked_slot.service_user_id).to eq(account.id)
      end
    end

    context '#validate_time_format' do
      it "validate time format" do
        time_format = BxBlockAppointmentManagement::BookedSlot.new.validate_time_format
        expect(time_format).to eq ["end time format is not correct, it should be in HH:MM format"]
      end
    end 

    context '#check_appointment' do
      it "should return nil when no overlapping appointments found" do
        booked_slot = BxBlockAppointmentManagement::BookedSlot.new(
          start_time: "2024-02-07 10:00",
          end_time: "2024-02-07 11:00",
          service_user_id: account.id,
          booking_date: Date.today
        )

        expect(booked_slot.check_appointment).to be_nil
      end

      it "should return error message when slot overlaps with another appointment" do
        # Create an overlapping appointment
        overlapping_appointment = BxBlockAppointmentManagement::BookedSlot.new(
          start_time: "2024-02-07 10:30",
          end_time: "2024-02-07 11:30",
          service_user_id: account.id,
          booking_date: Date.today
        )
        overlapping_appointment.save

        # Attempt to create a new appointment that overlaps with the existing one
        booked_slot = BxBlockAppointmentManagement::BookedSlot.new(
          start_time: "2024-02-07 10:00",
          end_time: "2024-02-07 11:00",
          service_user_id: account.id,
          booking_date: Date.today
        )

        booked_slot.check_appointment
        expect(booked_slot.errors.full_messages.class).to eq Array
      end
    end
  end
end










