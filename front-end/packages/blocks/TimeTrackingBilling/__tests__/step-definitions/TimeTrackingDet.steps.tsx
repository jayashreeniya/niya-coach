// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import TimeTrackingDet from "../../src/TimeTrackingDet"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
        addEventListener:jest.fn()

    },
   screenid: "TimeTrackingDet"
  }

const feature = loadFeature('./__tests__/features/TimeTrackingDet-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to TimeTrackingBillingDetails', ({ given, when, then }) => {
        let exampleBlockDet:ShallowWrapper;
        let instance:TimeTrackingDet; 

        given('I am a User loading TimeTrackingBillingDetails', () => {
            exampleBlockDet = shallow(<TimeTrackingDet {...screenProps}/>);
        });

        when('I navigate to the TimeTrackingBillingDetails', () => {
             instance = exampleBlockDet.instance() as TimeTrackingBilling
        });

        then('TimeTrackingBillingDetails will load with out errors', () => {
            expect(exampleBlockDet).toBeTruthy();
            const userdetails = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              userdetails.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
               userdetails.messageId
              )
        
              userdetails.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
               { 
                "data": [
                    {
                        "billing": "16 USD",
                        "month": "May",
                        "spend_time": "16 hours, 19 minutes, and 11 seconds"
                    },
                    {
                        "billing": "118 USD",
                        "month": "April",
                        "spend_time": "4 days, 22 hours, 37 minutes, and 39 seconds"
                    },
                    {
                        "billing": "33 USD",
                        "month": "March",
                        "spend_time": "1 day, 9 hours, 20 minutes, and 40 seconds"
                    },
                    {
                        "billing": "4 USD",
                        "month": "February",
                        "spend_time": "4 hours, 21 minutes, and 32 seconds"
                    },
                    {
                        "billing": "9 USD",
                        "month": "January",
                        "spend_time": "9 hours, 50 minutes, and 49 seconds"
                    },
                    {
                        "billing": "13 USD",
                        "month": "December",
                        "spend_time": "13 hours, 39 minutes, and 18 seconds"
                    }
                ]
            }
              )
              instance.getuserTrackingDetailsCallId = userdetails.messageId
              runEngine.sendMessage('From unit test', userdetails);
            
        });

      

     then('Network error response for get all requests',()=>{
        const errmsg = new Message(
            getName(MessageEnum.RestAPIResponceMessage)
          );
    
          errmsg.addData(
            getName(MessageEnum.RestAPIResponceDataMessage),
            errmsg.messageId
          )
    
          errmsg.addData(
            getName(MessageEnum.RestAPIResponceErrorMessage),
            "Something went wrong. Please try again"
          )
          instance.getuserTrackingDetailsCallId = errmsg.messageId 
          runEngine.sendMessage('From unit test', errmsg);
          expect(exampleBlockDet).toBeTruthy();
     
        });


        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockDet).toBeTruthy();
        });
    });


});
