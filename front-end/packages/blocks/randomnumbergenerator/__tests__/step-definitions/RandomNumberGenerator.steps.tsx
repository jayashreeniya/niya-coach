import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import RandomNumberGenerator from "../../src/RandomNumberGenerator"
const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "RandomNumberGenerator"
  }

const feature = loadFeature('./__tests__/features/RandomNumberGenerator-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to RandomNumberGenerator', ({ given, when, then }) => {
        let randomNumberGenerator:ShallowWrapper;
        let instance:RandomNumberGenerator; 

        given('I am a User loading RandomNumberGenerator', () => {
            randomNumberGenerator = shallow(<RandomNumberGenerator {...screenProps}/>);
        });

        when('I navigate to the RandomNumberGenerator', () => {
             instance = randomNumberGenerator.instance() as RandomNumberGenerator
        });

        then('RandomNumberGenerator will load with out errors', () => {
            expect(randomNumberGenerator).toBeTruthy();
        });

        then('I can enter valid upper and lowerbounds with out errors', () => {
            let textInputComponent = randomNumberGenerator.findWhere((node) => node.prop('testID') === 'lowerbound');
            textInputComponent.simulate('changeText', '5');
            textInputComponent = randomNumberGenerator.findWhere((node) => node.prop('testID') === 'upperbound');
            textInputComponent.simulate('changeText', '7');
        });

        then('I can select the button with with out errors', () => {
            let buttonComponent = randomNumberGenerator.findWhere((node) => node.prop('testID') === 'btnGenerateRandomNumber');
            buttonComponent.simulate('press');
            expect(randomNumberGenerator).toBeTruthy();
        });

        then('I can enter invalid upper and lowerbounds with out errors', () => {
            let textInputComponent = randomNumberGenerator.findWhere((node) => node.prop('testID') === 'lowerbound');
            textInputComponent.simulate('changeText', '7');
            textInputComponent = randomNumberGenerator.findWhere((node) => node.prop('testID') === 'upperbound');
            textInputComponent.simulate('changeText', '1');
        });

        then('I can select the button with with out errors', () => {
            let buttonComponent = randomNumberGenerator.findWhere((node) => node.prop('testID') === 'btnGenerateRandomNumber');
            buttonComponent.simulate('press');
            expect(randomNumberGenerator).toBeTruthy();
        });
        
        then('I can leave the screen with out errors', () => {
            let buttonComponent = randomNumberGenerator.findWhere((node) => node.prop('testID') === 'background');
            buttonComponent.simulate('press');
            instance.componentWillUnmount()
            expect(randomNumberGenerator).toBeTruthy();
        });
    });


});
