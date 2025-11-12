// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";


import EmoJourney1 from "../../src/EmoJourney1"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn()
       
    },
    id: "EmoJourney1"
  }
  jest.useFakeTimers();
  const ansBodyFirstQtn={
    "data": {
        "id": "713",
        "type": "choose_motion_answer",
        "attributes": {
            "account_id": 13,
            "question": 1,
            "answer": 2
        }
    },
    "meta": {
        "game_choosen": {
            "id": 511,
            "selected_answer": "Loved",
            "account_id": 13,
            "game_choosen": "PUZZLE",
            "created_at": "2022-12-29T04:48:26.531Z",
            "updated_at": "2022-12-29T04:48:26.531Z"
        }
    }
}
  const selectMotionRes={
    "data": {
        "id": "268",
        "type": "select_motion",
        "attributes": {
            "select_date": "2022-12-28T12:06:19.497Z",
            "motion": {
                "id": 1,
                "motion_title": "great",
                "created_at": "2022-09-23T12:56:52.740Z",
                "updated_at": "2022-09-23T12:56:52.740Z"
            },
            "account": {
                "id": 1,
                "first_name": "raj",
                "last_name": "yadav",
                "full_phone_number": "7898123456",
                "country_code": null,
                "phone_number": 7898123456,
                "email": "raj@gamil.com",
                "activated": true,
                "device_id": null,
                "unique_auth_id": "Ar0NTzVVbGRA6EpMEfWwoQtt",
                "created_at": "2022-06-21T05:06:13.102Z",
                "updated_at": "2022-09-23T07:42:10.557Z",
                "user_name": null,
                "platform": null,
                "user_type": null,
                "app_language_id": null,
                "last_visit_at": null,
                "is_blacklisted": false,
                "suspend_until": null,
                "status": "regular",
                "stripe_id": null,
                "stripe_subscription_id": null,
                "stripe_subscription_date": null,
                "role_id": null,
                "full_name": "raj yadav",
                "gender": "Trans-gender",
                "date_of_birth": null,
                "age": null,
                "is_paid": false,
                "access_code": "12345",
                "rating": null,
                "city": null,
                "expertise": [],
                "education": null
            },
            "motion_question_answer": [
                {
                    "question_1": {
                        "id": 1,
                        "emo_question": "Hey that’s nice, tell us more - what emotions you are experiencing ?",
                        "motion_id": 1,
                        "created_at": "2022-09-26T07:37:28.685Z",
                        "updated_at": "2022-10-18T09:55:05.359Z"
                    },
                    "answers": [
                        {
                            "id": 1,
                            "emo_answer": "Calm",
                            "motion_question_id": 1,
                            "created_at": "2022-09-26T07:37:28.689Z",
                            "updated_at": "2022-09-26T07:37:28.689Z"
                        },
                        {
                            "id": 2,
                            "emo_answer": "Loved",
                            "motion_question_id": 1,
                            "created_at": "2022-09-26T07:37:28.693Z",
                            "updated_at": "2022-09-26T07:37:28.693Z"
                        },
                        {
                            "id": 3,
                            "emo_answer": "Confident",
                            "motion_question_id": 1,
                            "created_at": "2022-09-26T07:37:28.695Z",
                            "updated_at": "2022-09-26T07:37:28.695Z"
                        },
                        {
                            "id": 4,
                            "emo_answer": "Appreciated",
                            "motion_question_id": 1,
                            "created_at": "2022-09-26T07:37:28.697Z",
                            "updated_at": "2022-09-26T07:37:28.697Z"
                        },
                        {
                            "id": 5,
                            "emo_answer": "Thankful",
                            "motion_question_id": 1,
                            "created_at": "2022-09-26T07:37:28.699Z",
                            "updated_at": "2022-09-26T07:37:28.699Z"
                        },
                        {
                            "id": 6,
                            "emo_answer": "Joyful",
                            "motion_question_id": 1,
                            "created_at": "2022-09-26T07:37:28.701Z",
                            "updated_at": "2022-09-26T07:37:28.701Z"
                        },
                        {
                            "id": 7,
                            "emo_answer": "Energetic",
                            "motion_question_id": 1,
                            "created_at": "2022-09-26T07:37:28.703Z",
                            "updated_at": "2022-09-26T07:37:28.703Z"
                        },
                        {
                            "id": 8,
                            "emo_answer": "Generous",
                            "motion_question_id": 1,
                            "created_at": "2022-09-26T07:37:28.705Z",
                            "updated_at": "2022-09-26T07:37:28.705Z"
                        },
                        {
                            "id": 9,
                            "emo_answer": "Content",
                            "motion_question_id": 1,
                            "created_at": "2022-09-26T07:37:28.706Z",
                            "updated_at": "2022-09-26T07:37:28.706Z"
                        },
                        {
                            "id": 10,
                            "emo_answer": "Humility",
                            "motion_question_id": 1,
                            "created_at": "2022-09-26T07:37:28.709Z",
                            "updated_at": "2022-09-26T07:37:28.709Z"
                        },
                        {
                            "id": 11,
                            "emo_answer": "Inspired",
                            "motion_question_id": 1,
                            "created_at": "2022-09-26T07:37:28.711Z",
                            "updated_at": "2022-09-26T07:37:28.711Z"
                        }
                    ]
                },
                {
                    "question_2": {
                        "id": 2,
                        "emo_question": "Tell us more – what were you doing ? Where were you / with whom ?",
                        "motion_id": 1,
                        "created_at": "2022-09-26T07:39:32.809Z",
                        "updated_at": "2022-10-18T09:54:37.753Z"
                    },
                    "answers": [
                        {
                            "id": 12,
                            "emo_answer": "Working",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T07:39:32.812Z",
                            "updated_at": "2022-09-26T08:02:13.382Z"
                        },
                        {
                            "id": 13,
                            "emo_answer": "Sleeping",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T07:39:32.815Z",
                            "updated_at": "2022-09-26T08:02:13.383Z"
                        },
                        {
                            "id": 14,
                            "emo_answer": "Meditating",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T07:39:32.816Z",
                            "updated_at": "2022-09-26T08:02:13.384Z"
                        },
                        {
                            "id": 15,
                            "emo_answer": "Cleaning",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T07:39:32.818Z",
                            "updated_at": "2022-09-26T08:02:13.385Z"
                        },
                        {
                            "id": 16,
                            "emo_answer": "Travelling",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T07:39:32.819Z",
                            "updated_at": "2022-09-26T08:02:13.386Z"
                        },
                        {
                            "id": 17,
                            "emo_answer": "Reading",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T07:39:32.822Z",
                            "updated_at": "2022-09-26T08:02:13.387Z"
                        },
                        {
                            "id": 18,
                            "emo_answer": "Shopping",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T07:39:32.823Z",
                            "updated_at": "2022-09-26T08:02:13.388Z"
                        },
                        {
                            "id": 19,
                            "emo_answer": "Watching Movies",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T07:39:32.825Z",
                            "updated_at": "2022-09-26T08:02:13.388Z"
                        },
                        {
                            "id": 20,
                            "emo_answer": "Social Media",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T07:39:32.827Z",
                            "updated_at": "2022-09-26T08:02:13.389Z"
                        },
                        {
                            "id": 21,
                            "emo_answer": "Exercising",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T07:39:32.829Z",
                            "updated_at": "2022-09-26T08:02:13.390Z"
                        },
                        {
                            "id": 22,
                            "emo_answer": "Family",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T07:39:32.831Z",
                            "updated_at": "2022-09-26T08:02:13.391Z"
                        },
                        {
                            "id": 23,
                            "emo_answer": "Friends",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T08:02:13.392Z",
                            "updated_at": "2022-09-26T08:02:13.392Z"
                        },
                        {
                            "id": 24,
                            "emo_answer": "Colleagues",
                            "motion_question_id": 2,
                            "created_at": "2022-09-26T08:02:13.393Z",
                            "updated_at": "2022-09-26T08:02:13.393Z"
                        }
                    ]
                }
            ]
        }
    }
}

const feature = loadFeature('./__tests__/features/EmoJourney1-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.spyOn(runEngine, "sendMessage");        
    });

    test('User navigates to EmoJourney1', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:EmoJourney1; 

        given('I am a User loading EmoJourney1', () => {
            exampleBlockA = shallow(<EmoJourney1 {...screenProps}/>);
        });

        when('I navigate to the EmoJourney1', () => {
             instance = exampleBlockA.instance() as EmoJourney1
             instance.setState({motionId:1,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });
             instance.getQuestions({"motion":1});
             instance.getMoods();
                          
             instance.handleErrors("re");
        });

        then('EmoJourney1 will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            console.log("QtnRes>>",instance.state.questionResponse);
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
                selectMotionRes
              )
              instance.getQuestionsApiCallId = msg.messageId
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
              instance.getMoodsApiCallId = msg.messageId
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
              instance.getMoodsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
            //   post commetn
            const msgpostcmt = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msgpostcmt.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgpostcmt.messageId
              )
        
              msgpostcmt.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {data:""}
              )
              instance.postCommentApiCallId = msgpostcmt.messageId
              runEngine.sendMessage('From unit test', msgpostcmt);
        });

        then('I can select answer choice and go next with out errors',()=>{
            console.log('data>>',instance.state.questionResponse);
            instance.handleGetMoodsSuccess("");
            instance.letsBeginPressProps.onPress();
            
            let btnAnsChoice = exampleBlockA.findWhere((node) => node.prop('testID') === 'ansChoice0');
            btnAnsChoice.simulate('press');

            let btnNext = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnNext');
            btnNext.simulate('press');   
            
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {message:"Games started"}
              )
              instance.getStartGamesApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
            
        });

        then('Answer submit response for post requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                ansBodyFirstQtn
              )
              instance.ansFirstQuestionApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg)
        });
        
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
