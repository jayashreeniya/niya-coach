// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";


import HRListsScreen from "../../src/HRListsScreen"
const navigation = require("react-navigation");
import { fireEvent,screen,render } from "@testing-library/react-native"

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
        addListener:jest.fn()
       
    },
    id: "HRListsScreen"
  }
  jest.useFakeTimers();
  
  const HRData={
    "data": [
        {
            "id": "76",
            "type": "hr_detail",
            "attributes": {
                "hr_details": {
                    "id": 76,
                    "full_name": " DivyaPrakash",
                    "enrolled": "2022-09-08",
                    "code": "6FEIRD",
                    "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBTZz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--900e7e53748aecc480b4337579bb79669ffb5257/profile.jpg"
                }
            }
        }
    ]
}

const HRprofileData={
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



const feature = loadFeature('./__tests__/features/HRListsScreen-scenario.feature');

const HRdeviceTokenUpdate={
  "data": {
      "id": 7,
      "device_token": "asdflajsldflasjdflasdf",
      "account_id": 242,
      "created_at": "2022-11-24T05:18:55.470Z",
      "updated_at": "2023-01-02T11:46:59.966Z"
  }
}
defineFeature(feature, (test) => {
    beforeEach(() => {
        jest.spyOn(runEngine, "sendMessage");  
        jest.resetModules();
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.mock('react-native-drawer', () => {
          return {
            addEventListener: jest.fn(),
            createDrawerNavigator: jest.fn()
          }
        });   
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
     
    });

    afterEach(()=>{
        jest.runAllTimers();
      });

    test('User navigates to HRListsScreen', ({ given, when, then }) => {
        let HRListBlockA:ShallowWrapper;
        let instance:HRListsScreen; 

        given('I am a User loading HRListsScreen', () => {
            HRListBlockA = shallow(<HRListsScreen {...screenProps}/>);
        });

        when('I navigate to the HRListsScreen', () => {
             instance = HRListBlockA.instance() as HRListsScreen;
             render(<HRListsScreen {...screenProps}/>)
             instance.componentDidMount();
             instance.getFocusOn();
             instance.getToken();
             instance.setState({compid:23,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA3" });
             instance.getUserDataList();
           
             instance.getComapnyDetails();
             instance.saveFcmTOken("eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA");
            
             fireEvent.press(screen.getByTestId("sendNotify_click"));
             fireEvent.press(screen.getByTestId("Privacy_click"));
             fireEvent.press(screen.getByTestId("profile_click"));
             
            
             fireEvent.press(screen.getByTestId("logout_click"));
             fireEvent.press(screen.getByTestId("feedback_click"));
            
        });  
      
        then("Response token from the session", () => {
            const tokenMsgdata = new Message(
              getName(MessageEnum.SessionResponseMessage)
            );
      
            tokenMsgdata.addData(
              getName(MessageEnum.SessionResponseToken),
              "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"
            )
      
            runEngine.sendMessage('From unut test', tokenMsgdata);

            const msgGetuser = new Message(
              getName(MessageEnum.RestAPIResponceMessage)
            );
      
            msgGetuser.addData(
              getName(MessageEnum.RestAPIResponceDataMessage),
              msgGetuser.messageId
            )
      
            msgGetuser.addData(
              getName(MessageEnum.RestAPIResponceSuccessMessage),
              HRData
            )
            instance.getuserDetailsApiCallId = msgGetuser.messageId
            runEngine.sendMessage('From unit test', msgGetuser);

    

          });
        then('Network response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                HRData
              )
              instance.getComapnyDetailsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
              
        });   
      
        then('HRListsScreen will load with out errors', () => {
            expect(HRListBlockA).toBeTruthy();
            instance.setState({
                prifileimage:HRprofileData?.data.attributes?.image,
                full_name: HRprofileData?.data.attributes?.full_name,
                CompDataList: HRData?.data
              });

            instance.renderList();
            
            let btnHr = HRListBlockA.findWhere((node) => node.prop('testID') === 'hr0');
            btnHr.simulate('press');

            let btnOpenDrawer = HRListBlockA.findWhere((node) => node.prop('testID') === 'btnOpenDrawer');
            btnOpenDrawer.simulate('press');
            
            let bodydata: Record<string,any>={
                device_tokendata:"asdfjlasdfoasdnfasfaernasdf"
              }
            let headersdata : Record<string,string>={"Content-Type":"application/json","token":"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"};
          
           instance.networkRequest("dummy","POST",headersdata,bodydata,{ loading: true });

             instance.logOut();
                
        });
      
        then('I can update device token with out errors',()=>{
            const msgload = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msgload.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgload.messageId
              )
        
              msgload.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                HRdeviceTokenUpdate
              )
              instance.devicetokenApiCallId = msgload.messageId
              runEngine.sendMessage('From unit test', msgload);
              
        });        
      
        then('Network error response for get all requests',()=>{
            const netmsg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              netmsg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                netmsg.messageId
              )
        
              netmsg.addData(
                getName(MessageEnum.RestAPIResponceErrorMessage),
                "Something went wrong. Please try again"
              )
              instance.getComapnyDetailsApiCallId = netmsg.messageId 
              runEngine.sendMessage('From unit test', netmsg);
        });
        then('Network responseJson message error response for get all requests',()=>{
            const netresmsg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              netresmsg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                netresmsg.messageId
              )
        
              netresmsg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {message:"Something went wrong. Please try again"}
              )
              instance.getComapnyDetailsApiCallId = netresmsg.messageId
              runEngine.sendMessage('From unit test', netresmsg);
              
        });
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(HRListBlockA).toBeTruthy();
        });
    });


});
