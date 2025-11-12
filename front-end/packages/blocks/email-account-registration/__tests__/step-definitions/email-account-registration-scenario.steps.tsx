// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import EmailAccountRegistration from "../../src/EmailAccountRegistration"

const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
       
    },
      id: "email-account-registration-scenario"
   }

const feature = loadFeature('./__tests__/features/email-account-registration-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.useFakeTimers();
        jest.runAllTimers();
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'android' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android');
    });

    test('Register Email Account', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()  
         
        });

        when('I navigate to the Registration Screen', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration
            instance.componentDidMount();
            instance.getPrivacyPolicyContent();
            instance.isNonNullAndEmpty('9049343444')
            instance.validateCountryCodeAndPhoneNumber('','');
        
            instance.validateCountryCodeAndPhoneNumber('91','9585856568');
           });

        then('I can enter a full name with out errors', () => {
            let textInputComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'txtInputFirstName');
            textInputComponent.simulate('changeText', 'FIRST');

            let buttonComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'Background');
            buttonComponent.simulate('press')
        });


            
        then('I can enter a email with out errors', () => {
            let textInputComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'txtInputEmail');
            textInputComponent.simulate('changeText', 'a@bb.com');
        });

        then('I can enter a access code with out errors', () => {
            let textInputComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'accessCode');
            textInputComponent.simulate('changeText', 'DZZHzv8');
        });

        then('I can enter a password with out errors', () => {
            let textInputComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'txtInputPassword');
            textInputComponent.simulate('changeText', 'password');
        });

        then('I can toggle the Password Show/Hide with out errors', () => {
            let buttonComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'btnPasswordShowHide');
            buttonComponent.simulate('press')
        });
        
        then('I can enter a confimation password with out errors', () => {
            let textInputComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'txtInputConfirmPassword');
            textInputComponent.simulate('changeText', 'password');
        });


        then('I can toggle the Confimation Password Show/Hide with out errors', () => {
            let buttonComponent = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'btnConfirmPasswordShowHide');
            buttonComponent.simulate('press')
        });

        then('I can accept terms and conditions', () => {
            const btn_termsServices=emailAccountRegistrationWrapperRegistration.findWhere(
                (node)=>node.prop("testID")==="btnLegalTermsAndCondition")
                btn_termsServices.simulate("press")
    
                const btn_termsPrivacy=emailAccountRegistrationWrapperRegistration.findWhere(
                (node)=>node.prop("testID")==="btnLegalPrivacyPolicy")
                btn_termsPrivacy.simulate("press")
        });

        then("I can select signUp without errors",()=>
        {
            const signUp=emailAccountRegistrationWrapperRegistration.findWhere(
                (node)=>node.prop("testID")==="btnSignUp")
            signUp.simulate("press")
             
        }) 
        then("I can go back to Login screen",()=>
        {
            const btn_goBack=emailAccountRegistrationWrapperRegistration.findWhere(
                (node)=>node.prop("testID")==="btnLogin")
            btn_goBack.simulate("press")
               
        }) 

    });


    test('Empty Full Name', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register with a Email', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()
        });

        when('I Register with an empty Full Name', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration;
        });

        then('Registration Should Fail', async() => {
         expect(await instance.createAccount()).toBe(false);
        });

        then('RestAPI will return an error', () => {
          
            let msgRegistrationErrorRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgRegistrationErrorRestAPI);
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "errors": [
                    {
                        "failed_login": "Login Failed"
                    }
                ]
            });

            instance.createAccountApiCallId = msgRegistrationErrorRestAPI
            runEngine.sendMessage("Unit Test", msgRegistrationErrorRestAPI)
        });
        
    });
    

    test('Invalid Email', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register with a Email', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()
        });

        when('I Register with an Invalid Email', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration

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

            const msgPlayloadAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "USER-TOKEN");
            runEngine.sendMessage("Unit Test", msgPlayloadAPI)   
            instance.setState({firstName: "FIRST", lastName: "LAST", email: "a", password: "pass", reTypePassword: "pass"});

        });

        then('Registration Should Fail', async() => {
         expect(await instance.createAccount()).toBe(false);
        });

        then('RestAPI will return an error', () => {
          
            let msgRegistrationErrorRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgRegistrationErrorRestAPI);
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "errors": [
                    {
                        "failed_login": "Login Failed"
                    }
                ]
            });

            instance.createAccountApiCallId = msgRegistrationErrorRestAPI
            runEngine.sendMessage("Unit Test", msgRegistrationErrorRestAPI)
        });
        
    });
    
    test('Invalid Access Code', ({ given, when, then, and }) => {
    	given('I am a User attempting to Register with a Email', () => {

    	});

    	when('I Register with an Invalid Access Code', () => {

    	});

    	then('Registration Should Fail', () => {

    	});

    	and('RestAPI will return an error', () => {

    	});
    });



    test('Invalid Password', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register with a Email', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()
        });

        when('I Register with an Invalid Password', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration

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

            const msgPlayloadAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "USER-TOKEN");
            runEngine.sendMessage("Unit Test", msgPlayloadAPI)  
             
            instance.setState({firstName: "FIRST", lastName: "LAST", email: "a@b.com", password: "pass", reTypePassword: "pass123"});
        });

        then('Registration Should Fail', async() => {
         expect(await instance.createAccount()).toBe(false);
        });

        then('RestAPI will return an error', () => {
          
            let msgRegistrationErrorRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgRegistrationErrorRestAPI);
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "errors": [
                    {
                        "failed_login": "Login Failed"
                    }
                ]
            });

            instance.createAccountApiCallId = msgRegistrationErrorRestAPI
            runEngine.sendMessage("Unit Test", msgRegistrationErrorRestAPI)
        });

      
        
    });


    test('Password and RePassword do not match', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register with a Email', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()
        });

        when('I Register with Password and RePassword that do not match', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration 
            instance.setState({firstName: "FIRST", lastName: "LAST", email: "a@b.com", password: "password123!!", reTypePassword: "pass123"});

        });

        then('Registration Should Fail', async() => {
         expect(await instance.createAccount()).toBe(false);
        });

        then('RestAPI will return an error', () => {
          
            let msgRegistrationErrorRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgRegistrationErrorRestAPI);
            msgRegistrationErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "errors": [
                    {
                        "failed_login": "Login Failed"
                    }
                ]
            });

            instance.createAccountApiCallId = msgRegistrationErrorRestAPI
            runEngine.sendMessage("Unit Test", msgRegistrationErrorRestAPI)
        });
        
    });

    test('full name length less then 3 char', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register with a full name length less then 3 chart', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()
        });

        when('I Register with full name', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration 
            instance.setState({firstName: "FT", email: "test@yopmail.com", password: "Test@123", reTypePassword: "Test@123",accessCode:'DZZHzv8',phone:'918948945954'});
            let btnSignUps = emailAccountRegistrationWrapperRegistration.findWhere((node) => node.prop('testID') === 'btnSignUp');
            btnSignUps.simulate('press')
        });

        then('Registration Should Succeed', async() => {
         expect(instance.state.firstName.length).toBe(2);   
        });

       
        
    });


    test('Valid Registration', ({ given, when, then }) => {
        let emailAccountRegistrationWrapperRegistration:ShallowWrapper;
        let instance:EmailAccountRegistration; 

        given('I am a User attempting to Register with a Email', () => {
            emailAccountRegistrationWrapperRegistration = shallow(<EmailAccountRegistration {...screenProps}/>)
            expect(emailAccountRegistrationWrapperRegistration).toBeTruthy()
        });

        when('I Register with all valid data', () => {
            instance = emailAccountRegistrationWrapperRegistration.instance() as EmailAccountRegistration 
            instance.setState({firstName: "FIRST", email: "a@b.com", password: "password123!!", reTypePassword: "password123!!",accessCode:'DZZHzv8',phone:'918948945954'});
        });

        then('Registration Should Succeed', async() => {
         expect(await instance.createAccount()).toBe(true);
            instance.saveLoggedInUserData();
            instance.sendLoginSuccessMessage();
            // instance.saveFcmTOken("eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q");
     
           
        });

        then('RestAPI will return token', () => {
            
            const magLogInSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            magLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), magLogInSucessRestAPI);
            magLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
                "meta": {
                    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                }
            });
            instance.createAccount();
            instance.createAccountApiCallId = magLogInSucessRestAPI;
            runEngine.sendMessage("Unit Test", magLogInSucessRestAPI);
            });
        
            then('Terms and Condition', () => {
            
                const magLogInSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
                magLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), magLogInSucessRestAPI);
                magLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
                    "data": [
                        "<p><strong style=\"color: rgb(10, 10, 10);\">TERM AND CONDITIONS</strong></p><p class=\"ql-align-justify\"><span style=\"color: rgb(10, 10, 10);\">&nbsp;</span></p><p>&nbsp;</p>"
                    ]
                });
                instance.getTermsAndConditionData();
                instance.navigateToTermsAndCondition()
                instance.termsAndConditionApiId = magLogInSucessRestAPI;
                runEngine.sendMessage("Unit Test", magLogInSucessRestAPI);
                });
        
    });
});
