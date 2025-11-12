require 'rails_helper'

RSpec.describe BxBlockAppointmentManagement::CoachParAvail, type: :model do
	it "should belongs_to to account" do

	  t = BxBlockAppointmentManagement::CoachParAvail.reflect_on_association(:account)
	  expect(t.macro).to eq(:belongs_to)
	end
	it "should has many to coach_par_times" do

	  t = BxBlockAppointmentManagement::CoachParAvail.reflect_on_association(:coach_par_times)
	  expect(t.macro).to eq(:has_many)
	end
end

