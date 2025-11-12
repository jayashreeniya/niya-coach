import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import TimeTrackingBilling from "../../src/TimeTrackingBilling.web"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
        addListener:jest.fn(),
        getParam:jest.fn()
    },
    scrrenid: "TimeTrackingBilling"
  }

const feature = loadFeature('./__tests__/features/TimeTrackingBilling-scenario.web.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to TimeTrackingBilling', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:TimeTrackingBilling; 

        given('I am a User loading TimeTrackingBilling', () => {
            exampleBlockA = shallow(<TimeTrackingBilling {...screenProps}/>);
        });

        when('I navigate to the TimeTrackingBilling', () => {
             instance = exampleBlockA.instance() as TimeTrackingBilling
        });

        then('TimeTrackingBilling will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            const msguserdetails = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msguserdetails.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msguserdetails.messageId
              )
        
              msguserdetails.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                    "data": [
                        {
                            "id": 42,
                            "full_name": "sonali Hello"
                        },
                        {
                            "id": 68,
                            "full_name": "demo demo"
                        },
                        {
                            "id": 263,
                            "full_name": "Jay"
                        },
                        {
                            "id": 321,
                            "full_name": "DEmployee1"
                        },
                        {
                            "id": 294,
                            "full_name": "assess user"
                        },
                        {
                            "id": 215,
                            "full_name": "cookie user"
                        },
                        {
                            "id": 316,
                            "full_name": "test user"
                        },
                        {
                            "id": 325,
                            "full_name": "Swamy"
                        },
                        {
                            "id": 242,
                            "full_name": "cookie user"
                        },
                        {
                            "id": 343,
                            "full_name": "dom emp"
                        },
                        {
                            "id": 192,
                            "full_name": "Kumar"
                        },
                        {
                            "id": 304,
                            "full_name": "Ajith"
                        },
                        {
                            "id": 333,
                            "full_name": "DEmployee4"
                        },
                        {
                            "id": 234,
                            "full_name": "sonali "
                        },
                        {
                            "id": 102,
                            "full_name": " Nidhi "
                        },
                        {
                            "id": 202,
                            "full_name": "Amar test"
                        },
                        {
                            "id": 318,
                            "full_name": "DEmployee"
                        },
                        {
                            "id": 229,
                            "full_name": "Dinesh A"
                        },
                        {
                            "id": 291,
                            "full_name": "sonali assess testing"
                        },
                        {
                            "id": 376,
                            "full_name": "demo"
                        },
                        {
                            "id": 323,
                            "full_name": "Ramesh"
                        },
                        {
                            "id": 353,
                            "full_name": "weell-being test new user"
                        },
                        {
                            "id": 358,
                            "full_name": "wellbeing test"
                        },
                        {
                            "id": 226,
                            "full_name": "Maya sridhar"
                        },
                        {
                            "id": 351,
                            "full_name": "Test"
                        },
                        {
                            "id": 372,
                            "full_name": "sms user "
                        },
                        {
                            "id": 359,
                            "full_name": "DEmployee7"
                        },
                        {
                            "id": 381,
                            "full_name": "Demo"
                        },
                        {
                            "id": 352,
                            "full_name": "Hello"
                        },
                        {
                            "id": 380,
                            "full_name": "demo"
                        },
                        {
                            "id": 355,
                            "full_name": "wee 1"
                        },
                        {
                            "id": 357,
                            "full_name": "well3"
                        },
                        {
                            "id": 386,
                            "full_name": "demo"
                        },
                        {
                            "id": 391,
                            "full_name": "niya profile1"
                        },
                        {
                            "id": 349,
                            "full_name": "DEmployee6 "
                        },
                        {
                            "id": 405,
                            "full_name": "dev user1"
                        },
                        {
                            "id": 188,
                            "full_name": "Amarjeet "
                        },
                        {
                            "id": 397,
                            "full_name": "sdfsdf"
                        },
                        {
                            "id": 410,
                            "full_name": " employee user "
                        },
                        {
                            "id": 385,
                            "full_name": "demo"
                        },
                        {
                            "id": 401,
                            "full_name": "email1"
                        },
                        {
                            "id": 419,
                            "full_name": "Asd user"
                        },
                        {
                            "id": 420,
                            "full_name": "Kumar Sanu"
                        },
                        {
                            "id": 421,
                            "full_name": "Raj Kumar Santhoshi"
                        },
                        {
                            "id": 427,
                            "full_name": "testing11"
                        },
                        {
                            "id": 84,
                            "full_name": " Jayashree"
                        },
                        {
                            "id": 354,
                            "full_name": "well test user"
                        },
                        {
                            "id": 377,
                            "full_name": "User12"
                        },
                        {
                            "id": 356,
                            "full_name": "well2"
                        },
                        {
                            "id": 369,
                            "full_name": "Madhan"
                        },
                        {
                            "id": 383,
                            "full_name": "Employee "
                        },
                        {
                            "id": 406,
                            "full_name": " assess user "
                        },
                        {
                            "id": 402,
                            "full_name": "final test"
                        },
                        {
                            "id": 388,
                            "full_name": "Rajesh"
                        },
                      
                        {
                            "id": 423,
                            "full_name": "Testtt"
                        },
                        {
                            "id": 431,
                            "full_name": "Devuser"
                        },
                        {
                            "id": 432,
                            "full_name": "Puppala Govind"
                        },
                        {
                            "id": 425,
                            "full_name": "niya goal testing"
                        },
                        {
                            "id": 417,
                            "full_name": "Test"
                        },
                        {
                            "id": 422,
                            "full_name": "testing1"
                        },
                        {
                            "id": 403,
                            "full_name": "Niya Wll"
                        },
                        {
                            "id": 213,
                            "full_name": "Jayashree"
                        },
                       
                        {
                            "id": 203,
                            "full_name": ""
                        },
                        {
                            "id": 392,
                            "full_name": "demo"
                        },
                        {
                            "id": 396,
                            "full_name": "niya 1"
                        },
                        {
                            "id": 404,
                            "full_name": "whale "
                        },
                        {
                            "id": 418,
                            "full_name": "User name "
                        },
                        {
                            "id": 400,
                            "full_name": "booking signuo"
                        },
                        {
                            "id": 394,
                            "full_name": "niya dev profile "
                        },
                       
                    ]
                }
              )
              instance.getuserTrackingDetailsApiCallId = msguserdetails.messageId
              runEngine.sendMessage('From unit test', msguserdetails);
       
           
        });

      

     then('Network error response for get all requests',()=>{
        const msgerr = new Message(
            getName(MessageEnum.RestAPIResponceMessage)
          );
    
          msgerr.addData(
            getName(MessageEnum.RestAPIResponceDataMessage),
            msgerr.messageId
          )
    
          msgerr.addData(
            getName(MessageEnum.RestAPIResponceErrorMessage),
            "Something went wrong. Please try again"
          )
          instance.getuserTrackingDetailsApiCallId = msgerr.messageId 
          runEngine.sendMessage('From unit test', msgerr);
          expect(exampleBlockA).toBeTruthy();
     
        });


        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
