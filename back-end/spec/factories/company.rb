FactoryBot.define do
  factory :company, class: 'Company' do
    name {[*('A'..'Z')].sample(8).join}
    email { "test#{rand(100_000..999_999)}@company.com" }
    address { 'India' }
    hr_code { SecureRandom.alphanumeric(6) }
    employee_code { SecureRandom.alphanumeric(7) }
  end
end

