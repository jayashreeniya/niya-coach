require 'rails_helper'

RSpec.describe "BxBlockCompanies::Companies", type: :request do
	hr_role = Support::SharedHelper.new.hr_role
	account = Support::SharedHelper.new.get_coach_user
	hr_account = Support::SharedHelper.new.create_company_hr
	employee_role = Support::SharedHelper.new.get_token
	coach_role = Support::SharedHelper.new.coach_role
	let!(:company) {Support::SharedHelper.new.get_company}

	before(:all) do
	@admin_role = Support::SharedHelper.new.admin_role
	@coach_role = Support::SharedHelper.new.coach_role
	@token = Support::SharedHelper.new.get_token
	@admin_token = Support::SharedHelper.new.get_admin_token

	end
  let (:index_params){
  	{
  		name: "newtata company12"
  	}
  } 
    
	let(:coach_param){
		{
			company: {
				name:"test1", 
				email:"newexample12@gmail.com", 
				address:"test2"
			}
		}
	}

	let (:coach_error){
		{
			company: { 
				name:"test2", 
				email:"", 
				address:"sadfgb"
			}
		}
	}

	let (:ses_param) {
		{
			company: 5, employee: @employee_role.count, coach: @coach_role.id 
		}
	}

	let (:name_param){
		{
		 id: 5
		}
	}

	let (:error_param){
		{
		 name:"fghj", 
		 url: "http://localhost:3000", 
		 format: :json
		}
	}

	let (:send_param){
		{
			id:1, 
			specialization:"sdesfh" 
		}
	}
	let (:saa_param){
		{
		 id:10
		}
	}

	let (:test1_param){
		{
			id: 5, 
			company: { 
				name: "techno", 
				email: "tech3@gmail.com", 
				address: "desth"
			}
		}
	}

	let (:test2_param){
		{ id: 5, 
			company: { 
				name:"aesrgdtyhn", 
				email:"tech3@gmail.com", 
				address: "sdrgthuy"
			}
		}
	}

	let(:get_param) { BxBlockRolesPermissions::Role.find_by_name(BxBlockRolesPermissions::Role.names[:admin]).id}

	let(:hrs_params){
		{
		 company_id: 5,
		 name:"test3", 
		 email:"tech3@gmail.com", 
		 address:"ddlg"
		}
	}

	describe "#create" do
		it "your are note admin" do
		    post '/bx_block_companies/companies',params: coach_error, headers:{ token: @token}
		    expect(response). to have_http_status(200)
	   end
	end
	# describe "#index" do
    # it 'index methods cases' do
    #    	expected_response = {"id"=> company.id, "name"=> company.name, "email"=> company.email, "address"=> company.address, "hr_code"=> company.hr_code, "employee_code"=> company.employee_code, "company_date"=>  company.created_at.strftime("%Y-%m-%d")}
    #     get '/bx_block_companies/companies',params: index_params,headers: {token: @admin_token}
    #     expect(JSON.parse(response.body)["data"]&.first["attributes"]).to eq expected_response
    #     expect(response).to have_http_status(200)
    #  end
	# end

	describe "#get_company" do
	   let(:company)  {Company.where(id: 12).last}
	   it "get company details" do
			 get '/bx_block_companies/get_company', params: name_param, headers: {token: @token}
			 expect(response). to have_http_status(200)
	   end
		it "get not id is present" do
		  get '/bx_block_companies/get_company', params: error_param, headers: { token: @token}
		  expect(response). to have_http_status(204)
		end
  end

	describe "#coach_expertise" do
	  it "get coach expertise" do
	    get '/bx_block_companies/coach_expertise',params: send_param, headers: { token: @token}
	    expect(response). to have_http_status(200)
	  end
  end
	describe "#coach_expertise" do
	  it "get coach expertise" do
	    get '/bx_block_companies/coach_expertise',params: send_param, headers: { token: @token}
	    expect(response). to have_http_status(200)
	  end
  end

	describe "#update_company" do
	  it "should get update companies" do
	     put '/bx_block_companies/update_company', params: test1_param, headers: { token: @admin_token}
	     expect(response). to have_http_status(200)
    end
	end
	describe "#get_all_details" do
    it "should show all the details " do
	     get '/bx_block_companies/get_all_details',headers: {token: @token}
	     expect(response).to have_http_status(200)
    end	
	end

	describe "#get_employees" do
    it 'should get employes' do
       get '/bx_block_companies/get_employees',headers: {token: @token}
       expect(response).to have_http_status(200)
    end
	end

	describe "#get_coaches" do
	   it "should get coach" do
	      get '/bx_block_companies/get_coaches',params: name_param , headers: { token: @admin_token}
	       expect(response). to have_http_status(200)
      end
	end
	describe "#get_hrs" do
    it 'should get hrs' do
        get '/bx_block_companies/get_hrs',params: hrs_params,headers: {token: @token, accept: 'application/json'}
        expect(response).to have_http_status(200)
     end
	end

	describe "#delete_user" do
	   it "should get delete success" do
	      ttest = AccountBlock::Account.last
	      delete '/bx_block_companies/delete_user',params: {id: ttest.id}, headers: { token: @admin_token}
	       expect(response). to have_http_status(200)
	   end
  end
end