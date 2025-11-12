class Company < ApplicationRecord
  has_many :time_tracks, class_name: "BxBlockTimeTrackingBilling::TimeTrack", dependent: :destroy

  validates :name, :email, presence: { message: "This can't be blank" }
  validates :name, uniqueness: { message: "Name has already been taken" },
                   format: { with: /\A[a-zA-Z ]+\z/, message: "Name should only contain letters and spaces" }
  validates :email, uniqueness: { message: "Email has already been taken" }

  validates :hr_code, :employee_code, uniqueness: { message: "HR code or Employee code must be unique" }
end
