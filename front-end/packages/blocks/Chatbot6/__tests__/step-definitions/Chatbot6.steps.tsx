// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import Chatbot6 from "../../src/Chatbot6"
const navigation = require("react-navigation")
import {Alert} from 'react-native'
const screenProps = {
    navigation: {  
        navigate:jest.fn(),
        goBack:jest.fn(),},
    id: "Chatbot6"
  }

const feature = loadFeature('./__tests__/features/Chatbot6-scenario.feature');


jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn((key) => {
      if (key === "nameEdited") {
        return "true"
      }
    }),
    setItem: jest.fn(() => null)
  }));

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons, options) => {
            const onPress = buttons && buttons.length > 0 && buttons[0].onPress;
            onPress && onPress();
            return Promise.resolve();
          });
    });
    test('User will see the saved name', ({ given, when, then }) => {
      let exampleBlockA:ShallowWrapper;
      let instance:Chatbot6;
      given("Is rendered without error",()=>{
        exampleBlockA = shallow(<Chatbot6 {...screenProps}/>);

      }) 
      when("It calls the api",()=>{
        instance = exampleBlockA.instance() as Chatbot6


        const getProfileNameMEssage: Message = new Message(
          getName(MessageEnum.RestAPIResponceMessage)
        );
        getProfileNameMEssage.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          { data:{attributes:{
            profile_name:"test"
          }} }
        );
        getProfileNameMEssage.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          getProfileNameMEssage.messageId
        );
        instance.getuserProfileDetailsCallId = getProfileNameMEssage.messageId;
        runEngine.sendMessage("Unit Test", getProfileNameMEssage);

      }) 
      then("User will see the name already",async()=>{


        expect(AsyncStorage.getItem).toHaveBeenCalledWith("nameEdited")
        expect(exampleBlockA.state().reply).toBe("test")
        expect(exampleBlockA.state().isSend).toBe(true)

      }) 


    })

    test('User will see the saved profile name', ({ given, when, then }) => {
      let exampleBlockA:ShallowWrapper;
      let instance:Chatbot6;
      given("Is rendered without error",()=>{
        exampleBlockA = shallow(<Chatbot6 {...screenProps}/>);

      }) 
      when("It calls the api",()=>{
        instance = exampleBlockA.instance() as Chatbot6


        const getProfileNameMEssage: Message = new Message(
          getName(MessageEnum.RestAPIResponceMessage)
        );
        getProfileNameMEssage.addData(
          getName(MessageEnum.RestAPIResponceSuccessMessage),
          { data:{attributes:{
            full_name:"test"
          }} }
        );
        getProfileNameMEssage.addData(
          getName(MessageEnum.RestAPIResponceDataMessage),
          getProfileNameMEssage.messageId
        );
        instance.getuserProfileDetailsCallId = getProfileNameMEssage.messageId;
        runEngine.sendMessage("Unit Test", getProfileNameMEssage);


      }) 
      then("User will see the profile name already",async()=>{


        expect(AsyncStorage.getItem).toHaveBeenCalledWith("nameEdited")
        expect(exampleBlockA.state().reply).toBe("test")
        expect(exampleBlockA.state().isSend).toBe(true)
        expect(instance.state.reply)

      }) 


    })

    test('User navigates to Chatbot6', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:Chatbot6; 

        given('I am a User loading Chatbot6', () => {
            exampleBlockA = shallow(<Chatbot6 {...screenProps}/>);
        });

        when('I navigate to the Chatbot6', () => {
             instance = exampleBlockA.instance() as Chatbot6
        });

        then('Chatbot6 will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.setInputValue("sokds");
            instance.setEnableField(false);
            instance.closeReply();
            instance.renderSend("Sdf");
            instance.renderBubble("d")
            instance.btnExampleProps.onPress();
            instance.letsBeginPressProps.onPress();
            instance.sendbtnPressProps.onPress();
            instance.btnShowHideProps.onPress();
            instance.txtInputWebProps.onChangeText('txt');
            const msgsessionResAPI = new Message(getName(MessageEnum.AccoutLoginSuccess))
            msgsessionResAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA");
            runEngine.sendMessage("Unit Test", msgsessionResAPI) 

        });

        then('I can enter text with out errors', () => {
            instance.setState({isSend:false})
            let textInputComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInput');

             textInputComponent.simulate('changeText', 'sonali');
            let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'Background');
            // buttonComponent.simulate('press')
            let buttoniconBtnComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'send_iconBtn');
            buttoniconBtnComponent.simulate('press')
        });

        then('I can select the button with with out errors', () => {
            console.log(instance.state.reply,"reply");
            if(instance.state.isSend){
                let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnSend');
                buttonComponent.simulate('press');
                expect(instance.state.reply)
                expect(instance.props.navigation.navigate).toHaveBeenCalled()
         
            }
         
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
            expect(AsyncStorage.setItem).toHaveBeenCalled()
        });
    });


});
