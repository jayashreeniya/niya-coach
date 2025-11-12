// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import WellbeingCategories from "../../src/WellbeingCategories"

const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn()
       
    },
    id: "WellbeingCategories"
  }
const qtnData= [
    {
        "id": 1,
        "category_name": "Physical Wellbeing",
        "created_at": "2022-10-31T04:34:16.314Z",
        "updated_at": "2022-10-31T04:34:16.314Z"
    },
    {
        "id": 2,
        "category_name": "Emotional Wellbeing",
        "created_at": "2022-10-31T04:34:49.406Z",
        "updated_at": "2022-10-31T04:34:49.406Z"
    },
    {
        "id": 3,
        "category_name": "Occupational Wellbeing",
        "created_at": "2022-11-02T05:27:02.421Z",
        "updated_at": "2022-11-02T05:27:02.421Z"
    },
    {
        "id": 4,
        "category_name": "Financial Wellbeing",
        "created_at": "2022-11-02T05:27:30.612Z",
        "updated_at": "2022-11-02T05:27:30.612Z"
    }
]
const feature = loadFeature('./__tests__/features/WellbeingCategories-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to WellbeingCategories', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:WellbeingCategories; 
      

        given('I am a User loading WellbeingCategories', () => {
            exampleBlockA = shallow(<WellbeingCategories {...screenProps}/>);
            expect(exampleBlockA).toBeTruthy()
            instance = exampleBlockA.instance() as WellbeingCategories
    
        });

        when('I navigate to the WellbeingCategories', () => {
             instance = exampleBlockA.instance() as WellbeingCategories
             instance.componentDidMount();
             instance.getCategories();
             instance.setState({name:'Sonali'});
        });

        then('WellbeingCategories will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.setState({qtnIndex:1 ,loading: false ,selectedCatId:1,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });
            let btnTouchableKeyboardhide = exampleBlockA.findWhere((node) => node.prop('testID') === 'touchableKeyboard');
            btnTouchableKeyboardhide.simulate('press');

        });
        then('Network response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                qtnData
              )
              instance.getCategoriesApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        then('Network error response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceErrorMessage),
                "Something went wrong. Please try again"
              )
              instance.getQuestionsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        then('Network responseJson message error response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {message:"Something went wrong. Please try again"}
              )
              instance.getQuestionsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        then('I can select Answer choice with out error',()=>{
          instance.setState({categories: qtnData});
          instance.renderAnswerOptions(qtnData)
            let btnAnsChoice = exampleBlockA.findWhere((node) => node.prop('testID') === 'ansChoice0');
            btnAnsChoice.simulate('press');
            let btnNext = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnNext');
            btnNext.simulate('press');
           
        });
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
