// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import * as helpers from '../../../../framework/src/Helpers'
import React from "react";
import ForgotPasswordOTP from "../../src/ForgotPasswordOTP"
import {Message} from "../../../../framework/src/Message"
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import {runEngine} from '../../../../framework/src/RunEngine'

const navigation = require("react-navigation")

const screenProps = {
    navigation: {  
        navigate:jest.fn(),
        goBack:jest.fn(),},
    id: "ForgotPasswordOTP"
  }

const feature = loadFeature('./__tests__/features/forgot-password-scenario.feature');
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
 
    test('User navigates to forgot password', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:ForgotPasswordOTP; 

        given('I am a User loading forgot password', () => {
            exampleBlockA = shallow(<ForgotPasswordOTP {...screenProps}/>);
            console.log(navigation,"--");
        });

        when('I navigate to the forgot password', () => {
             instance = exampleBlockA.instance() as ForgotPasswordOTP
        });

        then('forgot password will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.componentDidMount();
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
            instance.validationAPICallId = msgValidationAPI.messageId
            runEngine.sendMessage("Unit Test", msgValidationAPI)
         
            const msgPlayloadAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "USER-TOKEN");
            runEngine.sendMessage("Unit Test", msgPlayloadAPI)  
            instance.setState({
                otpAuthToken:'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6NDIsImV4cCI6MTY3MjcyOTIyMywidHlwZSI6IkFjY291bnRCbG9jazo6RW1haWxBY2NvdW50IiwiYWNjb3VudF9pZCI6NDIsInRva2VuX3R5cGUiOiJmb3Jnb3RfcGFzc3dvcmQiLCJhY3RpdmF0ZWQiOmZhbHNlfQ.6CpVZbMbvykxu_4nVghh9L3i4V6TruGksQCsfxqIDav6hB24FZ1TrNblRewsBXi_9wis3DzWEHZ9Wv2YI3oH6g',
                userAccountID: "sms",
                isFromForgotPassword:true
              });

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
               let txtInput = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtMobilePhoneOTP');
                txtInput.simulate('changeText',"12334");
               
                instance.setState({otp:"569352",isFromForgotPassword:true })
                let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnSubmitOTP');
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
