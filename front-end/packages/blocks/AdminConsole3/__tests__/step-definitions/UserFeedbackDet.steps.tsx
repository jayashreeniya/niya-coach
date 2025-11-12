// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";


import UserFeedbackDet from "../../src/UserFeedbackDet"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn()
       
    },
    id: "UserFeedback"
  }
  jest.useFakeTimers();
  
  const feedBackDetData={
    "data": {
        "id": "192",
        "type": "user_feedback",
        "attributes": {
            "users_feedback": {
                "full_name": "",
                "company_name": "Builder",
                "rating": 2.5,
                "feedback": "This is to test the feature working status as part of developer unit testing",
                "code": "DZZHzv8",
                "rated_at": "2022-11-16T14:10:41.841Z",
                "image": null
            }
        }
    }
}

const feature = loadFeature('./__tests__/features/UserFeedbackDet-scenario.feature');

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

    test('User navigates to UserFeedbackDet', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:UserFeedbackDet; 

        given('I am a User loading UserFeedbackDet', () => {
            exampleBlockA = shallow(<UserFeedbackDet {...screenProps}/>);
        });

        when('I navigate to the UserFeedbackDet', () => {
             instance = exampleBlockA.instance() as UserFeedbackDet
             instance.setState({userId:192,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });
             instance.componentDidMount();
             instance.getToken();
             instance.getUserDataList();
            instance.getAllDataList();
            
        });        

        then('UserFeedbackDet will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.setState({DataList:feedBackDetData?.data?.attributes?.users_feedback});
            instance.renderCoachList();
            let btnHome = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnHome');
            btnHome.simulate('press');
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
                feedBackDetData
              )
              instance.getEmployeesApiCallId = msg.messageId
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
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
