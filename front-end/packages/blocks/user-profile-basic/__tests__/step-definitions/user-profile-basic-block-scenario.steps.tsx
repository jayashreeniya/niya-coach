// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import { fireEvent, screen, render } from '@testing-library/react-native';
import MessageEnum, {
    getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import UserProfileBasicBlock from "../../src/UserProfileBasicBlock";
const navigation = require("react-navigation");

const screenProps = {
    navigation: {
        navigate: jest.fn(),

    },
    id: "UserProfileBasicBlock",
};
jest.mock('react-native-image-crop-picker');
const feature = loadFeature(
    "./__tests__/features/user-profile-basic-block-scenario.feature"
);



defineFeature(feature, (test) => {
    beforeEach(() => {
        jest.resetModules();
        jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
        jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
    });

    test("User navigates to User Profile BasicBlock", ({ given, when, then }) => {
        let exampleBlockA: ShallowWrapper;
        let instance: UserProfileBasicBlock;

        given("I am a User loading User Profile BasicBlock", () => {

            exampleBlockA = shallow(<UserProfileBasicBlock {...screenProps} />);
        });

        when("I navigate to the User Profile BasicBlock", () => {
            instance = exampleBlockA.instance() as UserProfileBasicBlock;
            instance.role = "employee";


        });

        then("User Profile BasicBlock will load with out errors", () => {
            instance = exampleBlockA.instance() as UserProfileBasicBlock;
            instance.componentDidMount();
            instance.btnEnableEditPasswordProps.onPress();
            instance.btnDisableEditPasswordProps.onPress();
            instance.btnPasswordShowHideButtonProps.onPress();
            instance.validateMobileAndThenUpdateUserProfile();
            instance.enableDisableEditPassword(false);
            instance.goToPrivacyPolicy();
            instance.goToTermsAndCondition();
            instance.getUserProfile();

            instance.registrationAndLoginType="EmailAccount";
            
            instance.setState({
                edtEmailEnabled: false,
                llChangePwdDummyShowContainerVisible: true
              });
            instance.txtInputPhoneNumberProps.onChangeText('8888888888')
            instance.txtInputCurrentPasswordProps.onChangeText('ddfs');
            instance.txtInputNewPasswordProps.onChangeText('sosd');
            instance.btnNewPasswordShowHideButtonProps.onPress();
            instance.txtInputReTypePasswordProps.onChangeText('rer');
            instance.btnReTypePasswordShowHideProps.onPress();
            instance.validateAndUpdateProfile();
            instance.validateMobileOnServer('','')
             expect(exampleBlockA).toBeTruthy();
            const msgLoadAPI = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );
            msgLoadAPI.addData(
                getName(MessageEnum.CountryCodeMessage),
                msgLoadAPI.id);
            msgLoadAPI.addData(getName(MessageEnum.CountyCodeDataMessage), "91");

            runEngine.sendMessage("Unit Test", msgLoadAPI);
            expect(exampleBlockA).toBeTruthy();

            instance.setState({
                currentCountryCode:"91"
                  
              });
            // Sessio res
          
              
            const msgSessionRequesterIdAPI = new Message(
                getName(MessageEnum.uniqueSessionRequesterId)
            );
            msgSessionRequesterIdAPI.addData(
                getName(MessageEnum.uniqueSessionRequesterId),
                msgSessionRequesterIdAPI.id);
            msgSessionRequesterIdAPI.addData(getName(MessageEnum.SessionResponseToken), "user-token");

            runEngine.sendMessage("Unit Test", msgSessionRequesterIdAPI);


            // error
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
            runEngine.sendMessage("Unit Test", msgValidationAPI);

            instance.getUserProfile();
            // userProfileGetApiCallId
            const msgUserProfileValidationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgUserProfileValidationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgUserProfileValidationAPI.messageId);
            msgUserProfileValidationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                    "data": {
                        "attributes":{
                            "email": "^[a-zA-Z0-9.!\\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                            "first_name": "^(?=.*[A-Z])(?=.*[#!@$&*?<>',\\[\\]}{=\\-)(^%`~+.:;_])(?=.*[0-9])(?=.*[a-z]).{8,}$",
                            "last_name": "Password should be a minimum of 8 characters long, contain both uppercase and lowercase characters, at least one digit, and one special character (!@#$&*?<>',[]}{=-)(^%`~+.:;_).",
                            "country_code":'91',
                            'phone_number':'7907907609',
                            "type":'country_code',
                            "registrationAndLoginType":'SmsAccount'
                        }
                    }
                });
            instance.userProfileGetApiCallId = msgUserProfileValidationAPI.messageId
            runEngine.sendMessage("Unit Test", msgUserProfileValidationAPI)
            instance.registrationAndLoginType=''

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

            instance.userProfileGetApiCallId = msgRegistrationErrorRestAPI
            runEngine.sendMessage("Unit Test", msgRegistrationErrorRestAPI)
            instance.parseApiErrorResponse("error");
            // apiChangePhoneValidation
            const msgChangePhoneValidationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgChangePhoneValidationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgChangePhoneValidationAPI.messageId);
            msgChangePhoneValidationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                    "data": {
                        "attributes":{
                            "email": "^[a-zA-Z0-9.!\\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                            "first_name": "^(?=.*[A-Z])(?=.*[#!@$&*?<>',\\[\\]}{=\\-)(^%`~+.:;_])(?=.*[0-9])(?=.*[a-z]).{8,}$",
                            "last_name": "Password should be a minimum of 8 characters long, contain both uppercase and lowercase characters, at least one digit, and one special character (!@#$&*?<>',[]}{=-)(^%`~+.:;_).",
                            "country_code":'91',
                            'phone_number':'7907907609',
                            "type":'country_code',
                            "registrationAndLoginType":'SmsAccount'
                        }
                    }
                });
            instance.apiChangePhoneValidation = msgChangePhoneValidationAPI.messageId
            runEngine.sendMessage("Unit Test", msgChangePhoneValidationAPI)

            // error
            const msgChangePhoneValidationAPI1 = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgChangePhoneValidationAPI1.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgChangePhoneValidationAPI1.messageId);
            msgChangePhoneValidationAPI1.addData(getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                    "errors": {
                        "errors":{
                            "registrationAndLoginType":'SmsAccount'
                        }
                    }
                });
            instance.apiChangePhoneValidation = msgChangePhoneValidationAPI1.messageId
            runEngine.sendMessage("Unit Test", msgChangePhoneValidationAPI1)

        //  apiCallMessageUpdateProfileRequestId

        const msgUpdateProfileRequestId = new Message(getName(MessageEnum.RestAPIResponceMessage))
        msgUpdateProfileRequestId.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgUpdateProfileRequestId.messageId);
        msgUpdateProfileRequestId.addData(getName(MessageEnum.RestAPIResponceSuccessMessage),
            {
                "data": {
                    "attributes":{
                        "email": "^[a-zA-Z0-9.!\\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                        "first_name": "^(?=.*[A-Z])(?=.*[#!@$&*?<>',\\[\\]}{=\\-)(^%`~+.:;_])(?=.*[0-9])(?=.*[a-z]).{8,}$",
                        "last_name": "Password should be a minimum of 8 characters long, contain both uppercase and lowercase characters, at least one digit, and one special character (!@#$&*?<>',[]}{=-)(^%`~+.:;_).",
                        "country_code":'91',
                        'phone_number':'7907907609',
                        "type":'country_code',
                        "registrationAndLoginType":'SmsAccount'
                    }
                }
            });
        instance.apiCallMessageUpdateProfileRequestId = msgUpdateProfileRequestId.messageId
        runEngine.sendMessage("Unit Test", msgUpdateProfileRequestId)
        instance.showAlert("Suce",'Profile update Successfully');
  // err
  //  apiCallMessageUpdateProfileRequestId

 const msgUpdateProfileRequestId1 = new Message(getName(MessageEnum.RestAPIResponceMessage))
 msgUpdateProfileRequestId1.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgUpdateProfileRequestId1.messageId);
 msgUpdateProfileRequestId1.addData(getName(MessageEnum.RestAPIResponceSuccessMessage),
     {
         "errors": {
             "errors":{
                 "email": "^[a-zA-Z0-9.!\\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                 "first_name": "^(?=.*[A-Z])(?=.*[#!@$&*?<>',\\[\\]}{=\\-)(^%`~+.:;_])(?=.*[0-9])(?=.*[a-z]).{8,}$",
                 "last_name": "Password should be a minimum of 8 characters long, contain both uppercase and lowercase characters, at least one digit, and one special character (!@#$&*?<>',[]}{=-)(^%`~+.:;_).",
                 "country_code":'91',
                 'phone_number':'7907907609',
                 "type":'country_code',
                 "registrationAndLoginType":'SmsAccount'
             }
         }
     });
 instance.apiCallMessageUpdateProfileRequestId = msgUpdateProfileRequestId1.messageId
 runEngine.sendMessage("Unit Test", msgUpdateProfileRequestId1)
 instance.showAlert("Suce",'Profile update Successfully');


        });
        then('I can enter a full name with out errors', async () => {
            
            let btnHeader = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputFirstName');
            btnHeader.simulate('changeText', 'dsds')


            let textInputComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputLastName');
            textInputComponent.simulate('changeText', 'txtInputLastName');

            let textInputComponentCountryCode = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputEmail');
            textInputComponentCountryCode.simulate('changeText', '91');


            let textInputComponentPhone = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputEmail');
            textInputComponentPhone.simulate('changeText', '8888888888');



        });



        then('I can enter a email with out errors', () => {

            let textInputComponentEmail = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputEmail');
            textInputComponentEmail.simulate('changeText', 'a@bb.com');

        });

       

        then("I can select submit without errors", async () => {
            expect(exampleBlockA).toBeTruthy();
            instance = exampleBlockA.instance() as UserProfileBasicBlock;
            let textInputComponentEmail = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnSubmit');
            textInputComponentEmail.simulate('press');

            const msgLoadAPI = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );
            msgLoadAPI.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgLoadAPI.messageId
            );
            msgLoadAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
                data: {
                    "id": "119",
                    "type": "account",
                    "attributes": {
                        "type": "EmailAccount",
                        "first_name": null,
                        "last_name": null,
                        "full_name": "Sonali",
                        "email": "sonali@gmail.com",
                        "access_code": "12345",
                        "gender": "Female",
                        "full_phone_number": "918976543234",
                        "activated": true,
                        "phone_number": "8976543234",
                        "country_code": "91",
                        "created_at": "2022-09-23T13:04:43.414Z",
                        "updated_at": "2022-10-07T12:10:15.116Z",
                        "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBDQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e7da9ff8ccb886565e256d1443c2e99203d74b31/images.jpeg"
                    }
                }
            });
            instance.userProfileApiCallId = msgLoadAPI.messageId;
            runEngine.sendMessage("Unit Test", msgLoadAPI);
            expect(exampleBlockA).toBeTruthy();
            instance.setState({ isLoading: false, role: "employee" })

        });

        then("User Profile BasicBlock failed to load data from the server", () => {
            instance = exampleBlockA.instance() as UserProfileBasicBlock;
            const msgLoadFailRestAPI = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );
            msgLoadFailRestAPI.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgLoadFailRestAPI
            );
            msgLoadFailRestAPI.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                    errors: [
                        {
                            message: "Failed to load data",
                        },
                    ],
                }
            );

            msgLoadFailRestAPI.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgLoadFailRestAPI.messageId
            );
            instance.userProfileApiCallId = msgLoadFailRestAPI.messageId;
            runEngine.sendMessage("Unit Test", msgLoadFailRestAPI);

        });

        then("I can leave the screen with out errors", () => {
            instance.componentWillUnmount();
            expect(exampleBlockA).toBeTruthy();
        });
    });
});
