FactoryBot.define do
  factory :hr_account, class: 'AccountBlock::Account' do
  	full_name { 'test hr' }
    email { "test#{rand(100000..999999)}@example.com" }
    password { 'Test@123' }
    password_confirmation { 'Test@123' }
    role_id { create(:role, name: "hr").id }
    full_phone_number { "91#{rand(7999999999..9999999999)}" }
  end
end