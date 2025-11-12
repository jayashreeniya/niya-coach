// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import * as helpers from '../../../../framework/src/Helpers'
import React from "react";
import OTPInputAuth from "../../src/OTPInputAuth"
import MessageEnum,{getName} from "../../../../framework/src/Messages/MessageEnum";
import {Message} from "../../../../framework/src/Message"
import {runEngine} from '../../../../framework/src/RunEngine'

const navigation = require("react-navigation")

const screenProps = {
    navigation: {  
        navigate:jest.fn(),
        goBack:jest.fn(),},
    id: "OTPInputAuth"
  }

const feature = loadFeature('./__tests__/features/OTPInputAuth-scenario.feature');
jest.useFakeTimers()
defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });
    afterEach(()=>{
        jest.runAllTimers()
    });
 
    test('User navigates to OTP Input Auth', ({ given, when, then, and }) => {
      let exampleBlockA:ShallowWrapper;
      let instance:OTPInputAuth
    	given('I am a User loading OTP Input Auth', () => {
        exampleBlockA = shallow(<OTPInputAuth {...screenProps}/>);
            
      
    	});

    	when('I navigate to the OTP Input Auth', () => {
        instance = exampleBlockA.instance() as OTPInputAuth
       
    	});

    	then('OTP Input Auth will load with out errors', () => {
        expect(exampleBlockA).toBeTruthy();
        instance.componentDidMount();
        instance.submitandNxt();
        const msgPlayloadAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
        msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "USER-TOKEN");
        runEngine.sendMessage("Unit Test", msgPlayloadAPI)  

        const emailValue ="sonali.h@protonshub.com"
        const userAccountID =  emailValue;
       
        const msgValidationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
        msgValidationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgValidationAPI.messageId);
        msgValidationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
        {
            "data": [
                {
                    "email_validation_regexp": "^[a-zA-Z0-9.!\\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                    "password_validation_regexp": "^(?=.*[A-Z])(?=.*[#!@$&*?<>',\\[\\]}{=\\-)(^%`~+.:;_])(?=.*[0-9])(?=.*[a-z]).{8,}$",
                    "password_validation_rules": "Password should be a minimum of 8 characters long, contain both uppercase and lowercase characters, at least one digit, and one special character (!@#$&*?<>',[]}{=-)(^%`~+.:;_)."
                }
            ]
        });
        runEngine.sendMessage("Unit Test", msgValidationAPI)
         
        instance.setState({
          otpAuthToken:'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6NDIsImV4cCI6MTY3MjcyOTIyMywidHlwZSI6IkFjY291bnRCbG9jazo6RW1haWxBY2NvdW50IiwiYWNjb3VudF9pZCI6NDIsInRva2VuX3R5cGUiOiJmb3Jnb3RfcGFzc3dvcmQiLCJhY3RpdmF0ZWQiOmZhbHNlfQ.6CpVZbMbvykxu_4nVghh9L3i4V6TruGksQCsfxqIDav6hB24FZ1TrNblRewsBXi_9wis3DzWEHZ9Wv2YI3oH6g',
          userAccountID: userAccountID,
          isFromForgotPassword:true
        });
      
    	});

    	then('I can Enter the OTP with out errors', () => {
        
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
          instance.otpAuthApiCallId = msg.messageId
          runEngine.sendMessage('From unit test', msg);
          
    });

    	then('I can select the button with with out errors', () => {
        instance.setState({otp:"569352",isFromForgotPassword:true })
        let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'submitOTP');
        buttonComponent.simulate('press');
        instance.submitOtp();
        instance.setState({otp:"569352",isFromForgotPassword:false });
        instance.submitOtp()
      

    	});

    	then('I can leave the screen with out errors', () => {
        instance.componentWillUnmount();
        expect(exampleBlockA).toBeTruthy();
    	});
    });

});
