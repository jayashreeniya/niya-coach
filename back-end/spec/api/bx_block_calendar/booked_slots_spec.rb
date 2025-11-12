require 'swagger_helper'
BookedSlot = "/bx_block_calendar/booked_slots/booked_slot_details"
TYPE = 'application/json'
RSpec.describe BxBlockCalendar::BookedSlotsController, type: :request do

  path BookedSlot do
    get 'all booked slots list #booked_slot_details ' do
	    tags "booked slot"
	    produces TYPE
	    response '200', 'booked_slot' do
				it "should return response 200 in #booked_slot_details" do
			    get BookedSlot
			    expect(response).to have_http_status(200)
			  end
        run_test!
      end
    end
  end
end