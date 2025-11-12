// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import Weareglad from "../../src/Weareglad"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn()
       
    },
    id: "Weareglad"
  }

const feature = loadFeature('./__tests__/features/Weareglad-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to Weareglad', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:Weareglad; 

        given('I am a User loading Weareglad', () => {
            exampleBlockA = shallow(<Weareglad {...screenProps}/>);
        });

        when('I navigate to the Weareglad', () => {
             instance = exampleBlockA.instance() as Weareglad
        });

        then('Weareglad will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            const msgWeareglad = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            msgWeareglad.addData(getName(MessageEnum.InfoPageTitleMessage), "Weareglad");
            msgWeareglad.addData(getName(MessageEnum.InfoPageBodyMessage), 
            "Test Body message");
            msgWeareglad.addData(getName(MessageEnum.InfoPageButtonTextMessage), 
            "Sample Text Message");
            msgWeareglad.addData(getName(MessageEnum.InfoPageNavigationScreenMessage), 
            "Sample button Message");
            runEngine.sendMessage("Unit Test", msgWeareglad)

            let btnTouchableKeyboardhide = exampleBlockA.findWhere((node) => node.prop('testID') === 'touchableKeyboard');
            btnTouchableKeyboardhide.simulate('press');
        });
        then('I can navigate to home without errors',()=>{
            let btnBackPress = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnBack');
            btnBackPress.simulate('press');
            
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
