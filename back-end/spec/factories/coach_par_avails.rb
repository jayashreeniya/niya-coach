FactoryBot.define do
  factory :coach_par_avail, class: BxBlockAppointmentManagement::CoachParAvail do
    association :account, factory: :account_block_account
    # Other attributes for coach_par_avail
    start_date { Date.today }
    end_date { Date.today + 7.days }

    after(:build) do |coach_par_avail|
      # Create associated coach_par_times
      coach_par_avail.coach_par_times << build(:coach_par_time, coach_par_avail: coach_par_avail)
    end
  end
end
