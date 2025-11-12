import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import Videos from "../../src/Videos"
const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "Videos"
  }

const feature = loadFeature('./__tests__/features/Videos-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to Videos', ({ given, when, then }) => {
        let videoBlock:ShallowWrapper;
        let instance:Videos; 

        given('I am a User loading Videos', () => {
            videoBlock = shallow(<Videos {...screenProps}/>)
        });

        when('I navigate to the Videos', () => {
             instance = videoBlock.instance() as Videos
        });

        then('Videos will load with out errors', () => {
            expect(videoBlock).toBeTruthy()
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(videoBlock).toBeTruthy()
        });
    });


});
