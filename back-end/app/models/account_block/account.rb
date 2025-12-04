module AccountBlock
  class Account < AccountBlock::ApplicationRecord
    self.table_name = :accounts
    
    # Disable STI to prevent inheritance issues
    self.inheritance_column = nil

    include Wisper::Publisher
    has_many :provider_booked_slots, class_name: 'BxBlockAppointmentManagement::BookedSlot', foreign_key: "service_provider_id"
    has_many :top_focus_areas, class_name: 'TopfocusArea'
    has_many :user_booked_slots, class_name: 'BxBlockAppointmentManagement::BookedSlot', foreign_key: "service_user_id"
    has_many :provider_booked_slots, class_name: 'BxBlockSharecalendar::BookedSlot', foreign_key: "service_provider_id"
    has_many :user_booked_slots, class_name: 'BxBlockSharecalendar::BookedSlot', foreign_key: "service_user_id"
    has_many :coach_leaves, class_name: "BxBlockAppointmentManagement::CoachLeave"
    has_many :coach_par_avails, class_name: "BxBlockAppointmentManagement::CoachParAvail"
    accepts_nested_attributes_for :coach_par_avails, allow_destroy: true
    
    # Log when coach_par_avails_attributes are being processed
    before_save :log_coach_par_avails_attributes, if: -> { coach_par_avails_attributes.present? }
    
    def log_coach_par_avails_attributes
      Rails.logger.info "=== MODEL: coach_par_avails_attributes DETECTED ==="
      Rails.logger.info "Account ID: #{self.id}"
      Rails.logger.info "coach_par_avails_attributes: #{coach_par_avails_attributes.inspect}"
    end
    has_many :user_languages, class_name: "UserLanguage"

    has_secure_password
    before_validation :parse_full_phone_number
    has_many :action_items, class_name: 'BxBlockAssessmenttest::ActionItem', dependent: :destroy
    has_many :goals, class_name: 'BxBlockAssessmenttest::Goal', dependent: :destroy
    has_many :assess_select_answers, class_name: 'BxBlockAssessmenttest::AssessSelectAnswer', dependent: :destroy
    belongs_to :role,  class_name: 'BxBlockRolesPermissions::Role', optional: true
    has_many :focus_areas, class_name: 'BxBlockAssessmenttest::FocusArea'
    has_many :choose_answers, class_name: 'BxBlockAssessmenttest::ChooseAnswer', dependent: :destroy
    has_many :select_answers, class_name: 'BxBlockAssessmenttest::SelectAnswer', dependent: :destroy
    has_many :user_question_answers , class_name: 'UserQuestionAnswer'
    has_one :motion, class_name: 'BxBlockAssessmenttest::Motion'
    has_one :choose_motion_answer, class_name: 'BxBlockAssessmenttest::ChooseMotionAnswer', dependent: :destroy
    has_many :select_motions, class_name: 'BxBlockAssessmenttest::SelectMotion'
    # has_many :user_languages, dependent: :destroy
    has_many :summary_tracks, class_name: 'BxBlockTimeTrackingBilling::SummaryTrack', dependent: :destroy, foreign_key: "account_id"
    accepts_nested_attributes_for :user_languages, allow_destroy: true
    accepts_nested_attributes_for :choose_motion_answer, allow_destroy: true
    accepts_nested_attributes_for :coach_leaves, allow_destroy: true
    enum status: %i[regular suspended deleted]
    enum gender: %i[Male Female Other]
    has_one_attached :image
    has_many :time_tracks, class_name: "BxBlockTimeTrackingBilling::TimeTrack"
    has_many :chat_rooms, class_name: "BxBlockChatbackuprestore::ChatRoom"
    has_many :chat_messages, class_name: "BxBlockChatbackuprestore::ChatMessage"
    has_many :top_focus_areas, class_name: "TopfocusArea"
    has_many :wellbeing_score_reports
	  scope :get_users, ->(name) { where("lower(full_name) LIKE ?", "%"+name.downcase+"%") }
    validates :email, uniqueness: true, on: :create
    validates :full_phone_number, uniqueness: true#, "full_phone_number has already been taken."

    # Required for ActiveAdmin filtering/searching
    def self.ransackable_attributes(auth_object = nil)
      ["access_code", "activated", "city", "created_at", "created_month_year", "deactivation", "education", "email", "expertise", "full_name", "full_phone_number", "gender", "id", "status", "type", "updated_at"]
    end

    # Required for Ransack 4.0 - associations must be explicitly allowlisted
    def self.ransackable_associations(auth_object = nil)
      ["action_items", "assess_select_answers", "chat_messages", "chat_rooms", "choose_answers", "choose_motion_answer", "coach_leaves", "coach_par_avails", "focus_areas", "goals", "image_attachment", "image_blob", "motion", "provider_booked_slots", "role", "select_answers", "select_motions", "summary_tracks", "time_tracks", "top_focus_areas", "user_booked_slots", "user_languages", "user_question_answers", "wellbeing_score_reports"]
    end

    scope :active, -> { where(activated: true) }
    scope :existing_accounts, -> { where(status: ['regular', 'suspended']) }
    # before_update :set_full_name
    validate :check_access_code_requirement, on: :create
    before_create :set_role
    after_create :send_notification
    before_destroy :destroy_choose_motion_answer
    before_destroy :destroy_availability
    validate :check_user_name , on: :create
    before_create :set_created_month_year

    def set_created_month_year
      self.created_month_year = created_at.beginning_of_month
    end
   
    def check_user_name
      # Guard against nil and enforce simple alpha/space rule with max length
      return if self.full_name.blank?
      unless self.full_name.match?(/\A[A-Za-z\s]{1,30}\z/)
        errors.add(:full_name, "must be 1-30 letters and spaces only")
      end
    end

    def send_notification
      admins = AccountBlock::Account.where(role_id: BxBlockRolesPermissions::Role.find_by_name(:admin)&.id)
      device_tokens = UserDeviceToken.where(account_id: admins.pluck(:id))
      fcm_client = FCM.new(ENV['FCM_SERVER_KEY'])
      options = {
        priority: "high",
        collapse_key: "updated_score",
        data: {
          type: 'admin notify'
        },
        notification: {
          title: "User signed up",
          body: self&.full_name.to_s+' signed up now.'
        }
      }
      registration_ids = device_tokens&.pluck(:device_token)
      registration_ids.each_slice(20) do |registration_id|
        response = fcm_client.send(registration_id, options)
      end
    end


    def is_online?
      updated_at > 10.minutes.ago
    end
    
    private 

    def destroy_choose_motion_answer
      BxBlockAssessmenttest::ChooseMotionAnswer.where(account_id: self.id).delete_all
    end


    def destroy_availability
       BxBlockAppointmentManagement::Availability.where(service_provider_id: self.id).delete_all  
    end

    def set_role
      if Company.find_by(hr_code: self.access_code)
        self.role_id = BxBlockRolesPermissions::Role.find_by_name(BxBlockRolesPermissions::Role.names[:hr])&.id
      elsif Company.find_by(employee_code: self.access_code)
        self.role_id = BxBlockRolesPermissions::Role.find_by_name(BxBlockRolesPermissions::Role.names[:employee])&.id
      end
    end

    def set_full_name
      self.full_name = "#{self.first_name} #{self.last_name}"
    end

    def parse_full_phone_number
      phone = Phonelib.parse(full_phone_number)
      self.full_phone_number = phone.sanitized
      self.country_code      = phone.country_code
      self.phone_number      = phone.raw_national
    end

    def valid_phone_number
      unless Phonelib.valid?(full_phone_number)
        errors.add(:full_phone_number, "Invalid or Unrecognized Phone Number")
      end
    end

    def generate_api_key
      loop do
        @token = SecureRandom.base64.tr('+/=', 'Qrt')
        break @token unless Account.exists?(unique_auth_id: @token)
      end
      self.unique_auth_id = @token
    end

    def set_black_listed_user
      if is_blacklisted_previously_changed?
        if is_blacklisted
          AccountBlock::BlackListUser.create(account_id: id)
        else
          blacklist_user.destroy
        end
      end
    end

    def check_access_code_requirement
      if self.access_code.present?
        if !Company.find_by("hr_code = ? or employee_code = ?", self.access_code, self.access_code)
          self.errors.add(:base, "Invalid Access Code")
        end
      else
          self.errors.add(:base, "Invalid Access Code")
      end unless self.role&.name == "coach"
    end

  end
end
