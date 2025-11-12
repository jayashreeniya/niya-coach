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
import Splashscreen from "../../src/Splashscreen"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {navigate: jest.fn()},
    id: "Splashscreen"
  }

const feature = loadFeature('./__tests__/features/splashscreen-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to Splashscreen', ({ given, when, then }) => {
        let splashscreen:ShallowWrapper;
        let instance:Splashscreen; 

        given('I am a User loading Splashscreen', () => {
            splashscreen = shallow(<Splashscreen {...screenProps}/>)
            splashscreen.setState({timeout: 0})
        });

        when('I navigate to the Splashscreen', () => {
             instance = splashscreen.instance() as Splashscreen
             instance.componentDidMount();
             instance.getToken();
             const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
             tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
             runEngine.sendMessage("Unit Test", tokenMsg);
           
        });

        then('Splashscreen will load with out errors', () => {
            expect(Splashscreen).toBeTruthy();

        });
        then("I can click the Button", () => {
            instance.goToLogIn();
        });
    

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(Splashscreen).toBeTruthy()
        });
    });
    
});
