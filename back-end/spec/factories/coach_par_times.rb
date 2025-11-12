FactoryBot.define do
  factory :coach_par_time, class: BxBlockAppointmentManagement::AvailableTime do
    association :coach_par_avail, factory: :coach_par_avail
    # Other attributes for coach_par_time
    from { "09:00" }
    to { "10:00" }
    booked_slot { false }
  end
end
