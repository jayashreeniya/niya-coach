// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";


import HRProfile from "../../src/HRProfile"
const navigation = require("react-navigation");
import { fireEvent,render,screen } from "@testing-library/react-native"

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
        addListener:jest.fn(),
        params: {id:11}
       
    },
    id: "HRProfile"
  }
  jest.useFakeTimers();
  
  const companyListData={
    "data": {
        "full_name": " DivyaPrakash",
        "first_name": null,
        "last_name": null,
        "email": "divyaprakashita@gmail.com",
        "mobile_no": "919894068623"
    }
}

const compprofileData={
    "data": {
        "id": "11",
        "type": "account",
        "attributes": {
            "type": "EmailAccount",
            "first_name": null,
            "last_name": null,
            "full_name": "test user",
            "email": "asd@gmail.com",
            "access_code": "12345",
            "gender": null,
            "full_phone_number": "7898125135",
            "activated": true,
            "phone_number": null,
            "country_code": null,
            "created_at": "2022-08-16T06:52:09.835Z",
            "updated_at": "2022-08-16T06:52:09.908Z",
            "image": null
        }
    }
}

const userdeviceTokenUpdate={
    "data": {
        "id": 7,
        "device_token": "asdflajsldflasjdflasdf",
        "account_id": 242,
        "created_at": "2022-11-24T05:18:55.470Z",
        "updated_at": "2023-01-02T11:46:59.966Z"
    }
}

const feature = loadFeature('./__tests__/features/HRProfile-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.spyOn(runEngine, "sendMessage");  
        jest.mock('react-native-drawer', () => {
            return {
              addEventListener: jest.fn(),
              createDrawerNavigator: jest.fn()
            }
          });      
    });

    afterEach(()=>{
        jest.runAllTimers();
      });

    test('User navigates to HRProfile', ({ given, when, then }) => {
        let HRProfileBlockA:ShallowWrapper;
        let instance:HRProfile; 

        given('I am a User loading HRProfile', () => {
          HRProfileBlockA = shallow(<HRProfile {...screenProps}/>);
        });

        when('I navigate to the HRProfile', () => {
             instance = HRProfileBlockA.instance() as HRProfile;
             render(<HRProfile {...screenProps}/>)
             instance.componentDidMount();
             instance.getFocusOn();
             instance.getToken();
             instance.setState({compid:22,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });
            instance.delCompHRDetails()
            instance.getUserDataList();
            instance.getComapnyHRDetails();
            instance.updateComHRDetApiCall();
            fireEvent.press(screen.getByTestId("profile_click"));
            
            fireEvent.press(screen.getByTestId("sendNotify_click"));
            fireEvent.press(screen.getByTestId("Privacy_click"));
            fireEvent.press(screen.getByTestId("logout_click"));
           
            fireEvent.press(screen.getByTestId("feedback_click"));
            instance.saveFcmTOken("eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA");
           
           
        });  
      
        then("Response token from the session", () => {
            const tokenMsg = new Message(
              getName(MessageEnum.SessionResponseMessage)
            );
      
            tokenMsg.addData(
              getName(MessageEnum.SessionResponseToken),
              "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"
            )
      
            runEngine.sendMessage('From unut test', tokenMsg);
          });
        then('Network response for get all requests',()=>{
            const msgapi = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msgapi.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgapi.messageId
              )
        
              msgapi.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                companyListData
              )
              instance.getComapnyHRDetailsApiCallId = msgapi.messageId
              runEngine.sendMessage('From unit test', msgapi);

              //get user derta

              const msgGetuser = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msgGetuser.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgGetuser.messageId
              )
        
              msgGetuser.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                companyListData
              )
              instance.getuserDetailsApiCallId = msgGetuser.messageId
              runEngine.sendMessage('From unit test', msgGetuser);

      

              // 
              const msg1 = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg1.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg1.messageId
              )
        
              msg1.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {"data":{"message":"message"}}
              )
              instance.DelHRApiCallId = msg1.messageId 
              runEngine.sendMessage('From unit test', msg1);
              
        });   
      
        then('HRProfile will load with out errors', () => {

            expect(HRProfileBlockA).toBeTruthy();
            const msg = new Message(
              getName(MessageEnum.RestAPIResponceMessage)
            );
      
            msg.addData(
              getName(MessageEnum.RestAPIResponceDataMessage),
              msg.messageId
            )
      
            msg.addData(
              getName(MessageEnum.RestAPIResponceSuccessMessage),
              {"data":{}}
            )
            instance.UpdateHRApiCallId = msg.messageId
            runEngine.sendMessage('From unit test', msg);
            instance.setState({
                prifileimage:compprofileData?.data.attributes?.image,
                full_name: compprofileData?.data.attributes?.full_name,
                hr_name: companyListData?.data?.full_name, 
                hr_email: companyListData?.data?.email, 
                phone_number: companyListData?.data?.mobile_no.slice(2)
              });

             instance.renderProfile();
             instance.renderEmail();
             instance.renderButton();

             let txtName = HRProfileBlockA.findWhere((node) => node.prop('testID') === 'txtName');
             txtName.simulate('changeText', companyListData?.data?.full_name);
             let btnSave = HRProfileBlockA.findWhere((node) => node.prop('testID') === 'btnSave');
             btnSave.simulate('press');
 
             let txtEmail = HRProfileBlockA.findWhere((node) => node.prop('testID') === 'txtEmail');
             txtEmail.simulate('changeText', companyListData?.data?.email);

             let txtMobile = HRProfileBlockA.findWhere((node) => node.prop('testID') === 'txtMobile');
             txtMobile.simulate('changeText', companyListData?.data?.mobile_no.slice(2));

          
            let btnDelete = HRProfileBlockA.findWhere((node) => node.prop('testID') === 'btnDelete');
            btnDelete.simulate('press');

            let headers : Record<string,string>={"Content-Type":"application/json","token":"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"};
            let body: Record<string,any>={
                device_token:"asdfjlasdfoasdnfasfaernasdf"
              }
             instance.networkRequest("dummy","POST",headers,body,{ loading: true });

             instance.logOut();
                
        });
      
        then('I can update device token with out errors',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                userdeviceTokenUpdate
              )
              instance.devicetokenApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
              
        });        
      
        then('Network error response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceErrorMessage),
                "Something went wrong. Please try again"
              )
              instance.getuserDetailsApiCallId = msg.messageId 
              runEngine.sendMessage('From unit test', msg);
        });
        then('Network responseJson message error response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {message:"Something went wrong. Please try again"}
              )
              instance.getuserDetailsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
              
        });
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(HRProfileBlockA).toBeTruthy();
        });
    });


});
