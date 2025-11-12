require 'rails_helper'

RSpec.describe AccountBlock::Account, type: :model do

  describe "Associatoins" do
    it {should have_many(:provider_booked_slots)}
    it {should have_many(:user_booked_slots)}
    it {should have_many(:time_tracks)}
    it {should have_many(:action_items)}
    it {should have_many(:goals)}
    it {should have_many(:assess_select_answers)}

    # it {should have_many(:focus_areas)}

    it {should have_many(:choose_answers)}
    it {should have_many(:select_answers)}

    # it {should have_one(:motion)}

    it {should have_one(:choose_motion_answer)}
    it {should have_many(:select_motions)}
    it {should have_many(:user_languages)}
    it {should have_many(:summary_tracks)}
    it {should have_many(:time_tracks)}

    it "should have many focus_areas" do
      focus_area =  AccountBlock::Account.reflect_on_association(:focus_areas)
      expect(focus_area.macro).to eq(:has_many)
    end
   
    it "should have many motion" do
      motion =  AccountBlock::Account.reflect_on_association(:motion)
      expect(motion.macro).to eq(:has_one)
    end
  end

  # describe "Validations" do
  #   it { should validate_uniqueness_of(:full_phone_number)  }
  # end

  describe "scope" do
    let!(:account) {AccountBlock::Account.new(id: 187, :activated => true, status:'regular',full_name:"Demo")}
    it "include users that are active" do
        expect(account.activated).to eq true
    end
    it "account exists" do
      expect(account.status).to eq "regular"
    end
    it "get name like name in downcase"do
      account.save(validate: false)
      user = AccountBlock::Account.get_users("Demo").last
      expect(user.full_name).to eq "Demo"
    end
  end
 
  describe "we test the Account class methods" do
    let(:updated_at) {Time.current - 10.minutes.ago}
    let(:time) {Time.current > updated_at}
    it "while calling the 'is_online' method before 10 minutes return true" do
      expect(time).to eq true
    end
    it "while call is_online method after 10 min return false" do
      expect(!time).to eq false
    end
  end

end