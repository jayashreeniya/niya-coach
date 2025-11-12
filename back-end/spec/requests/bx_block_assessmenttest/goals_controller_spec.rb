require 'rails_helper'

RSpec.describe "BxBlockAssessmenttest::GoalsControllers", type: :request do
   before(:all) do
     @token = Support::SharedHelper.new.get_token
     @goal =  Support::SharedHelper.new.create_goal
     @focus_area_id =  Support::SharedHelper.new.focus_area
  end

  EAMIL = "newsexample12@gmail.com"
  let(:create_param){{id: 1, goal:  "i added goal", date: "01/01/2022",time_slot: "10:00 AM" ,focus_area_id: @focus_area_id }}
  let(:update_params){{id: 1, goal:  "i added goal new",date: "01/01/2023",time_slot: "11:00 AM",is_complete: "true",focus_area_id: @focus_area_id}}
    
    describe '#create' do
      context 'create goal' do
        it 'should pass  when create  action item successfully' do
          post '/bx_block_assessmenttest/goals', params: create_param, headers: { token: @token}
          expect(response).to have_http_status :created
        end
     end 
  end
 
    describe '#update' do
        context 'update goal' do
          it 'should pass  when update action item successfully' do
            put "/bx_block_assessmenttest/update_goal?id=#{@goal.id}", params: update_params, headers: { token: @token}
            expect(response).to have_http_status :ok
          end
           it 'should pass  when update action item successfully' do
            put '/bx_block_assessmenttest/update_goal?id=1000', params: update_params, headers: { token: @token}
            expect(response).to have_http_status :unprocessable_entity
          end
       end 
   end
    describe '#current_goals' do
        context 'goals' do
          it 'should pass  when get current goal get' do
             company  = Company.find_by(id: 5)
            role = BxBlockRolesPermissions::Role.find_by(id: 1)
            role = BxBlockRolesPermissions::Role.create(id: 1, name: "employee") unless role.present?
            company = Company.create(id: 5, name: "newtata company", email: EMAIL, address: "newDelhi1",hr_code: "A#{rand(100)}",employee_code:"b#{rand(100)}") unless company.present?
    
            current_user = AccountBlock::Account.find_by(id: 10)
            current_user = AccountBlock::Account.create!(id: 10,full_name: "test user",email:"assess34@gmail.com",full_phone_number: "9190978083863", password: "Admin@123",password_confirmation: "Admin@123", activated: true,access_code: company&.employee_code) unless current_user.present?
            BxBlockAssessmenttest::Goal.create(goal: "i added goal 22", date: "2022-10-06", account_id: current_user&.id, time_slot: "05:15 PM", is_complete: false ,focus_area_id: @focus_area_id)   
            get '/bx_block_assessmenttest/current_goals',headers: { token: BuilderJsonWebToken.encode(current_user.id)}
            expect(response).to have_http_status :ok
          end
           it 'should fail  when  get goal' do
            get '/bx_block_assessmenttest/current_goals',headers: { token: @token}
            expect(response).to have_http_status :ok
          end
       end 
   end
    describe '#completed_goals' do
        context 'complete goal' do
          it 'should pass  when get  goal complete' do
            company  = Company.find_by(id: 5)
            role = BxBlockRolesPermissions::Role.find_by(id: 1)
            role = BxBlockRolesPermissions::Role.create(id: 1, name: "employee") unless role.present?
            company = Company.create(id: 5, name: "wipro", email: EMAIL, address: "newDelhi",hr_code: "A#{rand(100)}",employee_code:"b#{rand(100)}") unless company.present?
    
            current_user = AccountBlock::Account.find_by(id: 15)
            current_user = AccountBlock::Account.create!(id: 15,full_name: "assess user",email:"assess#{rand(0..99)}@gmail.com",full_phone_number: "919297#{rand(111111..999999)}", password: "Admin2@123",password_confirmation: "Admin2@123", activated: true,access_code: company&.employee_code) unless current_user.present?
            BxBlockAssessmenttest::Goal.create(goal: "i added goal 224", date: "2022-10-07", account_id: current_user&.id, time_slot: "03:15 PM", is_complete: true ,focus_area_id: @focus_area_id)   
          
            get '/bx_block_assessmenttest/completed_goals',headers: { token:  BuilderJsonWebToken.encode(current_user.id)}
            expect(response).to have_http_status :ok
          end
          #  it 'should pass  when get  action item successfully' do
          #   get '/bx_block_assessmenttest/completed_goals',headers: { token: BuilderJsonWebToken.encode(1000.to_i)}
          #   expect(response).to have_http_status :unprocessable_entity
          # end
       end 
   end
    describe '#goal_boards' do
        context 'goal board' do
          it 'should pass  when get  data' do
            get '/bx_block_assessmenttest/goal_boards',headers: { token: @token}
            expect(response).to have_http_status :ok
          end
       end 
   end

    describe '#destroy' do
      context 'destroy action item' do
        it 'should pass  when destroy  action item successfully' do BuilderJsonWebToken.encode(1000.to_i)
            company  = Company.find_by(id: 5)
            role = BxBlockRolesPermissions::Role.find_by(id: 1)
            role = BxBlockRolesPermissions::Role.create(id: 1, name: "employee") unless role.present?
            company = Company.create(id: 5, name: "tcs", email: EMAIL, address: "mumbai",hr_code: "A#{rand(100)}",employee_code:"b#{rand(100)}") unless company.present?
  
            current_user = AccountBlock::Account.find_by(id: 10)
            current_user = AccountBlock::Account.create!(id: 10,full_name: "assess user",email:"assess36@gmail.com",full_phone_number: "9190978083866", password: "Admin@1234",password_confirmation: "Admin@1234", activated: true,access_code: company&.employee_code) unless current_user.present?
            goal =  BxBlockAssessmenttest::Goal.create(goal: "i added goal 222", date: "2022-10-10", account_id: current_user&.id, time_slot: "04:17 PM", is_complete: false ,focus_area_id: @focus_area_id)   
         
            delete "/bx_block_assessmenttest/destroy_goal?id=#{goal.id}",headers: { token:  BuilderJsonWebToken.encode(current_user.id)}
            expect(response).to have_http_status :ok
        end
         it 'should pass  when destroy  action item successfully' do
          delete '/bx_block_assessmenttest/destroy_goal?id=0',headers: { token: @token}
          expect(response).to have_http_status :unprocessable_entity
        end
      end 
   end
end

