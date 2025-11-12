# frozen_string_literal: true

module BxBlockProfileBio
  class ProfileBio < BxBlockProfileBio::ApplicationRecord
    self.table_name = :profile_bios

    belongs_to :account, class_name: 'AccountBlock::Account'
    # has_one :preference,  dependent: :destroy
    has_many :educations, dependent: :destroy

    has_many :achievements, dependent: :destroy
    # has_and_belongs_to_many :categories,
    #                         join_table: :profile_bio_categories,
    #                         class_name: 'BxBlockCategories::Category'

    has_many :careers, dependent: :destroy
    # has_many :view_profiles,  dependent: :destroy
    # has_many :likes, as: :likeable, class_name: 'BxBlockLike::Like', dependent: :destroy
    # has_many :favourites, as: :favouriteable, class_name: 'BxBlockFavourites::Favourite', dependent: :destroy

    enum marital_status: %i[Single In-Relationship Engaged Married Divorced Widowed], _prefix: :marital_status
    enum smoking: %i[Yes No Sometimes], _prefix: :smoking
    enum drinking: %i[Yes No Occasionally], _prefix: :drinking
    # enum looking_for: %i[Friend Marriage Live-In Soul-Mate Business-Colleagues], _prefix: :looking_for
    enum height_type: %i[cm inches foot], _prefix: :height_type
    enum weight_type: %i[kg pounds(lbs)], _prefix: :weight_type

    enum body_type: %i[Athletic Average Fat Slim], _prefix: :body_type
    enum mother_tougue: %i[
      Arabic Bengali Chinese English French German Gujarati Hindi Indonesian Italian
      Japanese Malayalam Marathi Nepali Portuguese Punjabi Russian Spanish Swahili
      Tamil Telugu Turkish Urdu
    ], _prefix: :mother_tougue
    enum religion: %i[Buddhist Christian Hindu Jain Muslim Sikh], _prefix: :religion
    enum zodiac: %i[Aquarius Aries Cancer Capricorn Gemini Leo Libra Pisces Sagittarius Scorpio Taurus Virgo],
         _prefix: :zodiac

    validates :languages, presence: true
    # validates :height, :weight, :height_type, :weight_type, :body_type, :mother_tougue,
    # :religion, :zodiac, :marital_status, :languages, presence: true

    accepts_nested_attributes_for :educations, :achievements, :careers, allow_destroy: true
    # attr_accessor :distance_away, :is_liked, :is_favourite, :category_ids

    INTERESTS_VALUES = [
      'Sports', 'Fitness', 'Cooking', 'Traveling', 'Politics', 'Adventures', 'Music',
      'Pets', 'Mountains', 'Beaches', 'Cooking', 'Nature', 'Photography', 'Dancing',
      'Painting', 'Pets', 'Music', 'Puzzles', 'Gardening', 'Reading Books', 'Handicrafts',
      'Movies', 'Night Outs', 'Stargazing', 'Internet', 'Surfing', 'Traveling',
      'Chit Chat', 'Sports', 'Adventures', 'Trekking', 'Hiking', 'Yoga', 'Workouts',
      'Baking', 'Binge-Watching', 'Calligraphy', 'Blogging', 'Writing', 'Drama',
      'Home Improving', 'Journaling', 'Knitting', 'Martial Arts', 'Miniature Art',
      'Poetry', 'Sewing', 'Sketching', 'Singing', 'Video Gaming', 'Wood Carving',
      'Astronomy', 'Bird Watching', 'Fishing', 'Swimming', 'Nature'
    ].freeze

    PERSONALITY_VALUES = [
      'Extrovert', 'Introvert', 'Creative', 'Angry', 'Cool', 'Emotional', 'Practical',
      'Rules Breaker', 'Stick To Rules', 'Optimistic', 'Pessimist', 'Hard Work',
      'Smart Work', 'Spendthrift', 'Miser', 'Good Listener', 'Talks a Lot', 'Childish',
      'Matured', 'Patient', 'Impatient', 'Competitive', 'Relaxed', 'Last-Minute Person',
      'Pre-Planner', 'Foodie', 'Book Bug', 'Shopaholic', 'Morning Person', 'Night Owl'
    ].freeze

    # after_save :assign_categories
    # after_create :create_default_preference

    def match_profiles(params)
      return [] if params.nil?

      profiles = profiles_by_discover_for(params[:discover_for])
      profiles = sender_and_receiver_profiles(profiles)
      profiles = profiles_based_on_height(profiles)
      profiles = filter_by_gender(profiles, params[:seeking_for])
      profiles = filter_new_profiles(profiles, params)
      profiles = online_profiles(profiles, params)
      profiles = filter_by_age_range(profiles, preference.age_range_start, preference.age_range_end)
      profiles = preference_location(profiles)
      params[:location] = account.location.address
      filter_by_location(profiles, params)
    end

    def match_params
      params                = {}
      params[:smoking]      = preference.smoking     if preference.smoking.present?
      params[:drinking]     = preference.drinking    if preference.drinking.present?
      params[:religion]     = preference.religion    if preference.religion.present?
      params[:body_type]    = preference.body_type   if preference.body_type
      params
    end

    def profiles_based_on_height(profiles)
      if [preference.height_type, preference.height_range_start, preference.height_range_end].include?(nil)
        return profiles
      end

      params = height_params
      profiles_ids_1 = begin
        profiles.where(height: params[:height_start].to_f..params[:height_end].to_f,
                       height_type: params[:height_type]).map(&:id)
      rescue StandardError
        []
      end

      profiles_ids_2 = profiles.where(
        height: preference.height_range_start.to_f..preference.height_range_end.to_f,
        height_type: preference.height_type
        ).map(&:id)
      profiles.where(id: (profiles_ids_1 + profiles_ids_2).uniq)
    end

    def height_params
      params = {}
      case preference.height_type
      when 'foot'
        params = {
          height_start: (preference.height_range_start.to_f * 30.48).floor,
          height_end: (preference.height_range_end.to_f * 30.48).floor,
          height_type: 'cm'
        }
      when 'cm'
        params = {
          height_start: convert_cm_to_foot(preference.height_range_start.to_i),
          height_end: convert_cm_to_foot(preference.height_range_end.to_i),
          height_type: 'foot'
        }
      end
      params
    end

    def profiles_by_discover_for(discover_for)
      BxBlockProfileBio::ProfileBio.joins(:categories)
      .where(categories: {name: discover_for })
      .where(match_params).where.not(account_id: account.id).distinct
    end

    def sender_and_receiver_profiles(profiles)
      received_ids = profiles.includes(account: :requests).where(accounts: {
        requests: { account_id: account.id, status: 0 }
      }).map(&:id)
      sender_ids = profiles.includes(account: :requests).where(accounts: {
        requests: { sender_id: account.id, status: 0 }
      }).map(&:id)
      profiles_id = received_ids + sender_ids
      profiles = profiles.where.not(id: profiles_id.uniq)
    end

    def convert_cm_to_foot(height_value)
      height_data = (height_value / 2.54).round(8)
      height_foot = (height_data / 12).floor
      height_inches = (height_data - (12 * height_foot)).floor
      "#{height_foot}.#{height_inches}"
    end

    def preference_location(profiles)
      return profiles if preference.location.blank?
      results = Geocoder.search(preference.location)
      near_by = if preference.distance.present?
        account_locations.near(results.first.coordinates, preference.distance, units: :km)
      else
        account_locations.near(results.first.coordinates)
      end
      profiles.where(account_id: near_by.map(&:locationable_id))
    end

    def filter_profiles(profiles, params)
      profiles = filter_by_gender(profiles, params[:seeking_for])
      profiles = filter_by_location(profiles, params)
      profiles = filter_by_age_range(profiles, params[:age_range_start], params[:age_range_end])
      profiles = filter_new_profiles(profiles, params)
      filter_viewed_profiles(profiles, params)
    end

    def filter_by_gender(profiles, seeking_for)
      return profiles if seeking_for.blank? || seeking_for == 'Both'
      profiles.joins(:account).where(accounts: { gender: seeking_for })
    end

    def filter_by_age_range(profiles, age_range_start, age_range_end)
      return profiles if age_range_start.blank? || age_range_end.blank?

      profiles.joins(:account).where(accounts: {
        age: age_range_start.to_i..age_range_end.to_i
      }).distinct
    end

    def filter_new_profiles(profiles, params)
      return profiles unless ActiveModel::Type::Boolean.new.cast(params[:new_profiles])
      # get the 24 hours profiles
      profiles.where(created_at: Time.now.all_day).order('profiles.created_at desc')
    end

    def online_profiles(profiles, params)
      return profiles unless ActiveModel::Type::Boolean.new.cast(params[:online_profiles])

      ids = $redis_onlines.keys
      profiles = profiles.where(account_id: ids)
    end

    def filter_viewed_profiles(profiles, params)
      return profiles unless ActiveModel::Type::Boolean.new.cast(params[:viewed_profiles])
      profiles.includes(:view_profiles).where(view_profiles: { view_by_id: id })
    end

    def filter_by_location(profiles, params)
      return profiles if ActiveModel::Type::Boolean.new.cast(params[:recommended])==false || params[:location].blank?

      near_by = locations_by_geocoder(params)
      profiles.where(account_id: near_by.map(&:locationable_id))
    end

    def locations_by_geocoder(params)
      results = Geocoder.search(params[:location])
      params[:distance].blank? ?
        account_locations.near(results.first.coordinates) :
        account_locations.near(results.first.coordinates, params[:distance], units: :km)
    end

    def account_locations
      @locations ||= BxBlockLocation::Location.where(locationable_type: 'AccountBlock::Account')
    end

    def liked_profile(profiles)
      profiles.each do |profile|
        profile.is_liked = BxBlockLike::Like.find_by(
          like_by_id: account_id,
          likeable_id: profile.account.id,
          likeable_type: 'AccountBlock::Account'
        ).present?
      end
    end

    def favourite_profile(profiles)
      profiles.each do |profile|
        profile.is_favourite = BxBlockFavourites::Favourite.where(
          favourite_by_id: account_id, profile_bio_id: profile.id
        ).last&.status == 'Favourite'
      end
    end

    private

    def assign_categories
      return unless category_ids.present?

      categories.delete_all
      category_ids.each { |c| categories << BxBlockCategories::Category.find(c) }
      create_default_preference
    end

    def create_default_preference
      arr_hash1 = {}
      category_names.each { |name| arr_hash1[name.to_sym.downcase] = false }
      categories.reload.map(&:name).each { |c| arr_hash1[c.to_sym] = true }
      preference.present? ? preference.update(arr_hash1) : create_preference(arr_hash1)
    end

    def category_names
      BxBlockCategories::Category.all.pluck(:name)
    end

    def self.distance_calculate(accounts, user)
      accounts.each do |acc|
        next if user&.location.blank? || acc&.location.blank?
        user_location = [user.location.latitude, user.location.longitude]
        acc_location = [acc.location['latitude'], acc.location['longitude']]
        acc.distance_away = Geocoder::Calculations.distance_between(
          user_location, acc_location, units: :km).round(2)
      end
    end
  end
end
