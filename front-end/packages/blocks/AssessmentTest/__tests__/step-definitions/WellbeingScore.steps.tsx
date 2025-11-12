// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import WellbeingScore from "../../src/WellbeingScore"

const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn()
       
    },
    id: "WellbeingScore"
  }
const qtnData= {
    "data": {
        "id": "188",
        "type": "get_result",
        "attributes": {
            "user_result": {
                "final_score": 3,
                "question_count": 47,
                "percentage": 6
            },
            "results": [
                {
                    "category_result": {
                        "category_name": "Physical Wellbeing",
                        "score": 55,
                        "question_count": 23,
                        "percentage": 23,
                        "advice": "NO significant risk in general health & wellbeing in current scenario.",
                        "submitted_at": "2022-11-14",
                        "score_level": "high"
                    },
                    "sub_category_result": [
                        {
                            "sub_category": "Physical Wellbeing",
                            "score": 20,
                            "question_count": 11,
                            "percentage": 23
                        },
                        {
                            "sub_category": "Nutrition",
                            "score": 6,
                            "question_count": 2,
                            "percentage": 30,
                            "advice": "You need to work on building good eating habits.",
                            "score_level": "medium"
                        },
                        {
                            "sub_category": "Recharge",
                            "score": 9,
                            "question_count": 3,
                            "percentage": 30,
                            "advice": "No risk of exhaustion but you can do better.",
                            "score_level": "medium"
                        },
                        {
                            "sub_category": "Movement",
                            "score": 6,
                            "question_count": 2,
                            "percentage": 30,
                            "advice": "Moderate activity/movement.",
                            "score_level": "medium"
                        },
                        {
                            "sub_category": "Sleep",
                            "score": 9,
                            "question_count": 2,
                            "percentage": 45,
                            "advice": "You sleep well.",
                            "score_level": "high"
                        },
                        {
                            "sub_category": "Substance Use",
                            "score": 5,
                            "question_count": 3,
                            "percentage": 16,
                            "advice": "Medium risk",
                            "score_level": "medium"
                        }
                    ]
                },
                {
                    "category_result": {
                        "category_name": "Emotional Wellbeing",
                        "score": 70,
                        "question_count": 18,
                        "percentage": 38,
                        "advice": "High Psychological Well Being",
                        "submitted_at": "2022-11-14",
                        "score_level": "high"
                    },
                    "sub_category_result": [
                        {},
                        {
                            "sub_category": "Autonomy",
                            "score": 7,
                            "question_count": 3,
                            "percentage": 23,
                            "advice": "Low Score",
                            "score_level": "low"
                        },
                        {
                            "sub_category": "Personal Growth",
                            "score": 14,
                            "question_count": 3,
                            "percentage": 46,
                            "advice": "High Score",
                            "score_level": "high"
                        },
                        {
                            "sub_category": "Environmental mastery",
                            "score": 14,
                            "question_count": 3,
                            "percentage": 46,
                            "advice": "High Score",
                            "score_level": "high"
                        },
                        {
                            "sub_category": "Positive Relations",
                            "score": 10,
                            "question_count": 3,
                            "percentage": 33,
                            "advice": "low score",
                            "score_level": "low"
                        },
                        {
                            "sub_category": "Purpose in life",
                            "score": 11,
                            "question_count": 3,
                            "percentage": 36,
                            "advice": "High Score",
                            "score_level": "high"
                        },
                        {
                            "sub_category": "Self-acceptance",
                            "score": 14,
                            "question_count": 3,
                            "percentage": 46,
                            "advice": "High Score",
                            "score_level": "high"
                        }
                    ]
                },
                {
                    "category_result": {
                        "category_name": "Occupational Wellbeing",
                        "score": 3,
                        "question_count": 1,
                        "percentage": 30,
                        "advice": "low Exhaustion",
                        "submitted_at": "2022-11-14",
                        "score_level": "low"
                    },
                    "sub_category_result": [
                        {},
                        {
                            "sub_category": "Exhaustion",
                            "score": 0,
                            "question_count": 0,
                            "percentage": null,
                            "advice": "low Exhaustion",
                            "score_level": "low"
                        },
                        {
                            "sub_category": "Cynicism",
                            "score": 0,
                            "question_count": 0,
                            "percentage": null,
                            "advice": "low Cynisim",
                            "score_level": "low"
                        },
                        {
                            "sub_category": "Professional Efficacy",
                            "score": 3,
                            "question_count": 1,
                            "percentage": 30,
                            "advice": "Low professional Efficacy",
                            "score_level": "low"
                        },
                        {
                            "sub_category": "Workload",
                            "score": 0,
                            "question_count": 0,
                            "percentage": null,
                            "advice": "High workload, low work-life balance",
                            "score_level": "low"
                        },
                        {
                            "sub_category": "Control",
                            "score": 0,
                            "question_count": 0,
                            "percentage": null,
                            "advice": "low control at work",
                            "score_level": "low"
                        },
                        {
                            "sub_category": "Reward",
                            "score": 0,
                            "question_count": 0,
                            "percentage": null,
                            "advice": "low appreciation and recognition at work",
                            "score_level": "low"
                        },
                        {
                            "sub_category": "Community",
                            "score": 0,
                            "question_count": 0,
                            "percentage": null,
                            "advice": "Lack of community, connection and supportive work groups",
                            "score_level": "low"
                        },
                        {
                            "sub_category": "Fairness",
                            "score": 0,
                            "question_count": 0,
                            "percentage": null,
                            "advice": "Lack of fairness and equitability ",
                            "score_level": "low"
                        },
                        {
                            "sub_category": "Values",
                            "score": 0,
                            "question_count": 0,
                            "percentage": null,
                            "advice": "mismatch between organisational and personal values",
                            "score_level": "low"
                        }
                    ]
                },
                {
                    "category_result": {
                        "category_name": "Financial Wellbeing",
                        "score": 17,
                        "question_count": 5,
                        "percentage": 34,
                        "advice": "No significant stress around Money",
                        "submitted_at": "2022-11-24",
                        "score_level": "high"
                    },
                    "sub_category_result": [
                        {
                            "sub_category": "Financial Wellbeing",
                            "score": 17,
                            "question_count": 5,
                            "percentage": 34
                        }
                    ]
                }
            ]
        }
    }
}
const feature = loadFeature('./__tests__/features/WellbeingScore-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to WellbeingScore', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:WellbeingScore; 
      

        given('I am a User loading WellbeingScore', () => {
            exampleBlockA = shallow(<WellbeingScore {...screenProps}/>);
            expect(exampleBlockA).toBeTruthy()
            instance = exampleBlockA.instance() as WellbeingScore
    
        });

        when('I navigate to the WellbeingScore', () => {
             instance = exampleBlockA.instance() as WellbeingScore
             instance.componentDidMount();
             instance.getScores();
             
        });

        then('WellbeingScore will load with out errors', () => {
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
              instance.getScoresApiCallId = msg.messageId
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
              instance.getScoresApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        then('I can select Answer choice with out error',()=>{
            let catname=qtnData?.data?.attributes?.results?.category_result?.category_name;
          instance.setState({questionResponse: qtnData?.data?.attributes?.results});
          instance.getList({index:0, item: qtnData?.data?.attributes?.results[0]});
          instance.getScoreBackgroundclr("high");
          instance.getScoreBackgroundclr("medium");
          instance.getScoreTextclr("high");
          instance.getScoreTextclr("medium");
          instance.getSubCatContent(qtnData?.data?.attributes?.results[0].sub_category_result[0],0,catname);
          instance.setState({isFrom:"drawer"});
          instance.backWellbeingNavigation();
        });
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
