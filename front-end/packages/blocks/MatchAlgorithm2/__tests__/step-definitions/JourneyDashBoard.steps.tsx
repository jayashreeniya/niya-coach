// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";


import JourneyDashBoard from "../../src/JourneyDashBoard"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn()
       
    },
    id: "JourneyDashBoard"
  }
  jest.useFakeTimers();
  
  const progressData={
    "data": {
        "id": "192",
        "type": "my_progress",
        "attributes": {
            "focus_areas": [
                {
                    "focus_area": "Managing My relationships",
                    "percentage": 20.0,
                    "color": "yellow"
                },
                {
                    "focus_area": "Spirituality or Religion",
                    "percentage": 10.0,
                    "color": "red"
                },
                {
                    "focus_area": "Building New Relationships",
                    "percentage": 10.0,
                    "color": "blue"
                },
                {
                    "focus_area": "Family",
                    "percentage": 10.0,
                    "color": "green"
                },
                {
                    "focus_area": "Diversity, Equity & Inclusion in community",
                    "percentage": 10.0,
                    "color": "orange"
                }
            ]
        }
    }
}

const feature = loadFeature('./__tests__/features/JourneyDashBoard-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.spyOn(runEngine, "sendMessage");        
    });

    test('User navigates to JourneyDashBoard', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:JourneyDashBoard; 

        given('I am a User loading JourneyDashBoard', () => {
            exampleBlockA = shallow(<JourneyDashBoard {...screenProps}/>);
        });

        when('I navigate to the JourneyDashBoard', () => {
             instance = exampleBlockA.instance() as JourneyDashBoard
             instance.setState({motionId:1,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });
             instance.componentDidMount();
             instance.getToken();
             instance.getMyProgress();
             instance.getProfileData();
                          
        });        

        then('JourneyDashBoard will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            let btnBack = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnBack');
            btnBack.simulate('press');
            instance.getSliderColor("yellow");
            instance.getSliderColor("red");
            instance.getSliderColor("blue");
            instance.getSliderColor("green");
            instance.getSliderColor();

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
                progressData
              )
              instance.getJourneyApiCallId = msg.messageId
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
              instance.getJourneyApiCallId = msg.messageId
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
              instance.getJourneyApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
