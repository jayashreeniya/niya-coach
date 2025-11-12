// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";


import EmoJourney from "../../src/EmoJourney"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn()
       
    },
    id: "EmoJourney"
  }
  jest.useFakeTimers();
  
  const journeyData={"status":[{"date":{"motion_select_date":"2022-12-30"}},{"date":{"motion_select_date":"2022-12-29"}},{"date":{"motion_select_date":"2022-12-28"}},{"date":{"motion_select_date":"2022-12-27"}},{"date":{"motion_select_date":"2022-12-26"}},{"date":{"motion_select_date":"2022-12-25"}},{"date":{"motion_select_date":"2022-12-24"}},{"date":{"id":266,"account_id":192,"motion_id":4,"created_at":"2022-12-23T06:21:00.565Z","updated_at":"2022-12-23T06:21:00.565Z","select_date":"12","motion_select_date":"2022-12-23T06:21:00.560Z"}},{"date":{"id":265,"account_id":192,"motion_id":4,"created_at":"2022-12-22T05:06:17.976Z","updated_at":"2022-12-22T06:26:29.753Z","select_date":"12","motion_select_date":"2022-12-22T05:06:17.974Z"}},{"date":{"motion_select_date":"2022-12-21"}},{"date":{"id":264,"account_id":192,"motion_id":4,"created_at":"2022-12-20T10:21:44.776Z","updated_at":"2022-12-20T10:21:44.776Z","select_date":"12","motion_select_date":"2022-12-20T10:21:44.772Z"}},{"date":{"id":263,"account_id":192,"motion_id":4,"created_at":"2022-12-19T12:51:44.817Z","updated_at":"2022-12-19T12:51:44.817Z","select_date":"12","motion_select_date":"2022-12-19T12:51:44.813Z"}},{"date":{"motion_select_date":"2022-12-18"}},{"date":{"motion_select_date":"2022-12-17"}},{"date":{"motion_select_date":"2022-12-16"}},{"date":{"motion_select_date":"2022-12-15"}},{"date":{"id":259,"account_id":192,"motion_id":3,"created_at":"2022-12-14T06:16:11.082Z","updated_at":"2022-12-14T06:20:36.674Z","select_date":"12","motion_select_date":"2022-12-14T06:16:11.063Z"}},{"date":{"id":257,"account_id":192,"motion_id":4,"created_at":"2022-12-13T11:30:07.329Z","updated_at":"2022-12-13T11:50:30.552Z","select_date":"12","motion_select_date":"2022-12-13T11:30:07.324Z"}},{"date":{"motion_select_date":"2022-12-12"}},{"date":{"motion_select_date":"2022-12-11"}},{"date":{"motion_select_date":"2022-12-10"}},{"date":{"id":246,"account_id":192,"motion_id":4,"created_at":"2022-12-09T07:03:15.941Z","updated_at":"2022-12-09T07:03:15.941Z","select_date":"12","motion_select_date":"2022-12-09T07:03:15.925Z"}},{"date":{"motion_select_date":"2022-12-08"}},{"date":{"motion_select_date":"2022-12-07"}},{"date":{"id":235,"account_id":192,"motion_id":4,"created_at":"2022-12-06T09:51:21.133Z","updated_at":"2022-12-06T09:51:21.133Z","select_date":"12","motion_select_date":"2022-12-06T09:51:21.129Z"}},{"date":{"motion_select_date":"2022-12-05"}},{"date":{"motion_select_date":"2022-12-04"}},{"date":{"motion_select_date":"2022-12-03"}},{"date":{"motion_select_date":"2022-12-02"}},{"date":{"motion_select_date":"2022-12-01"}}]}

const feature = loadFeature('./__tests__/features/EmoJourney-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.spyOn(runEngine, "sendMessage");        
    });

    test('User navigates to EmoJourney', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:EmoJourney; 

        given('I am a User loading EmoJourney', () => {
            exampleBlockA = shallow(<EmoJourney {...screenProps}/>);
        });

        when('I navigate to the EmoJourney', () => {
             instance = exampleBlockA.instance() as EmoJourney
             instance.setState({motionId:1,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });
             instance.componentDidMount();
             instance.getToken();
             instance.getJourneyData();
                          
        });        

        then('EmoJourney will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            let btnHome = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnHome');
            btnHome.simulate('press');
            instance.getColor(1);
            instance.getColor(2);
            instance.getColor(3);
            instance.getColor(4);
            instance.getColor(5);
            instance.getColor();

        });

        then("Response token from the session", () => {
            const tokenMsg = new Message(
              getName(MessageEnum.SessionResponseMessage)
            );
      
            tokenMsg.addData(
              getName(MessageEnum.SessionResponseToken),
              "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"
            )
      
            runEngine.sendMessage('From unut test', tokenMsg);
          })

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
                journeyData
              )
              instance.getJourneyApiCallId = msg.messageId
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
              instance.getJourneyApiCallId = msg.messageId
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
              instance.getJourneyApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        
        then('I can see journal rendered',()=>{
            instance.renderJournal({ index:0, item: journeyData?.status[0]});
        })

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
