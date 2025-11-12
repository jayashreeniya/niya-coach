# spec/factories/accounts.rb
ROLE = 'BxBlockRolesPermissions::Role'
FactoryBot.define do
  factory :account_block_account, class: 'AccountBlock::Account' do
    full_name { 'hello bhai'}
    email { "john.doe#{rand(100_000..999_999)}@example.com" }
    password { 'password123' }
    full_phone_number { "#{rand(1111111111..9999999999)}" }
    gender { 'Male' }
    status { 'regular' }
    activated { true }
    access_code { "#{create(:companny, id: rand(1..1000)).employee_code}"}
    trait :suspended do
      status { 'suspended' }
    end

    trait :deleted do
      status { 'deleted' }
    end

    trait :with_image do
      image { Rack::Test::UploadedFile.new(Rails.root.join('spec', 'support', 'images', 'sample.jpg'), 'image/jpg') }
    end

    trait :with_choose_motion_answer do
      after(:create) do |account|
        create(:choose_motion_answer, account: account)
      end
    end

    trait :hr_role do
      after(:create) do |account|
        create(:company, hr_code: account.access_code)
        account.role = create(:hr_role)
        account.save
      end
    end

    trait :employee_role do
      after(:create) do |account|
        create(:company, employee_code: account.access_code)
        account.role = create(:employee_role)
        account.save
      end
    end

    trait :coach_role do
      after(:create) do |account|
        account.role = create(:coach_role)
        account.save
      end
    end
  end

  factory :choose_motion_answer, class: 'BxBlockAssessmenttest::ChooseMotionAnswer' do
    # Add your attributes here
    # For example:
    association :account, factory: :account_block_account
    # Add other attributes as needed
  end

  factory :hr_role, class: ROLE do
    name { 'hr' }
  end

  factory :employee_role, class: ROLE do
    name { 'employee' }
  end

  factory :coach_role, class: ROLE do
    name { 'coach' }
  end

  factory :status_audit, class: StatusAudit do
    logged_time { Time.now }
  end

  factory :companny, class: 'Company' do
    name {[*('A'..'Z')].sample(8).join}
    email { "test#{rand(100_000..999_999)}@company.com" }
    address { 'India' }
    hr_code { SecureRandom.alphanumeric(6) }
    employee_code { SecureRandom.alphanumeric(7) }
  end
 
end
