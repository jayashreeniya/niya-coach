// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import * as helpers from '../../../../framework/src/Helpers'
import React from "react";
import PasswordCreatedSuccessfully from "../../src/PasswordCreatedSuccessfully"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {  
        navigate:jest.fn(),
        goBack:jest.fn(),},
    id: "PasswordCreatedSuccessfully"
  }

const feature = loadFeature('./__tests__/features/PasswordCreatedSuccessfully-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to Password Created Successfully', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:PasswordCreatedSuccessfully; 

        given('I am a User loading Password Created Successfully', () => {
            exampleBlockA = shallow(<PasswordCreatedSuccessfully {...screenProps}/>);
            console.log(navigation,"--");
        });

        when('I navigate to the Password Created Successfully', () => {
             instance = exampleBlockA.instance() as PasswordCreatedSuccessfully
        });

        then('Password Created Successfully will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            // instance.setState({accountType:"sms",accountStatus:"ChangePassword",isChangePassword:false,passwordFieldTouched:false,confirmPasswordFieldTouched:false});
            instance.componentDidMount();
            instance.validationRulesRequest();
        });

     

        then('I can select the button with with out errors', () => {
                // let buttonEmailComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'goToLoginAfterPass');
                // buttonEmailComponent.simulate('press');
             
                // expect(instance.props.navigation.navigate).toHaveBeenCalled();
         
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount();
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
