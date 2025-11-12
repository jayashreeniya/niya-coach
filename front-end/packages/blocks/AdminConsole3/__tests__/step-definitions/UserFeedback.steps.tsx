// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";


import UserFeedback from "../../src/UserFeedback"
const navigation = require("react-navigation")
import { fireEvent,render,screen } from "@testing-library/react-native"
const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn()
       
    },
    id: "UserFeedback"
  }
  jest.useFakeTimers();
  
  const feedBackData={
    "data": [
        {
            "id": 215,
            "full_name": "cookie user",
            "rating": "5.0",
            "image": null
        },
        {
            "id": 192,
            "full_name": "",
            "rating": "2.5",
            "image": null
        },
        {
            "id": 229,
            "full_name": "Dinesh A",
            "rating": "3.5",
            "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBWVU9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--aabf492cd31e83f9d4aaf2d488685c9956490ce7/profile.jpg"
        },
        {
            "id": 318,
            "full_name": "DEmployee",
            "rating": "3.0",
            "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBYUE9IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--a6c3566fe15d4b7e931e914a8f0ab5c8113be5e5/profile.jpg"
        },
        {
            "id": 42,
            "full_name": "sonali Hello",
            "rating": "3.5",
            "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBaQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--a4e3d39c0d2af121a24aed1f08d9d067f5bed31d/profile.jpg"
        }
    ]
}

const feature = loadFeature('./__tests__/features/UserFeedback-scenario.feature');

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

    test('User navigates to UserFeedback', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:UserFeedback; 

        given('I am a User loading UserFeedback', () => {
            exampleBlockA = shallow(<UserFeedback {...screenProps}/>);
        });

        when('I navigate to the UserFeedback', () => {
             instance = exampleBlockA.instance() as UserFeedback
             render(<UserFeedback {...screenProps}/>)
             instance.setState({motionId:1,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });
             instance.componentDidMount();
             instance.getToken();
             instance.getUserDataList();
            instance.getAllDataList();
            fireEvent.press(screen.getByTestId("btnProfile"));
            fireEvent.press(screen.getByTestId("btnPPl"));
     
            fireEvent.press(screen.getByTestId("btnSndPushNoti"));
     
            fireEvent.press(screen.getByTestId("btnFeedback"));
           
            fireEvent.press(screen.getByTestId("btnLogOut_click"));
           
            
        });        

        then('UserFeedback will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.setState({DataList:feedBackData.data});
            instance.renderCoachList();
            let btnHome = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnHome');
            btnHome.simulate('press');

            instance.renderDrawer();
            let btnCoach = exampleBlockA.findWhere((node) => node.prop('testID') === 'coach0');
            btnCoach.simulate('press');
            

            let btnProfile = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnProfile');
            console.log("btnprofile>>",btnProfile);
            
            
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
            instance.saveFcmTOken("eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA");
            
          })

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
                feedBackData
              )
              instance.getEmployeesApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);

              const msg1 = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg1.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg1.messageId
              )
        
              msg1.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {"data":{
                  "attributes":{"full_name":'full_name',"image":"image1"}
                }}
              )
              instance.getuserDetailsApiCallId = msg1.messageId
              runEngine.sendMessage('From unit test', msg1);
              instance.logOut();
              
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
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
