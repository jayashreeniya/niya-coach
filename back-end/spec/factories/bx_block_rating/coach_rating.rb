FactoryBot.define do
  factory :coach_rating, class: 'BxBlockRating::CoachRating' do
    feedback {'test feedback'}
    coach_rating {rand(0..5)}
  end
end
