FactoryBot.define do
  factory :coach_leave, class: 'BxBlockAppointmentManagement::CoachLeave' do
    association :account, factory: :account_block_account
    start_date { Date.today }
  end
end
