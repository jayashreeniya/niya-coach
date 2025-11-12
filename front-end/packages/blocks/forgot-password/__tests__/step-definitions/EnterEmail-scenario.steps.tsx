// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import * as helpers from '../../../../framework/src/Helpers'
import React from "react";
import EnterEmail from "../../src/EnterEmail"
import MessageEnum,{getName} from "../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
const navigation = require("react-navigation")

const screenProps = {
    navigation: {  
        navigate:jest.fn(),
        goBack:jest.fn(),},
    id: "EnterEmail"
  }

const feature = loadFeature('./__tests__/features/EnterEmail-scenario.feature');
jest.useFakeTimers()
defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });
    afterEach(()=>{
        jest.runAllTimers();
        jest.useRealTimers();
      })
    test('User navigates to Enter Email', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:EnterEmail; 

        given('I am a User loading Enter Email', () => {
            exampleBlockA = shallow(<EnterEmail {...screenProps}/>);
            console.log(navigation,"--");
           
           
        });

     
        when('I navigate to the Enter Email', () => {
             instance = exampleBlockA.instance() as EnterEmail
             instance.setState({accountType:"sms",accountStatus:"ChangePassword",isChangePassword:false,passwordFieldTouched:false,confirmPasswordFieldTouched:false});
             instance.componentDidMount();
             const msgPlayloadAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
             msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q");
             runEngine.sendMessage("Unit Test", msgPlayloadAPI)   
            instance.setState({token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"})
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
             instance.validationApiCallId = msgValidationAPI.messageId
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
              instance.goToHome();
              instance.goToLogin();
           });

        then('Enter Email will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
             const msgDataAPI = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
              msgDataAPI.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgDataAPI.messageId
              );
              msgDataAPI.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                  data: [{}],
                }
              );
  
              runEngine.sendMessage("Unit Test", msgDataAPI);
  
              const msgError = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
              msgError.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgError.messageId
              );
              msgError.addData(getName(MessageEnum.RestAPIResponceErrorMessage), {
                data: [{
                }],
                 message:'success',
                search:true,
               
              });
  
              instance.recentSearchApiId = msgError.messageId;
              runEngine.sendMessage("Unit Test", msgError);
  
        
        });

        then('I can Enter the Email with out errors', () => {
            let textInputComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputEmail');
            textInputComponent.simulate('focus',false)
            textInputComponent.simulate('blur',true)
            textInputComponent.simulate('changeText', 'sonali@gmail.com');
      
        });

        then('I can select the button with with out errors', () => {
                let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnEMailOtpGet');
                buttonComponent.simulate('press');
                instance.goToOtpAfterEmailValidation(instance.state.emailValue)
              
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount();
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
