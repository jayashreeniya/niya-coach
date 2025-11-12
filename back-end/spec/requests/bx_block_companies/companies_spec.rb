require 'rails_helper'

RSpec.describe "BxBlockCompanies::Companies", type: :request do
   hr_role = Support::SharedHelper.new.hr_role
  account = Support::SharedHelper.new.get_coach_user
  hr_account = Support::SharedHelper.new.create_company_hr
  company = Support::SharedHelper.new.get_company
  employee_role = Support::SharedHelper.new.get_token
  coach_role = Support::SharedHelper.new.coach_role
  before(:all) do
    @admin_role = Support::SharedHelper.new.admin_role
    @coach_role = Support::SharedHelper.new.coach_role
    @token = Support::SharedHelper.new.get_token
    @admin_token = Support::SharedHelper.new.get_admin_token    
    company = Support::SharedHelper.new.get_company
  end


  let(:company_param){{company: {name:"technoliz", email:"newexample12@gmail.com", address:"usa"}}}

  let (:company_error){{company: { name:"test1", email:"", address:"sadfgb"}}}
 
#   let (:ses_param) {{company: company.id, employee: @employee_role.count,  coach: @coach_role.id }}

#   let (:name_param){{id:company.id {{ name: "hkj", url: "http://localhost:3000",id:hr_role.id ,  format: :json}}}}

#   let (:error_param){{ name:"fghj", url: "http://localhost:3000", format: :json}}

#   let (:send_param){{id:1, specialization:"sdesfh" }}
#   let (:saa_param){{ id:10}}
 
#   let (:test1_param){{id: company.id, company: { name: "techno", email: "tech3@gmail.com", address: "desth"}}}

#   let (:test2_param){{ id: company.id, company: { name:"aesrgdtyhn", email:"tech3@gmail.com", address: "sdrgthuy"}}}
#   let(:get_param) { BxBlockRolesPermissions::Role.find_by_name(BxBlockRolesPermissions::Role.names[:admin]).id}

    describe "#create_company" do
      it "should create company without token success" do
        post '/bx_block_companies/create_company', params: company_param
        puts "Response Body: #{response.body}"  # Debugging
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body).dig('errors')).to eq({"email"=>["Email has already been taken"]})
      end

      it "should render errors" do
        post '/bx_block_companies/create_company', params: company_error
        expect(response). to have_http_status(:unprocessable_entity)
      end
    end

    describe "#companies_list" do
      it "should comapanies list without token success" do
        get '/bx_block_companies/companies_list'
        expect(response). to have_http_status(:ok)
      end
    end

#    describe "#create" do
#       it "should create company success" do
#         post '/bx_block_companies/companies', params: coach_param, headers: { token: @admin_token}
#         expect(response). to have_http_status(:success)
#       end
#       it "your are note admin" do
#         post '/bx_block_companies/companies',params: coach_error, headers:{ token: @token}
#         expect(response). to have_http_status(200)
#       end
#    end

 
#   describe "#get_company" do
#        let(:company)  {Company.where(id: 12).last}
#        it "get company details" do
#           get '/bx_block_companies/get_company', params: name_param, headers: {token: @token}
#          expect(response). to have_http_status(200)
#         end
#        it "get not id is present" do
#           get '/bx_block_companies/get_company', params: error_param, headers: { token: @token}
#           expect(response). to have_http_status(204)
#         end
#     end

#   describe "#coach_expertise" do
#         it "get coach expertise" do
#           get '/bx_block_companies/coach_expertise',params: send_param, headers: {  token: @token}
#           expect(response). to have_http_status(200)
#         end
#     end
#   describe "#coach_expertise" do
#       it "get coach expertise" do
#          get '/bx_block_companies/coach_expertise',params: send_param, headers: {  token: @token}
#          expect(response). to have_http_status(200)
#         end
#     end

#   describe "#update_company" do
#       it "should get update companies" do
#          put '/bx_block_companies/update_company', params: test1_param, headers: {  token: @admin_token}
#          expect(response). to have_http_status(200)
#        end
#         it "should not get valid email " do
#           put '/bx_block_companies/update_company', params: test2_param, headers: {  token: @token}
#           expect(response). to have_http_status(200)
#         end
#     end

#   describe "#get_coaches" do
#       it "should get coach" do
#          get '/bx_block_companies/get_coaches',params: name_param , headers: {  token: @admin_token}
#           expect(response). to have_http_status(200)
#         end
#        it "should not get coach" do
#          get '/bx_block_companies/get_coaches',params: name_param, headers: {   token: @token}
#          expect(response). to have_http_status(200)
#         end
#     end
   
#    describe "#delete_user" do
#      it "should get delete success" do
#          ttest = AccountBlock::Account.last
#          delete '/bx_block_companies/delete_user',params: {id: ttest.id}, headers: { token: @admin_token}
#           expect(response). to have_http_status(200)
#         end
#       # it "should not delet without id" do
#       #   ttest = AccountBlock::Account.last
#       #   delete'/bx_block_companies/delete_user', params: {id: ttest.id }, headers: { token: @token}
#       #   expect(response). to have_http_status(422)
#       # end        
#    end
end
