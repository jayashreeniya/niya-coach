class Company < ApplicationRecord
  has_many :time_tracks, class_name: "BxBlockTimeTrackingBilling::TimeTrack", dependent: :destroy

  validates :name, :email, presence: { message: "This can't be blank" }
  validates :name, uniqueness: { message: "Name has already been taken" },
                   format: { with: /\A[a-zA-Z ]+\z/, message: "Name should only contain letters and spaces" }
  validates :email, uniqueness: { message: "Email has already been taken" }

  validates :hr_code, :employee_code, uniqueness: { message: "HR code or Employee code must be unique" }

  # Required for ActiveAdmin filtering/searching
  def self.ransackable_attributes(auth_object = nil)
    ["address", "created_at", "email", "employee_code", "hr_code", "id", "name", "phone_number", "updated_at"]
  end

  # Required for Ransack 4.0 - associations must be explicitly allowlisted
  def self.ransackable_associations(auth_object = nil)
    ["time_tracks"]
  end
end
