// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import React from "react";
import NewPassword from "../../src/NewPassword"
import { render, screen, fireEvent } from '@testing-library/react-native';
import {Message} from "../../../../framework/src/Message"
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import {runEngine} from '../../../../framework/src/RunEngine'

const navigation = require("react-navigation")

const screenProps = {
    navigation: {  
        navigate:jest.fn(),
        goBack:jest.fn(),},
    id: "NewPassword"
  }
  
const feature = loadFeature('./__tests__/features/NewPassword-scenario.feature');
jest.useFakeTimers();
defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.useFakeTimers();
        jest.runAllTimers();
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'android' }}));
      });

    test('User navigates to New Password', ({ given, when, then, and }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:NewPassword; 
    	given('I am a User loading New Password', () => {
            exampleBlockA = shallow(<NewPassword {...screenProps}/>);
     
    	});

    	when('I navigate to the New Password', () => {
            instance = exampleBlockA.instance() as NewPassword
      
    	});

    	then('NewPassword will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.componentDidMount();
            instance.validationRulesRequest();
            instance.goToLogin();
            instance.goToHome();
            instance.backAction();
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
            // email otp

            const msgemailOtpValidationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgemailOtpValidationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgemailOtpValidationAPI.messageId);
            msgemailOtpValidationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "meta": 
                    {
                        "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                    }
             
            });
            instance.requestEmailOtpCallId = msgemailOtpValidationAPI.messageId
            runEngine.sendMessage("Unit Test", msgemailOtpValidationAPI)

            // Error email otp

            const msgemailOtpErrAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgemailOtpErrAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgemailOtpErrAPI.messageId);
            msgemailOtpErrAPI.addData(getName(MessageEnum.RestAPIResponceErrorMessage), 
            {
                "errors": 
                    {
                        "failed": "Failed"
                    }
             
            });
            instance.requestEmailOtpCallId = msgemailOtpErrAPI.messageId
            runEngine.sendMessage("Unit Test", msgemailOtpErrAPI)


            // phone Otp
            const PhoneOtpCallIdAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            PhoneOtpCallIdAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage),PhoneOtpCallIdAPI.messageId);
            PhoneOtpCallIdAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "meta": {
                    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                }
            });
            instance.requestPhoneOtpCallId = PhoneOtpCallIdAPI.messageId
            runEngine.sendMessage("Unit Test", PhoneOtpCallIdAPI);  

            // phone otp error
             
             const PhoneOtpErrAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
             PhoneOtpErrAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage),PhoneOtpErrAPI.messageId);
             PhoneOtpErrAPI.addData(getName(MessageEnum.RestAPIResponceErrorMessage), 
             {
                "errors": [
                    {
                        "failed": "Failed"
                    }
                ]
             });
             instance.requestPhoneOtpCallId = PhoneOtpErrAPI.messageId
             runEngine.sendMessage("Unit Test", PhoneOtpErrAPI);  
            instance.parseApiErrorResponse("error Failed");


            const msgPlayloadAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "USER-TOKEN");
            runEngine.sendMessage("Unit Test", msgPlayloadAPI)  

            // 
            const msgForgotPasswordAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            msgForgotPasswordAPI.addData(getName(MessageEnum.NavigationForgotPasswordPageInfo), "USER-TOKEN");
            runEngine.sendMessage("Unit Test", msgForgotPasswordAPI)  


            const CountyCodeAPI = new Message(getName(MessageEnum.CountyCodeDataMessage))
            CountyCodeAPI.addData(getName(MessageEnum.CountryCodeMessage), CountyCodeAPI.messageId);
            CountyCodeAPI.addData(getName(MessageEnum.CountyCodeDataMessage),"countrycode");
           
            runEngine.sendMessage("Unit Test", CountyCodeAPI)  
            
            instance.parseApiErrorResponse("");
            instance.parseApiCatchErrorResponse("");
            instance.setState({token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"});
     
    	});

        then('I can enter a password with out errors', async() => {
             const { container } = render(<NewPassword />)
            //  await waitFor(() => container.getByText('password'));
            fireEvent(screen.getByPlaceholderText(instance.placeholderIsPassword), 'blur');
      
           instance.setState({passwordFieldTouched:true});
             fireEvent(screen.getByPlaceholderText(instance.placeholderIsPassword), 'focus');
                instance.setState({passwordFieldTouched:false});
        });

        then('I can toggle the Password Show/Hide with out errors', () => {
            const { container } = render(<NewPassword />)
            fireEvent(screen.getByTestId('btnPasswordShowHide'),'press');
       
            instance.setState({enablePasswordField:!instance.state
                .enablePasswordField});
            
        });
        
        then('I can enter a confimation password with out errors', () => {
            const { container } = render(<NewPassword />)
            fireEvent(screen.getByPlaceholderText(instance.placeholderIsReTypePassword), 'blur');
      
           instance.setState({confirmPasswordFieldTouched:false});
             fireEvent(screen.getByPlaceholderText(instance.placeholderIsReTypePassword), 'focus');
                instance.setState({confirmPasswordFieldTouched:true});

      });


        then('I can toggle the Confimation Password Show/Hide with out errors', () => {
            const { container } = render(<NewPassword />)
            fireEvent(screen.getByTestId('btnConfirmPasswordShowHide'), 'press');
      
            instance.setState({btnConfirmPasswordShowHide:!instance.state
                .btnConfirmPasswordShowHide});
          
           
        });


    	 and('I can select the button with with out errors', () => {
            const { container } = render(<NewPassword />)
            fireEvent(screen.getByTestId('newPassCreate'),'press');
            instance.goToConfirmationAfterPasswordChange({values:{password:"Sonali@1234",confirmPassword:'Sonali@1234'}});
           
            const PhoneOtpCallIdAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            PhoneOtpCallIdAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage),PhoneOtpCallIdAPI.messageId);
            PhoneOtpCallIdAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "meta": {
                    "error": " error got accured"
                }
            });
            instance.requestGoToConfirmationCallId = PhoneOtpCallIdAPI.messageId
            runEngine.sendMessage("Unit Test", PhoneOtpCallIdAPI);  
            // otp error
            const errorPhoneOtpCallIdAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            errorPhoneOtpCallIdAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage),errorPhoneOtpCallIdAPI.messageId);
            errorPhoneOtpCallIdAPI.addData(getName(MessageEnum.RestAPIResponceErrorMessage), 
            {
                "errors": {
                    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                }
            });
            instance.requestGoToConfirmationCallId = errorPhoneOtpCallIdAPI.messageId
            runEngine.sendMessage("Unit Test", errorPhoneOtpCallIdAPI);  

         
    	});

    	and('I can leave the screen with out errors', () => {
            instance.componentWillUnmount();
            expect(exampleBlockA).toBeTruthy();
   
    	});
    });



});
