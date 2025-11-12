# spec/factories/requests.rb
FactoryBot.define do
  factory :request, class: 'BxBlockRequestManagement::Request' do
    status { nil }
  end
end
