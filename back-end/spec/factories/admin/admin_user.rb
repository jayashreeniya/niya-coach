FactoryBot.define do
  factory :admin_user, class: 'AdminUser' do
    email { "test#{rand(100_000..999_999)}@example.com" }
    password { 'Password' }
    password_confirmation { 'Password' }
  end
end