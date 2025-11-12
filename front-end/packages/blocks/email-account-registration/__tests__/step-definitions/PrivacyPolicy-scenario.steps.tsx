// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
    getName,
  } from "../../../../framework/src/Messages/MessageEnum";
import * as helpers from '../../../../framework/src/Helpers'
import { runEngine } from "../../../../framework/src/RunEngine";

import React from "react";
import PrivacyPolicy from "../../src/PrivacyPolicy"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {navigate: jest.fn(),
    goBack:jest.fn()
    },
    id: "PrivacyPolicy"
  }

const feature = loadFeature('./__tests__/features/PrivacyPolicy-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to PrivacyPolicy', ({ given, when, then }) => {
        let PrivacyPolicyscreen:ShallowWrapper;
        let instance:PrivacyPolicy; 

        given('I am a User loading PrivacyPolicy', () => {
            PrivacyPolicyscreen = shallow(<PrivacyPolicy {...screenProps}/>)
            PrivacyPolicyscreen.setState({timeout: 0})
        });

        when('I navigate to the PrivacyPolicy', () => {
             instance = PrivacyPolicyscreen.instance() as PrivacyPolicy
             instance.componentDidMount();
             instance.getPrivacyPolicyContent();
             const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
             tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
             runEngine.sendMessage("Unit Test", tokenMsg);
           
        });

        then('PrivacyPolicy will load with out errors', () => {
            let background = PrivacyPolicyscreen.findWhere((node) => node.prop('testID') === 'Background');
            background.simulate('press')
            expect(PrivacyPolicyscreen).toBeTruthy();

        });
       
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(PrivacyPolicyscreen).toBeTruthy()
        });
    });
    
});
