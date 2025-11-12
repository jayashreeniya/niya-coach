# frozen_string_literal: true

module BxBlockProfileBio
  class ProfileBioSerializer < BaseSerializer
    attributes(:created_at, :updated_at)

    attribute :account_id do |object|
      object&.profile_bio&.account_id
    end

    attribute :height do |object|
      object&.profile_bio&.height
    end

    attribute :weight do |object|
      object&.profile_bio&.weight
    end

    attribute :height_type do |object|
      object&.profile_bio&.height_type
    end

    attribute :weight_type do |object|
      object&.profile_bio&.weight_type
    end

    attribute :body_type do |object|
      object&.profile_bio&.body_type
    end

    attribute :mother_tougue do |object|
      object&.profile_bio&.mother_tougue
    end

    attribute :religion do |object|
      object&.profile_bio&.religion
    end

    attribute :zodiac do |object|
      object&.profile_bio&.zodiac
    end

    attribute :marital_status do |object|
      object&.profile_bio&.marital_status
    end

    attribute :languages do |object|
      object&.profile_bio&.languages
    end

    attribute :about_me do |object|
      object&.profile_bio&.about_me
    end

    attribute :personality do |object|
      object&.profile_bio&.personality
    end

    attribute :interests do |object|
      object&.profile_bio&.interests
    end

    attribute :smoking do |object|
      object&.profile_bio&.smoking
    end

    attribute :drinking do |object|
      object&.profile_bio&.drinking
    end

    attribute :education_details do |object|
      qualifications_for object
    end

    attribute :achievements do |object|
      achievements_for object
    end

    attribute :looking_for do |object|
      object&.categories&.map(&:name)
    end

    attribute :professional_details do |object|
      careers_for object
    end

    attribute :account_details do |object|
      AccountBlock::AccountSerializer.new(object)
    end

    attribute :is_profile do |object|
      object&.profile_bio.present?
    end

    class << self
      private

      def qualifications_for(object)
        return [] if object&.profile_bio&.educations.blank?

        object&.profile_bio&.educations
      end

      def achievements_for(object)
        return [] if object&.profile_bio&.achievements.blank?

        object&.profile_bio&.achievements
      end

      def careers_for(object)
        return [] if object&.profile_bio&.careers.blank?

        object&.profile_bio&.careers
      end
    end
  end
end
