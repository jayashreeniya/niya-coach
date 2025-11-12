require 'swagger_helper'
CreateCompany = "/bx_block_companies/create_company"
CompanyList = "/bx_block_companies/companies_list"
TYPE = 'application/json'
RSpec.describe  BxBlockCompanies::CompaniesController, type: :request do
	let(:company_param){{company: {name: [*('A'..'Z')].sample(6).join, email:"new1#{0..999}@gmail.com", address:"usa"}}}
  let (:company_error){{company: { name:"test1", email:"", address:"sadfgb"}}}

  path CreateCompany do
    post '#create company without token' do
      tags "create company"
      produces TYPE
      parameter name: :company, in: :query, schema: {
		  	type: :object,
		  	properties: {
		  		company: {
		        type: :object,
		        properties: {
		          name: { type: :string },
		          email: { type: :string },
		          address: { type: :string },
		          phone_number: { type: :string, format: :phone }
		        },
        		required: []
     			}
      	},
		  required: []
			}

      response '201', 'create company' do
	      it "should create company without token success" do
	        post CreateCompany, params: company_param
	        expect(response). to have_http_status(:created)
	      end
	    end
	    response '422', ' unprocessable entity' do
	    	it "should render errors" do
	        post CreateCompany, params: company_error
	        expect(response). to have_http_status(:unprocessable_entity)
	      end
	    end
	  end
	end

	path CompanyList do
    get '#index companies list without token' do
      tags "company list #index"
      produces TYPE

	    response '200', 'cpmpanies list' do
	      it "should comapanies list without token success" do
	        get CompanyList
	        expect(response). to have_http_status(:ok)
	      end
	    end
	  end
	end
end