require 'rails_helper'

RSpec.describe BxBlockAppointmentManagement::AvailableTime, type: :model do
	it "should belongs_to to account" do

	  t = BxBlockAppointmentManagement::AvailableTime.reflect_on_association(:coach_par_avail)
	  expect(t.macro).to eq(:belongs_to)
	end
end
