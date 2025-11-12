require 'rails_helper'

RSpec.describe Company, type: :model do
   before(:each) do
     @user = Company.create(id: rand(1..100), name: [*('A'..'Z')].sample(6).join, email: "aersest#{rand(0..99)}@gmail.com", hr_code: 234523 , employee_code: 678905)
   end

  subject {
    described_class.new(name: [*('A'..'Z')].sample(6).join,
                        email: "aersest#{rand(0..99)}@gmail.com",
                        hr_code: '768764',
                        employee_code: '2876378')
  }

  it 'should be valid withname' do
    expect(subject).to be_valid
  end


  it "should not valid without a name" do
    subject.name = nil
    expect(subject).to_not be_valid
  end

  it "should not valid without a email" do
    subject.email = nil
    expect(subject).to_not be_valid
  end

  it "should not valid without a hr_code" do
    company1 = Company.create(id: 21, name: "tcs", email: "tcs@gmail.com", hr_code: "123")
    company2 = Company.create(id: 22, name: "ts", email: "ts@gmail.com", hr_code: "123")
    expect(company1).to_not be_valid(company2)
  end
 
  it "should not valid without a employee_code" do
    company1 = Company.create(id: 21, name: "tcs", email: "tcs@gmail.com", employee_code: "123")
    company2 = Company.create(id: 22, name: "ts", email: "ts@gmail.com", employee_code: "123")
    expect(company1).to_not be_valid(company2)
  end
end
