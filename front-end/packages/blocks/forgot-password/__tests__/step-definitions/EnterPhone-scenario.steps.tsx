// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import * as helpers from '../../../../framework/src/Helpers'
import React from "react";
import EnterPhone from "../../src/EnterPhone"
import MessageEnum,{getName} from "../../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
const navigation = require("react-navigation")

const screenProps = {
    navigation: {  
        navigate:jest.fn(),
        goBack:jest.fn(),},
    id: "EnterPhone"
  }

const feature = loadFeature('./__tests__/features/EnterPhone-scenario.feature');
jest.useFakeTimers()
defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });
    afterEach(()=>{
        jest.runAllTimers()
      })
    test('User navigates to Enter Phone', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:EnterPhone; 

        given('I am a User loading Enter Phone', () => {
           
            exampleBlockA = shallow(<EnterPhone {...screenProps}/>);
            console.log(navigation,"--");
            jest.mock('react-native/Libraries/Utilities/Platform', () => {
                const Platform = jest.requireActual('react-native/Libraries/Utilities/Platform');
                Platform.OS = 'ios';
                return Platform;
              });
           
        });

     
        when('I navigate to the Enter Phone', () => {
             instance = exampleBlockA.instance() as EnterPhone
             instance.setState({accountType:"sms",accountStatus:"ChangePassword",isChangePassword:false,passwordFieldTouched:false,confirmPasswordFieldTouched:false});
             instance.componentDidMount();
             instance.validationRulesRequest();

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
 
            
             const PhoneOtpCallIdAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
             PhoneOtpCallIdAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage),PhoneOtpCallIdAPI.messageId);
             PhoneOtpCallIdAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
             {
                 "meta": 
                    {
                        "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                    }
             
             });
             instance.requestPhoneOtpCallId = PhoneOtpCallIdAPI.messageId
           
             runEngine.sendMessage("Unit Test", PhoneOtpCallIdAPI);  
            //  phone otp err
            const PhoneOtpCallIdAPI1 = new Message(getName(MessageEnum.RestAPIResponceMessage))
            PhoneOtpCallIdAPI1.addData(getName(MessageEnum.RestAPIResponceDataMessage),PhoneOtpCallIdAPI1.messageId);
            PhoneOtpCallIdAPI1.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "errors": 
                   {
                       "errors": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                   }
            
            });
            instance.requestPhoneOtpCallId = PhoneOtpCallIdAPI1.messageId
          
            runEngine.sendMessage("Unit Test", PhoneOtpCallIdAPI1);  


            const PhoneOtpCallIdAPI2 = new Message(getName(MessageEnum.RestAPIResponceMessage))
            PhoneOtpCallIdAPI2.addData(getName(MessageEnum.RestAPIResponceDataMessage),PhoneOtpCallIdAPI2.messageId);
            PhoneOtpCallIdAPI2.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "errors": "Unable to sent otp due to invalid number"
            });
            instance.requestPhoneOtpCallId = PhoneOtpCallIdAPI2.messageId
          
            runEngine.sendMessage("Unit Test", PhoneOtpCallIdAPI2);
 
                    
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

              // confirm otp err
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
             
        });

        then('Enter Phone will load with out errors', () => {
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
  
              instance.requestPhoneOtpCallId = msgError.messageId;
              runEngine.sendMessage("Unit Test", msgError);
  
        
        });

        then('I can Enter the Phone Number with out errors', () => {
            let textInputComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputPhoneNumber');
            textInputComponent.simulate('focus',false)
            textInputComponent.simulate('blur',true)
            textInputComponent.simulate('changeText', '919049343037');
            
        });

        then('I can select the button with with out errors', () => {
                let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnOtpGet');
                buttonComponent.simulate('press');
                instance.goToOtpAfterPhoneValidation(instance.state.phoneValue)
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount();
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
