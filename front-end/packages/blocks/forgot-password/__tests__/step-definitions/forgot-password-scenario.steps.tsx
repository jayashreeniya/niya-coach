// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import * as helpers from '../../../../framework/src/Helpers'
import React from "react";
import ForgotPassword from "../../src/ForgotPassword"
import {Message} from "../../../../framework/src/Message"
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import {runEngine} from '../../../../framework/src/RunEngine'

const navigation = require("react-navigation")

const screenProps = {
    navigation: {  
        navigate:jest.fn(),
        goBack:jest.fn(),},
    id: "ForgotPassword"
  }

const feature = loadFeature('./__tests__/features/forgot-password-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to forgot password', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:ForgotPassword; 

        given('I am a User loading forgot password', () => {
            exampleBlockA = shallow(<ForgotPassword {...screenProps}/>);
            console.log(navigation,"--");
        });

        when('I navigate to the forgot password', () => {
             instance = exampleBlockA.instance() as ForgotPassword
        });

        then('forgot password will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.setState({accountType:"sms",accountStatus:"ChangePassword",isChangePassword:false,passwordFieldTouched:false,confirmPasswordFieldTouched:false});
            instance.componentDidMount();
            instance.validationRulesRequest();
            instance.goToHome();
            const msgPlayloadAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q");
            runEngine.sendMessage("Unit Test", msgPlayloadAPI)   
        
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
               
            
            
                        // Error email resposneotp
            
                        const msgemailOtpErrAPI1 = new Message(getName(MessageEnum.RestAPIResponceMessage))
                        msgemailOtpErrAPI1.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgemailOtpErrAPI1.messageId);
                        msgemailOtpErrAPI1.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
                        {
                            "errors": 
                                {
                                    "failed": "Failed"
                                }
                         
                        });
                        instance.requestEmailOtpCallId = msgemailOtpErrAPI1.messageId
                        runEngine.sendMessage("Unit Test", msgemailOtpErrAPI1)
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
            
            
                        instance.parseApiErrorResponse("");
                        instance.parseApiCatchErrorResponse("");
                        instance.setState({token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"});


            // phone otp
            const msgphoneOtpValidationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgphoneOtpValidationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgphoneOtpValidationAPI.messageId);
            msgphoneOtpValidationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "meta": 
                    {
                        "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                    }
             
            });
            instance.requestPhoneOtpCallId = msgphoneOtpValidationAPI.messageId
            runEngine.sendMessage("Unit Test", msgphoneOtpValidationAPI)

              // phone otp err
              const ErrmsgphoneOtpValidationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
              ErrmsgphoneOtpValidationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), ErrmsgphoneOtpValidationAPI.messageId);
              ErrmsgphoneOtpValidationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
              {
                  "errors": 
                      {
                          "errors": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                      }
               
              });
              instance.requestPhoneOtpCallId = ErrmsgphoneOtpValidationAPI.messageId
              runEngine.sendMessage("Unit Test", ErrmsgphoneOtpValidationAPI)
  
              const ErrmsgphoneOtpValidationAPI1 = new Message(getName(MessageEnum.RestAPIResponceMessage))
              ErrmsgphoneOtpValidationAPI1.addData(getName(MessageEnum.RestAPIResponceDataMessage), ErrmsgphoneOtpValidationAPI1.messageId);
              ErrmsgphoneOtpValidationAPI1.addData(getName(MessageEnum.RestAPIResponceErrorMessage), 
              {
                  "errors": 
                      {
                          "errors": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                      }
               
              });
              instance.requestPhoneOtpCallId = ErrmsgphoneOtpValidationAPI1.messageId
              runEngine.sendMessage("Unit Test", ErrmsgphoneOtpValidationAPI1)
              instance.parseApiCatchErrorResponse("err");
  
                     // confirm 
               
            const msgpconfirmValidationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgpconfirmValidationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgpconfirmValidationAPI.messageId);
            msgpconfirmValidationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "meta": 
                    {
                        "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                    }
             
            });
            instance.requestGoToConfirmationCallId = msgpconfirmValidationAPI.messageId
            runEngine.sendMessage("Unit Test", msgpconfirmValidationAPI)

              // phone otp err
              const ErrmsgcofirmAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
              ErrmsgcofirmAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), ErrmsgcofirmAPI.messageId);
              ErrmsgcofirmAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
              {
                  "errors": 
                      {
                          "errors": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                      }
               
              });
              instance.requestGoToConfirmationCallId = ErrmsgcofirmAPI.messageId
              runEngine.sendMessage("Unit Test", ErrmsgcofirmAPI)
  
              const ErrmsconfirmAPI1 = new Message(getName(MessageEnum.RestAPIResponceMessage))
              ErrmsconfirmAPI1.addData(getName(MessageEnum.RestAPIResponceDataMessage), ErrmsconfirmAPI1.messageId);
              ErrmsconfirmAPI1.addData(getName(MessageEnum.RestAPIResponceErrorMessage), 
              {
                  "errors": 
                      {
                          "errors": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                      }
               
              });
              instance.requestGoToConfirmationCallId = ErrmsconfirmAPI1.messageId
              runEngine.sendMessage("Unit Test", ErrmsconfirmAPI1)
              instance.parseApiCatchErrorResponse("err");
              instance.goToLogin();
           });

     

        then('I can select the button with with out errors', () => {
                let accountType="sms"
               let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'smsbtn');
                buttonComponent.simulate('press');
                instance.startForgotPassword("sms");
                instance.setState({accountStatus:accountType==="sms"?"EnterPhone":"EnterEmail"})
                let buttonEmailComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'emailbtn');
                buttonEmailComponent.simulate('press');
                instance.startForgotPassword("email");
                instance.setState({accountStatus:accountType==="sms"?"EnterPhone":"EnterEmail"})
              
              
                expect(instance.props.navigation.navigate).toHaveBeenCalled();
         
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount();
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
