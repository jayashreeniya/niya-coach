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
import TermsAndCondition from "../../src/TermsAndCondition"
import { Platform } from "react-native";
const navigation = require("react-navigation")

const screenProps = {
    navigation: {navigate: jest.fn(),
    goBack:jest.fn()
    },
    id: "TermsAndCondition"
  }

const feature = loadFeature('./__tests__/features/TermsAndCondition-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to TermsAndCondition', ({ given, when, then }) => {
        let TermsAndConditionscreen:ShallowWrapper;
        let instance:TermsAndCondition; 

        given('I am a User loading TermsAndCondition', () => {
            TermsAndConditionscreen = shallow(<TermsAndCondition {...screenProps}/>)
            // TermsAndConditionscreen.setState({timeout: 0})
        });

        when('I navigate to the TermsAndCondition', () => {
             instance = TermsAndConditionscreen.instance() as TermsAndCondition
             instance.componentDidMount();
            const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
             tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
             runEngine.sendMessage("Unit Test", tokenMsg);
           
        });

        then('TermsAndCondition will load with out errors', () => {
            jest.doMock('react-native', () => ({ Platform: { OS: 'android' }}))
            jest.spyOn(helpers, 'getOS').mockImplementation(() => 'android');
            let header = TermsAndConditionscreen.findWhere((node) => node.prop('testID') === 'header');
            let scrollView = TermsAndConditionscreen.findWhere((node) => node.prop('testID') === 'tncScrollView');
            scrollView.simulate('press')
            let backButton = TermsAndConditionscreen.findWhere((node) => node.prop('testID') === 'tncBackButton');
            backButton.simulate('press')
            let background = TermsAndConditionscreen.findWhere((node) => node.prop('testID') === 'Background');
            background.simulate('press')
            console.log('Platform#',Platform.OS)
            expect(TermsAndConditionscreen).toBeTruthy();
        });
        then('TermsAndCondition will load with out errors for IOS', () => {
            jest.doMock('react-native', () => ({ Platform: { OS: 'ios' }}))
            jest.spyOn(helpers, 'getOS').mockImplementation(() => 'ios');

            let header = TermsAndConditionscreen.findWhere((node) => node.prop('testID') === 'header');
            let scrollView = TermsAndConditionscreen.findWhere((node) => node.prop('testID') === 'tncScrollView');
            scrollView.simulate('press')
            let backButton = TermsAndConditionscreen.findWhere((node) => node.prop('testID') === 'tncBackButton');
            backButton.simulate('press')
            let background = TermsAndConditionscreen.findWhere((node) => node.prop('testID') === 'Background');
            background.simulate('press')
            expect(header.props().style.marginTop).toBe(40);
        });
    
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(TermsAndConditionscreen).toBeTruthy()
        });
    });
    
});
