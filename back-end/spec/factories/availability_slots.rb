FactoryBot.define do
  
  factory :availability_slot, class: 'BxBlockAppointmentManagement::AvailabilitySlot' do
    # Define factory attributes here
    
    from { Time.now }
    to { Time.now + 59.minutes }
    booked_slot { false }
    availability_id { 1}
    timeslots = {
     to: "06:59 AM",
     sno: "1",
     from: "06:00 AM",
     booked_status: false
   }
  end

  factory :availability, class: 'BxBlockAppointmentManagement::Availability' do
    # Define factory attributes here

    service_provider_id {1}
      start_time {"11:00 AM"}
      end_time {"02:00 PM"}
      availability_date {"01/02/2023"}
      timeslots = {
         to: "06:59 AM",
         sno: "1",
         from: "06:00 AM",
         booked_status: false
   }
  end
end





