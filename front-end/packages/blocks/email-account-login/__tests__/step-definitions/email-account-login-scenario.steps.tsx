// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import { Dimensions } from "react-native"
import * as helpers from '../../../../framework/src/Helpers'
import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from "../../../../framework/src/Message"
import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import EmailAccountLoginBlock from "../../src/EmailAccountLoginBlock"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        goBack: jest.fn(),
        navigate: jest.fn(),
        reset: jest.fn()
    },
    id: "EmailAccountLoginBlock"
}

const feature = loadFeature('./__tests__/features/email-account-login-scenario.feature');

defineFeature(feature, (test) => {

    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'android' } }))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android');
    });

    test('User navigates to Email Log In', ({ given, when, then }) => {
        let mobileAccountLogInWrapper: ShallowWrapper;
        let instance: EmailAccountLoginBlock;

        given('I am a User attempting to Log In with a Email', () => {
            mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />)
            expect(mobileAccountLogInWrapper).toBeTruthy()

            instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock;

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

        });

        when('I navigate to the Log In Screen', () => {
            instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
            instance.setState({ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height });
            instance.forceUpdate();
        });

        then('I can select the Log In button with out errors', () => {
            let buttonComponent = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'btnEmailLogIn');
            buttonComponent.simulate('press');
        });

        then('I can select the Forgot Password button with out errors', () => {
            let buttonComponent = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'btnForgotPassword');
            buttonComponent.simulate('press');
        });


        then('I can enter a email address with out errors', () => {
            let textInputComponent = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'txtInputEmail');
            textInputComponent.simulate('changeText', 'hello@aol.com');
            let buttonComponent = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'Background');
            buttonComponent.simulate('press')

        });

        then('I can enter a password with out errors', () => {
            let textInputComponent = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'txtInputPassword');
            textInputComponent.simulate('changeText', 'passWord1!');
            let btnPass = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'btnPasswordShowHide');
            btnPass.simulate('press');
            let btnCheckBox = mobileAccountLogInWrapper.findWhere((node) => node.prop('testID') === 'CustomCheckBox');
            btnCheckBox.simulate('press');

        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount();
            expect(mobileAccountLogInWrapper).toBeTruthy();
        });
    });

    test('Empty Email Address', ({ given, when, then }) => {
        let mobileAccountLogInWrapper: ShallowWrapper;
        let instance: EmailAccountLoginBlock;

        given('I am a User attempting to Log In with a Email Address', () => {
            mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />);
            expect(mobileAccountLogInWrapper).toBeTruthy();
        });

        when('I Log In with an empty Email Address', () => {
            instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock;
            instance.setState({ email: "", password: "password!" });
        });

        then('Log In Should Fail', () => {

            expect(instance.doEmailLogIn()).toBe(false);

            const msgLogInErrorRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgLogInErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgLogInErrorRestAPI);
            msgLogInErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                    "errors": [
                        {
                            "failed_login": "Login Failed"
                        }
                    ]
                });

            msgLogInErrorRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgLogInErrorRestAPI.messageId);
            instance.apiEmailLoginCallId = msgLogInErrorRestAPI.messageId
            runEngine.sendMessage("Unit Test", msgLogInErrorRestAPI);
        });

    });

    test('Email Address and Empty Password', ({ given, when, then }) => {
        let mobileAccountLogInWrapper: ShallowWrapper;
        let instance: EmailAccountLoginBlock;

        given('I am a User attempting to Log In with a Email Address', () => {
            mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />);
            expect(mobileAccountLogInWrapper).toBeTruthy();
        });

        when('I Log In with a Email Address and empty Password', () => {
            instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
            instance.setState({ email: "test@aol.com", password: "" })
        });

        then('Log In Should Fail', () => {
            expect(instance.doEmailLogIn()).toBe(false);
        });
    });

    test('Password and Empty Email Address', ({ given, when, then }) => {
        let mobileAccountLogInWrapper: ShallowWrapper;
        let instance: EmailAccountLoginBlock;

        given('I am a User attempting to Log In with a Email Address', () => {
            mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />);
            expect(mobileAccountLogInWrapper).toBeTruthy();
        });

        when('I Log In with a Password and empty Email Address', () => {
            instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
            instance.setState({ email: "", password: "password" })
        });

        then('Log In Should Fail', () => {
            expect(instance.doEmailLogIn()).toBe(false);
        });
    });

    test('Email Address and Password', ({ given, when, then }) => {

        let mobileAccountLogInWrapper: ShallowWrapper;
        let instance: EmailAccountLoginBlock;

        given('I am a Registed User attempting to Log In with a Email Address', () => {
            mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />);
            expect(mobileAccountLogInWrapper).toBeTruthy();
        });

        when('I Log In with Email Address and Password', () => {
            instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock
            instance.setState({ email: "abc@aol.com", password: "password" })
        });

        then('Log In Should Succeed', () => {
            expect(instance.doEmailLogIn()).toBe(true);
        });

        then('RestAPI will return token', () => {
            const msgLogInSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgLogInSucessRestAPI.messageId);
            msgLogInSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
                "meta": {
                    "token": "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"
                }
            });
            instance.apiEmailLoginCallId = msgLogInSucessRestAPI.messageId
            runEngine.sendMessage("Unit Test", msgLogInSucessRestAPI)

        });
    });

    test('Remember Me - Email Address Account Log In', ({ given, when, then }) => {
        let mobileAccountLogInWrapper: ShallowWrapper;
        let instance: EmailAccountLoginBlock;

        given('I am a Registed User who has already Logged In and selected Remember Me', () => {
            //Force ios to render mobile layout once.
            jest.spyOn(helpers, 'getOS').mockImplementation(() => 'ios');
            mobileAccountLogInWrapper = shallow(<EmailAccountLoginBlock {...screenProps} />);
            expect(mobileAccountLogInWrapper).toBeTruthy();
        });

        when('I navigate to Email Address Account Log In', () => {

            instance = mobileAccountLogInWrapper.instance() as EmailAccountLoginBlock

            const msgRestoreCreds = new Message(getName(MessageEnum.ReciveUserCredentials))
            msgRestoreCreds.addData(getName(MessageEnum.LoginPassword), "passWord1!")
            msgRestoreCreds.addData(getName(MessageEnum.LoginUserName), "test@aol.com")
            runEngine.sendMessage("Unit Test", msgRestoreCreds)

        });

        then('The Country Code, Email Address and Password will be restored', () => {
            expect(mobileAccountLogInWrapper).toBeTruthy();
        });
    });


});
