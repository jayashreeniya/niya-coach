// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import AssessmentTest from "../../src/AssessmentTest"

const navigation = require("react-navigation")

const screenProps = {
    navigation: navigation,
    id: "AssessmentTest",
    children: "ReactNode"
  }

const feature = loadFeature('./__tests__/features/AssessmentTest-scenario.feature');
jest.useFakeTimers();
defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.runAllTimers();
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to AssessmentTest', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:AssessmentTest; 
      

        given('I am a User loading AssessmentTest', () => {
            exampleBlockA = shallow(<AssessmentTest {...screenProps}/>);
            expect(exampleBlockA).toBeTruthy()
            instance = exampleBlockA.instance() as AssessmentTest
            instance.btnShowHideProps.onPress();
            instance.doButtonPressed();
            instance.setEnableField();
            instance.nxtPressProps.onPress();
            // instance.letsBeginPressProps();
            const msgPlayloadAPI = new Message(getName(MessageEnum.AccoutLoginSuccess))
            msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "USER-TOKEN");
            runEngine.sendMessage("Unit Test", msgPlayloadAPI)  

            const msgsessionresAPI = new Message(getName(MessageEnum.SessionResponseMessage))
            msgsessionresAPI.addData(getName(MessageEnum.SessionResponseMessage), "USER-TOKEN");
            runEngine.sendMessage("Unit Test", msgsessionresAPI)  
            instance.getAssessYourselfTestQues();
            const msggetAssessTestQuestionsList = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceDataMessage), msggetAssessTestQuestionsList.messageId);
            msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
               
                    "data": [
                        {
                            "id": "74",
                            "type": "assess_yourself_question",
                            "attributes": {
                                "question_title": "Which test do you want to take?",
                                "answers": [
                                    {
                                        "id": 352,
                                        "created_at": "2022-12-05T05:21:04.878Z",
                                        "updated_at": "2022-12-05T05:21:04.878Z",
                                        "assess_yourself_question_id": 74,
                                        "answer_title": "Anxiety Test",
                                        "answer_score": null
                                    },
                                    {
                                        "id": 351,
                                        "created_at": "2022-12-05T05:21:04.877Z",
                                        "updated_at": "2022-12-05T05:21:04.877Z",
                                        "assess_yourself_question_id": 74,
                                        "answer_title": "Depression Test",
                                        "answer_score": null
                                    },
                                    {
                                        "id": 350,
                                        "created_at": "2022-12-05T05:21:04.877Z",
                                        "updated_at": "2022-12-05T05:21:04.877Z",
                                        "assess_yourself_question_id": 74,
                                        "answer_title": "Burnout Test",
                                        "answer_score": null
                                    },
                                    {
                                        "id": 349,
                                        "created_at": "2022-12-05T05:21:04.876Z",
                                        "updated_at": "2022-12-05T05:21:04.876Z",
                                        "assess_yourself_question_id": 74,
                                        "answer_title": "Stress Test",
                                        "answer_score": null
                                    },
                                    {
                                        "id": 348,
                                        "created_at": "2022-12-05T05:21:04.874Z",
                                        "updated_at": "2022-12-05T05:21:04.874Z",
                                        "assess_yourself_question_id": 74,
                                        "answer_title": "Anger Test",
                                        "answer_score": null
                                    }
                                ]
                            }
                        }
                    ]
                
            });
            instance.getAssessTestQuestionsListApiCallId = msggetAssessTestQuestionsList.messageId
            runEngine.sendMessage("Unit Test", msggetAssessTestQuestionsList)

            instance.showAlert("Err","Failed");
            instance.accessScoreHandApi( 
               
                {"score":
                 [{"anixety_title": "You have moderate anxiety",
                  "category_id": 352,
                   "color": "Orange", 
                   "created_at": "2022-12-06T12:17:19.157Z", 
                   "id": 27, "max_score": 14,
                    "min_score": 10,
                    "result": true, 
                    "total_score": 11, 
                    "updated_at": "2023-09-26T12:39:56.976Z"}]}
            
        );
        instance.accessScoreHandApi( 
               
            {"score":
             [{"anixety_title": "You have moderate anxiety",
              "category_id": 352,
               "color": "Red", 
               "created_at": "2022-12-06T12:17:19.157Z", 
               "id": 27,
                "max_score": 14,
                "min_score": 10,
                "result": true, 
                "total_score": 11, 
                "updated_at": "2023-09-26T12:39:56.976Z"}]}
        
         );
         instance.accessScoreHandApi( 
               
            {"score":
             [{"anixety_title": "You have moderate anxiety",
              "category_id": 352,
               "color": "Yellow", 
               "created_at": "2022-12-06T12:17:19.157Z", 
               "id": 27,
                "max_score": 14,
                "min_score": 10,
                "result": true, 
                "total_score": 11, 
                "updated_at": "2023-09-26T12:39:56.976Z"}]}
        
         );
         instance.accessScoreHandApi( 
               
            {"score":
             [{"anixety_title": "You have moderate anxiety",
              "category_id": 352,
               "color": "Green", 
               "created_at": "2022-12-06T12:17:19.157Z", 
               "id": 27,
                "max_score": 14,
                "min_score": 10,
                "result": true, 
                "total_score": 11, 
                "updated_at": "2023-09-26T12:39:56.976Z"}]}
        
         );
         instance.accessScoreHandApi( 
               
            {"score":
             [{"anixety_title": "You have moderate anxiety",
              "category_id": 352,
               "color": "Light-green", 
               "created_at": "2022-12-06T12:17:19.157Z", 
               "id": 27,
                "max_score": 14,
                "min_score": 10,
                "result": true, 
                "total_score": 11, 
                "updated_at": "2023-09-26T12:39:56.976Z"}]}
        
         );
         instance.accessScoreHandApi( 
               
            {"errors":"something went wrong"}
             
        
         );

            // err
            const msggetAssessTestQuestionsErr = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msggetAssessTestQuestionsErr.addData(getName(MessageEnum.RestAPIResponceDataMessage), msggetAssessTestQuestionsErr.messageId);
            msggetAssessTestQuestionsErr.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
               
                "errors": 
                {
                    "failed": "Failed"
                }
                
            });
            instance.getAssessTestQuestionsListApiCallId = msggetAssessTestQuestionsErr.messageId
            runEngine.sendMessage("Unit Test", msggetAssessTestQuestionsErr)
            //access score
            const msggetAssessTestQuestionsScoreErr = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msggetAssessTestQuestionsScoreErr.addData(getName(MessageEnum.RestAPIResponceDataMessage), msggetAssessTestQuestionsScoreErr.messageId);
            msggetAssessTestQuestionsScoreErr.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
               
                "errors": 
                {
                    "failed": "Failed"
                }
                
            });
            instance.getAssessScoreApiCallId = msggetAssessTestQuestionsScoreErr.messageId
            runEngine.sendMessage("Unit Test", msggetAssessTestQuestionsScoreErr)

            const msggetAssessTestQuestionsScoreErr1 = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msggetAssessTestQuestionsScoreErr1.addData(getName(MessageEnum.RestAPIResponceDataMessage), msggetAssessTestQuestionsScoreErr1.messageId);
            msggetAssessTestQuestionsScoreErr1.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
               
                "score": 
                [
                    {
                        "color": null
                    }
                ]
                
            });
            instance.getAssessScoreApiCallId = msggetAssessTestQuestionsScoreErr1.messageId
            runEngine.sendMessage("Unit Test", msggetAssessTestQuestionsScoreErr1)
        
            instance.parseApiErrorResponse("");
            instance.parseApiCatchErrorResponse("");
            instance.setState({assess_yourself_id:'121',token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q"});
            
            instance.renderHeightbasedonAnswerLenght("sampletext")
            instance.renderHeightbasedonAnswerLenght("sampletext present here forTestingFunc")
            instance.renderHeightbasedonAnswerLenght("sampletext present here for testingFunc")
            instance.renderHeightbasedonAnswerLenght("sampletext present here for testing Function used in the code")
            instance.renderHeightbasedonAnswerLenght("sampletext presented here in a conventional yet deliberate way so as to satisfy put condition. A part of the integration which is testing required to be done.")
        });

        when('I navigate to the AssessmentTest', () => {
             instance = exampleBlockA.instance() as AssessmentTest
        });

        then('AssessmentTest will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
       
        });

        then('I can select the options with out errors', () => {
            let btnOptComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'selectTypeOfTest0');
            btnOptComponent.simulate('press');
            instance.setState({ sequence_number:0,question_id: 74, answer_id: 352 })
         });

        then('I can select the button with with out errors', () => {
            instance.btnExampleProps.onPress();
            instance.letsBeginPressProps.onPress();
            const msgResApiSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgResApiSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgResApiSucessRestAPI.messageId);
            msgResApiSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
                "data": {
                    "id": "562",
                    "type": "assess_yourself_choose_answer",
                    "attributes": {
                        "assess_yourself_question": {
                            "id": 74,
                            "question_title": "Which test do you want to take?",
                            "sequence_number": null,
                            "assess_yourselve_id": null,
                            "created_at": "2022-12-05T05:21:04.872Z",
                            "updated_at": "2022-12-05T05:21:04.872Z"
                        },
                        "assess_yourself_answer": {
                            "id": 352,
                            "created_at": "2022-12-05T05:21:04.878Z",
                            "updated_at": "2022-12-05T05:21:04.878Z",
                            "assess_yourself_question_id": 74,
                            "answer_title": "Anxiety Test",
                            "answer_score": null
                        },
                        "total_score": [
                            {
                                "min_score": 15,
                                "max_score": 21,
                                "id": 28,
                                "total_score": 21,
                                "anixety_title": "Severe Anxiety",
                                "category_id": 352,
                                "created_at": "2022-12-06T12:17:52.378Z",
                                "updated_at": "2022-12-27T13:52:02.896Z",
                                "result": false
                            }
                        ],
                        "upcoming_questions_and_answers": [
                            {
                                "queston": {
                                    "id": 80,
                                    "question_title": "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious or on edge?",
                                    "sequence_number": 1,
                                    "assess_yourself_answer_id": 352,
                                    "created_at": "2022-12-06T12:10:16.503Z",
                                    "updated_at": "2022-12-06T12:15:00.359Z"
                                },
                                "answer": [
                                    {
                                        "id": 348,
                                        "answer": "Nearly every day",
                                        "answer_score": "3",
                                        "assess_yourself_test_type_id": 80,
                                        "created_at": "2022-12-06T12:10:16.509Z",
                                        "updated_at": "2022-12-06T12:10:16.509Z"
                                    },
                                    {
                                        "id": 347,
                                        "answer": "More than half the days",
                                        "answer_score": "2",
                                        "assess_yourself_test_type_id": 80,
                                        "created_at": "2022-12-06T12:10:16.508Z",
                                        "updated_at": "2022-12-06T12:10:16.508Z"
                                    },
                                    {
                                        "id": 346,
                                        "answer": "Several days",
                                        "answer_score": "1",
                                        "assess_yourself_test_type_id": 80,
                                        "created_at": "2022-12-06T12:10:16.507Z",
                                        "updated_at": "2022-12-06T12:10:16.507Z"
                                    },
                                    {
                                        "id": 345,
                                        "answer": "Not at All",
                                        "answer_score": "0",
                                        "assess_yourself_test_type_id": 80,
                                        "created_at": "2022-12-06T12:10:16.505Z",
                                        "updated_at": "2022-12-06T12:10:16.505Z"
                                    }
                                ]
                            },
                            {
                                "queston": {
                                    "id": 81,
                                    "question_title": "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
                                    "sequence_number": 2,
                                    "assess_yourself_answer_id": 352,
                                    "created_at": "2022-12-06T12:11:07.855Z",
                                    "updated_at": "2022-12-06T12:15:12.618Z"
                                },
                                "answer": [
                                    {
                                        "id": 352,
                                        "answer": "Nearly every day",
                                        "answer_score": "3",
                                        "assess_yourself_test_type_id": 81,
                                        "created_at": "2022-12-06T12:11:07.860Z",
                                        "updated_at": "2022-12-06T12:11:07.860Z"
                                    },
                                    {
                                        "id": 351,
                                        "answer": "More than half the days",
                                        "answer_score": "2",
                                        "assess_yourself_test_type_id": 81,
                                        "created_at": "2022-12-06T12:11:07.859Z",
                                        "updated_at": "2022-12-06T12:11:07.859Z"
                                    },
                                    {
                                        "id": 350,
                                        "answer": "Several days",
                                        "answer_score": "1",
                                        "assess_yourself_test_type_id": 81,
                                        "created_at": "2022-12-06T12:11:07.858Z",
                                        "updated_at": "2022-12-06T12:11:07.858Z"
                                    },
                                    {
                                        "id": 349,
                                        "answer": "Not at All",
                                        "answer_score": "0",
                                        "assess_yourself_test_type_id": 81,
                                        "created_at": "2022-12-06T12:11:07.857Z",
                                        "updated_at": "2022-12-06T12:11:07.857Z"
                                    }
                                ]
                            },
                            {
                                "queston": {
                                    "id": 82,
                                    "question_title": "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
                                    "sequence_number": 3,
                                    "assess_yourself_answer_id": 352,
                                    "created_at": "2022-12-06T12:11:46.103Z",
                                    "updated_at": "2022-12-06T12:15:22.901Z"
                                },
                                "answer": [
                                    {
                                        "id": 356,
                                        "answer": "Nearly every day",
                                        "answer_score": "3",
                                        "assess_yourself_test_type_id": 82,
                                        "created_at": "2022-12-06T12:11:46.107Z",
                                        "updated_at": "2022-12-06T12:11:46.107Z"
                                    },
                                    {
                                        "id": 355,
                                        "answer": "More than half the days",
                                        "answer_score": "2",
                                        "assess_yourself_test_type_id": 82,
                                        "created_at": "2022-12-06T12:11:46.106Z",
                                        "updated_at": "2022-12-06T12:11:46.106Z"
                                    },
                                    {
                                        "id": 354,
                                        "answer": "Several days",
                                        "answer_score": "1",
                                        "assess_yourself_test_type_id": 82,
                                        "created_at": "2022-12-06T12:11:46.105Z",
                                        "updated_at": "2022-12-06T12:11:46.105Z"
                                    },
                                    {
                                        "id": 353,
                                        "answer": "Not at All",
                                        "answer_score": "0",
                                        "assess_yourself_test_type_id": 82,
                                        "created_at": "2022-12-06T12:11:46.104Z",
                                        "updated_at": "2022-12-06T12:11:46.104Z"
                                    }
                                ]
                            },
                            {
                                "queston": {
                                    "id": 83,
                                    "question_title": "Over the last 2 weeks, how often have you been bothered by trouble relaxing",
                                    "sequence_number": 4,
                                    "assess_yourself_answer_id": 352,
                                    "created_at": "2022-12-06T12:12:26.127Z",
                                    "updated_at": "2022-12-06T12:15:34.048Z"
                                },
                                "answer": [
                                    {
                                        "id": 360,
                                        "answer": "Nearly every day",
                                        "answer_score": "3",
                                        "assess_yourself_test_type_id": 83,
                                        "created_at": "2022-12-06T12:12:26.133Z",
                                        "updated_at": "2022-12-06T12:12:26.133Z"
                                    },
                                    {
                                        "id": 359,
                                        "answer": "More than half the days",
                                        "answer_score": "2",
                                        "assess_yourself_test_type_id": 83,
                                        "created_at": "2022-12-06T12:12:26.132Z",
                                        "updated_at": "2022-12-06T12:12:26.132Z"
                                    },
                                    {
                                        "id": 358,
                                        "answer": "Several days",
                                        "answer_score": "1",
                                        "assess_yourself_test_type_id": 83,
                                        "created_at": "2022-12-06T12:12:26.131Z",
                                        "updated_at": "2022-12-06T12:12:26.131Z"
                                    },
                                    {
                                        "id": 357,
                                        "answer": "Not at All",
                                        "answer_score": "0",
                                        "assess_yourself_test_type_id": 83,
                                        "created_at": "2022-12-06T12:12:26.129Z",
                                        "updated_at": "2022-12-06T12:12:26.129Z"
                                    }
                                ]
                            },
                            {
                                "queston": {
                                    "id": 84,
                                    "question_title": "Over the last 2 weeks, how often have you been bothered by being so restless that it is hard to sit still?",
                                    "sequence_number": 5,
                                    "assess_yourself_answer_id": 352,
                                    "created_at": "2022-12-06T12:13:14.676Z",
                                    "updated_at": "2022-12-06T12:15:48.463Z"
                                },
                                "answer": [
                                    {
                                        "id": 364,
                                        "answer": "Nearly every day",
                                        "answer_score": "3",
                                        "assess_yourself_test_type_id": 84,
                                        "created_at": "2022-12-06T12:13:14.681Z",
                                        "updated_at": "2022-12-06T12:13:14.681Z"
                                    },
                                    {
                                        "id": 363,
                                        "answer": "More than half the days",
                                        "answer_score": "2",
                                        "assess_yourself_test_type_id": 84,
                                        "created_at": "2022-12-06T12:13:14.680Z",
                                        "updated_at": "2022-12-06T12:13:14.680Z"
                                    },
                                    {
                                        "id": 362,
                                        "answer": "Several days",
                                        "answer_score": "1",
                                        "assess_yourself_test_type_id": 84,
                                        "created_at": "2022-12-06T12:13:14.679Z",
                                        "updated_at": "2022-12-06T12:13:14.679Z"
                                    },
                                    {
                                        "id": 361,
                                        "answer": "Not at All",
                                        "answer_score": "0",
                                        "assess_yourself_test_type_id": 84,
                                        "created_at": "2022-12-06T12:13:14.678Z",
                                        "updated_at": "2022-12-06T12:13:14.678Z"
                                    }
                                ]
                            },
                            {
                                "queston": {
                                    "id": 85,
                                    "question_title": "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
                                    "sequence_number": 6,
                                    "assess_yourself_answer_id": 352,
                                    "created_at": "2022-12-06T12:13:55.386Z",
                                    "updated_at": "2022-12-06T12:15:59.899Z"
                                },
                                "answer": [
                                    {
                                        "id": 368,
                                        "answer": "Nearly every day",
                                        "answer_score": "3",
                                        "assess_yourself_test_type_id": 85,
                                        "created_at": "2022-12-06T12:13:55.392Z",
                                        "updated_at": "2022-12-06T12:13:55.392Z"
                                    },
                                    {
                                        "id": 367,
                                        "answer": "More than half the days",
                                        "answer_score": "2",
                                        "assess_yourself_test_type_id": 85,
                                        "created_at": "2022-12-06T12:13:55.391Z",
                                        "updated_at": "2022-12-06T12:13:55.391Z"
                                    },
                                    {
                                        "id": 366,
                                        "answer": "Several days",
                                        "answer_score": "1",
                                        "assess_yourself_test_type_id": 85,
                                        "created_at": "2022-12-06T12:13:55.390Z",
                                        "updated_at": "2022-12-06T12:13:55.390Z"
                                    },
                                    {
                                        "id": 365,
                                        "answer": "Not at All",
                                        "answer_score": "0",
                                        "assess_yourself_test_type_id": 85,
                                        "created_at": "2022-12-06T12:13:55.389Z",
                                        "updated_at": "2022-12-06T12:13:55.389Z"
                                    }
                                ]
                            },
                            {
                                "queston": {
                                    "id": 86,
                                    "question_title": "Over the last 2 weeks, how often have you been bothered by feeling afraid as if something awful might happen?",
                                    "sequence_number": 7,
                                    "assess_yourself_answer_id": 352,
                                    "created_at": "2022-12-06T12:14:37.620Z",
                                    "updated_at": "2022-12-06T12:16:11.084Z"
                                },
                                "answer": [
                                    {
                                        "id": 372,
                                        "answer": "Nearly every day",
                                        "answer_score": "3",
                                        "assess_yourself_test_type_id": 86,
                                        "created_at": "2022-12-06T12:14:37.625Z",
                                        "updated_at": "2022-12-06T12:14:37.625Z"
                                    },
                                    {
                                        "id": 371,
                                        "answer": "More than half the days",
                                        "answer_score": "2",
                                        "assess_yourself_test_type_id": 86,
                                        "created_at": "2022-12-06T12:14:37.624Z",
                                        "updated_at": "2022-12-06T12:14:37.624Z"
                                    },
                                    {
                                        "id": 370,
                                        "answer": "Several days",
                                        "answer_score": "1",
                                        "assess_yourself_test_type_id": 86,
                                        "created_at": "2022-12-06T12:14:37.623Z",
                                        "updated_at": "2022-12-06T12:14:37.623Z"
                                    },
                                    {
                                        "id": 369,
                                        "answer": "Not at All",
                                        "answer_score": "0",
                                        "assess_yourself_test_type_id": 86,
                                        "created_at": "2022-12-06T12:14:37.622Z",
                                        "updated_at": "2022-12-06T12:14:37.622Z"
                                    }
                                ]
                            }
                        ]
                    }
                }
            });
          
            instance.chooseMultipleAnsForItem = msgResApiSucessRestAPI.messageId
            runEngine.sendMessage("Unit Test", msgResApiSucessRestAPI)
         
           

        });

        then('Modal Display based on Score if exists', () => {
            instance.txtInputWebProps.onChangeText("");
            instance.mulAnsForitmHandlingApires({"data": { "attributes": {
                "assess_yourself_question": {
                    "id": 174,
                    "question_title": "Which test do you want to take?",
                    "sequence_number": null,
                    "assess_yourselve_id": null,
                    "created_at": "2022-12-05T05:21:04.872Z",
                    "updated_at": "2022-12-05T05:21:04.872Z"
                },
                "assess_yourself_answer": {
                    "id": 452,
                    "created_at": "2022-12-05T05:21:04.878Z",
                    "updated_at": "2022-12-05T05:21:04.878Z",
                    "assess_yourself_question_id": 74,
                    "answer_title": "Anxiety Test",
                    "answer_score": null
                },
                "total_score": [
                    {
                        "min_score": 15,
                        "max_score": 21,
                        "id": 28,
                        "total_score": 21,
                        "anixety_title": "Severe Anxiety",
                        "category_id": 352,
                        "created_at": "2022-12-06T12:17:52.378Z",
                        "updated_at": "2022-12-27T13:52:02.896Z",
                        "result": false,
                        "color":"Orange"
                    }
                ],
                "upcoming_questions_and_answers": []

            }}})
            instance.mulAnsForitmHandlingApires({"data": { "attributes": {
                "assess_yourself_question": {
                    "id": 174,
                    "question_title": "Which test do you want to take?",
                    "sequence_number": null,
                    "assess_yourselve_id": null,
                    "created_at": "2022-12-05T05:21:04.872Z",
                    "updated_at": "2022-12-05T05:21:04.872Z"
                },
                "assess_yourself_answer": {
                    "id": 452,
                    "created_at": "2022-12-05T05:21:04.878Z",
                    "updated_at": "2022-12-05T05:21:04.878Z",
                    "assess_yourself_question_id": 74,
                    "answer_title": "Anxiety Test",
                    "answer_score": null
                },
                "total_score": [
                    {
                        "min_score": 15,
                        "max_score": 21,
                        "id": 28,
                        "total_score": 21,
                        "anixety_title": "Severe Anxiety",
                        "category_id": 352,
                        "created_at": "2022-12-06T12:17:52.378Z",
                        "updated_at": "2022-12-27T13:52:02.896Z",
                        "result": false,
                        "color":"Yellow"
                    }
                ],
                "upcoming_questions_and_answers": []

            }}})
            instance.mulAnsForitmHandlingApires({"data": { "attributes": {
                "assess_yourself_question": {
                    "id": 174,
                    "question_title": "Which test do you want to take?",
                    "sequence_number": null,
                    "assess_yourselve_id": null,
                    "created_at": "2022-12-05T05:21:04.872Z",
                    "updated_at": "2022-12-05T05:21:04.872Z"
                },
                "assess_yourself_answer": {
                    "id": 452,
                    "created_at": "2022-12-05T05:21:04.878Z",
                    "updated_at": "2022-12-05T05:21:04.878Z",
                    "assess_yourself_question_id": 74,
                    "answer_title": "Anxiety Test",
                    "answer_score": null
                },
                "total_score": [
                    {
                        "min_score": 15,
                        "max_score": 21,
                        "id": 28,
                        "total_score": 21,
                        "anixety_title": "Severe Anxiety",
                        "category_id": 352,
                        "created_at": "2022-12-06T12:17:52.378Z",
                        "updated_at": "2022-12-27T13:52:02.896Z",
                        "result": false,
                        "color":"Light-green"
                    }
                ],
                "upcoming_questions_and_answers": []

            }}})
            instance.mulAnsForitmHandlingApires({"data": {
                "id": "562",
                "type": "assess_yourself_choose_answer",
                "attributes": {
                    "assess_yourself_question": {
                        "id": 74,
                        "question_title": "Which test do you want to take?",
                        "sequence_number": null,
                        "assess_yourselve_id": null,
                        "created_at": "2022-12-05T05:21:04.872Z",
                        "updated_at": "2022-12-05T05:21:04.872Z"
                    },
                    "assess_yourself_answer": {
                        "id": 352,
                        "created_at": "2022-12-05T05:21:04.878Z",
                        "updated_at": "2022-12-05T05:21:04.878Z",
                        "assess_yourself_question_id": 74,
                        "answer_title": "Anxiety Test",
                        "answer_score": null
                    },
                    "total_score": [
                        {
                            "min_score": 15,
                            "max_score": 21,
                            "id": 28,
                            "total_score": 21,
                            "anixety_title": "Severe Anxiety",
                            "category_id": 352,
                            "created_at": "2022-12-06T12:17:52.378Z",
                            "updated_at": "2022-12-27T13:52:02.896Z",
                            "result": false,
                            "color":"Red"
                        }
                    ],
                    "upcoming_questions_and_answers": [
                        {
                            "queston": {
                                "id": 80,
                                "question_title": "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious or on edge?",
                                "sequence_number": 1,
                                "assess_yourself_answer_id": 352,
                                "created_at": "2022-12-06T12:10:16.503Z",
                                "updated_at": "2022-12-06T12:15:00.359Z"
                            },
                            "answer": [
                                {
                                    "id": 348,
                                    "answer": "Nearly every day",
                                    "answer_score": "3",
                                    "assess_yourself_test_type_id": 80,
                                    "created_at": "2022-12-06T12:10:16.509Z",
                                    "updated_at": "2022-12-06T12:10:16.509Z"
                                },
                                {
                                    "id": 347,
                                    "answer": "More than half the days",
                                    "answer_score": "2",
                                    "assess_yourself_test_type_id": 80,
                                    "created_at": "2022-12-06T12:10:16.508Z",
                                    "updated_at": "2022-12-06T12:10:16.508Z"
                                },
                                {
                                    "id": 346,
                                    "answer": "Several days",
                                    "answer_score": "1",
                                    "assess_yourself_test_type_id": 80,
                                    "created_at": "2022-12-06T12:10:16.507Z",
                                    "updated_at": "2022-12-06T12:10:16.507Z"
                                },
                                {
                                    "id": 345,
                                    "answer": "Not at All",
                                    "answer_score": "0",
                                    "assess_yourself_test_type_id": 80,
                                    "created_at": "2022-12-06T12:10:16.505Z",
                                    "updated_at": "2022-12-06T12:10:16.505Z"
                                }
                            ]
                        },
                        {
                            "queston": {
                                "id": 81,
                                "question_title": "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
                                "sequence_number": 2,
                                "assess_yourself_answer_id": 352,
                                "created_at": "2022-12-06T12:11:07.855Z",
                                "updated_at": "2022-12-06T12:15:12.618Z"
                            },
                            "answer": [
                                {
                                    "id": 352,
                                    "answer": "Nearly every day",
                                    "answer_score": "3",
                                    "assess_yourself_test_type_id": 81,
                                    "created_at": "2022-12-06T12:11:07.860Z",
                                    "updated_at": "2022-12-06T12:11:07.860Z"
                                },
                                {
                                    "id": 351,
                                    "answer": "More than half the days",
                                    "answer_score": "2",
                                    "assess_yourself_test_type_id": 81,
                                    "created_at": "2022-12-06T12:11:07.859Z",
                                    "updated_at": "2022-12-06T12:11:07.859Z"
                                },
                                {
                                    "id": 350,
                                    "answer": "Several days",
                                    "answer_score": "1",
                                    "assess_yourself_test_type_id": 81,
                                    "created_at": "2022-12-06T12:11:07.858Z",
                                    "updated_at": "2022-12-06T12:11:07.858Z"
                                },
                                {
                                    "id": 349,
                                    "answer": "Not at All",
                                    "answer_score": "0",
                                    "assess_yourself_test_type_id": 81,
                                    "created_at": "2022-12-06T12:11:07.857Z",
                                    "updated_at": "2022-12-06T12:11:07.857Z"
                                }
                            ]
                        },
                        {
                            "queston": {
                                "id": 82,
                                "question_title": "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
                                "sequence_number": 3,
                                "assess_yourself_answer_id": 352,
                                "created_at": "2022-12-06T12:11:46.103Z",
                                "updated_at": "2022-12-06T12:15:22.901Z"
                            },
                            "answer": [
                                {
                                    "id": 356,
                                    "answer": "Nearly every day",
                                    "answer_score": "3",
                                    "assess_yourself_test_type_id": 82,
                                    "created_at": "2022-12-06T12:11:46.107Z",
                                    "updated_at": "2022-12-06T12:11:46.107Z"
                                },
                                {
                                    "id": 355,
                                    "answer": "More than half the days",
                                    "answer_score": "2",
                                    "assess_yourself_test_type_id": 82,
                                    "created_at": "2022-12-06T12:11:46.106Z",
                                    "updated_at": "2022-12-06T12:11:46.106Z"
                                },
                                {
                                    "id": 354,
                                    "answer": "Several days",
                                    "answer_score": "1",
                                    "assess_yourself_test_type_id": 82,
                                    "created_at": "2022-12-06T12:11:46.105Z",
                                    "updated_at": "2022-12-06T12:11:46.105Z"
                                },
                                {
                                    "id": 353,
                                    "answer": "Not at All",
                                    "answer_score": "0",
                                    "assess_yourself_test_type_id": 82,
                                    "created_at": "2022-12-06T12:11:46.104Z",
                                    "updated_at": "2022-12-06T12:11:46.104Z"
                                }
                            ]
                        },
                        {
                            "queston": {
                                "id": 83,
                                "question_title": "Over the last 2 weeks, how often have you been bothered by trouble relaxing",
                                "sequence_number": 4,
                                "assess_yourself_answer_id": 352,
                                "created_at": "2022-12-06T12:12:26.127Z",
                                "updated_at": "2022-12-06T12:15:34.048Z"
                            },
                            "answer": [
                                {
                                    "id": 360,
                                    "answer": "Nearly every day",
                                    "answer_score": "3",
                                    "assess_yourself_test_type_id": 83,
                                    "created_at": "2022-12-06T12:12:26.133Z",
                                    "updated_at": "2022-12-06T12:12:26.133Z"
                                },
                                {
                                    "id": 359,
                                    "answer": "More than half the days",
                                    "answer_score": "2",
                                    "assess_yourself_test_type_id": 83,
                                    "created_at": "2022-12-06T12:12:26.132Z",
                                    "updated_at": "2022-12-06T12:12:26.132Z"
                                },
                                {
                                    "id": 358,
                                    "answer": "Several days",
                                    "answer_score": "1",
                                    "assess_yourself_test_type_id": 83,
                                    "created_at": "2022-12-06T12:12:26.131Z",
                                    "updated_at": "2022-12-06T12:12:26.131Z"
                                },
                                {
                                    "id": 357,
                                    "answer": "Not at All",
                                    "answer_score": "0",
                                    "assess_yourself_test_type_id": 83,
                                    "created_at": "2022-12-06T12:12:26.129Z",
                                    "updated_at": "2022-12-06T12:12:26.129Z"
                                }
                            ]
                        },
                        {
                            "queston": {
                                "id": 84,
                                "question_title": "Over the last 2 weeks, how often have you been bothered by being so restless that it is hard to sit still?",
                                "sequence_number": 5,
                                "assess_yourself_answer_id": 352,
                                "created_at": "2022-12-06T12:13:14.676Z",
                                "updated_at": "2022-12-06T12:15:48.463Z"
                            },
                            "answer": [
                                {
                                    "id": 364,
                                    "answer": "Nearly every day",
                                    "answer_score": "3",
                                    "assess_yourself_test_type_id": 84,
                                    "created_at": "2022-12-06T12:13:14.681Z",
                                    "updated_at": "2022-12-06T12:13:14.681Z"
                                },
                                {
                                    "id": 363,
                                    "answer": "More than half the days",
                                    "answer_score": "2",
                                    "assess_yourself_test_type_id": 84,
                                    "created_at": "2022-12-06T12:13:14.680Z",
                                    "updated_at": "2022-12-06T12:13:14.680Z"
                                },
                                {
                                    "id": 362,
                                    "answer": "Several days",
                                    "answer_score": "1",
                                    "assess_yourself_test_type_id": 84,
                                    "created_at": "2022-12-06T12:13:14.679Z",
                                    "updated_at": "2022-12-06T12:13:14.679Z"
                                },
                                {
                                    "id": 361,
                                    "answer": "Not at All",
                                    "answer_score": "0",
                                    "assess_yourself_test_type_id": 84,
                                    "created_at": "2022-12-06T12:13:14.678Z",
                                    "updated_at": "2022-12-06T12:13:14.678Z"
                                }
                            ]
                        },
                        {
                            "queston": {
                                "id": 85,
                                "question_title": "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
                                "sequence_number": 6,
                                "assess_yourself_answer_id": 352,
                                "created_at": "2022-12-06T12:13:55.386Z",
                                "updated_at": "2022-12-06T12:15:59.899Z"
                            },
                            "answer": [
                                {
                                    "id": 368,
                                    "answer": "Nearly every day",
                                    "answer_score": "3",
                                    "assess_yourself_test_type_id": 85,
                                    "created_at": "2022-12-06T12:13:55.392Z",
                                    "updated_at": "2022-12-06T12:13:55.392Z"
                                },
                                {
                                    "id": 367,
                                    "answer": "More than half the days",
                                    "answer_score": "2",
                                    "assess_yourself_test_type_id": 85,
                                    "created_at": "2022-12-06T12:13:55.391Z",
                                    "updated_at": "2022-12-06T12:13:55.391Z"
                                },
                                {
                                    "id": 366,
                                    "answer": "Several days",
                                    "answer_score": "1",
                                    "assess_yourself_test_type_id": 85,
                                    "created_at": "2022-12-06T12:13:55.390Z",
                                    "updated_at": "2022-12-06T12:13:55.390Z"
                                },
                                {
                                    "id": 365,
                                    "answer": "Not at All",
                                    "answer_score": "0",
                                    "assess_yourself_test_type_id": 85,
                                    "created_at": "2022-12-06T12:13:55.389Z",
                                    "updated_at": "2022-12-06T12:13:55.389Z"
                                }
                            ]
                        },
                        {
                            "queston": {
                                "id": 86,
                                "question_title": "Over the last 2 weeks, how often have you been bothered by feeling afraid as if something awful might happen?",
                                "sequence_number": 7,
                                "assess_yourself_answer_id": 352,
                                "created_at": "2022-12-06T12:14:37.620Z",
                                "updated_at": "2022-12-06T12:16:11.084Z"
                            },
                            "answer": [
                                {
                                    "id": 372,
                                    "answer": "Nearly every day",
                                    "answer_score": "3",
                                    "assess_yourself_test_type_id": 86,
                                    "created_at": "2022-12-06T12:14:37.625Z",
                                    "updated_at": "2022-12-06T12:14:37.625Z"
                                },
                                {
                                    "id": 371,
                                    "answer": "More than half the days",
                                    "answer_score": "2",
                                    "assess_yourself_test_type_id": 86,
                                    "created_at": "2022-12-06T12:14:37.624Z",
                                    "updated_at": "2022-12-06T12:14:37.624Z"
                                },
                                {
                                    "id": 370,
                                    "answer": "Several days",
                                    "answer_score": "1",
                                    "assess_yourself_test_type_id": 86,
                                    "created_at": "2022-12-06T12:14:37.623Z",
                                    "updated_at": "2022-12-06T12:14:37.623Z"
                                },
                                {
                                    "id": 369,
                                    "answer": "Not at All",
                                    "answer_score": "0",
                                    "assess_yourself_test_type_id": 86,
                                    "created_at": "2022-12-06T12:14:37.622Z",
                                    "updated_at": "2022-12-06T12:14:37.622Z"
                                }
                            ]
                        }
                    ]
                }
            }});
            
            
            if(instance.state.isModal){
                let starNewTestbtn=exampleBlockA.findWhere((node) => node.prop('testID') === 'startNewTest');
                starNewTestbtn.simulate('press');
                let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'closeModal');
                buttonComponent.simulate('press');
               
            }
        }); 

        then('I will get Next set of Questions', () => {
            expect(exampleBlockA).toBeTruthy();
        }); 

        then('I can select the Answers for the Questions', () => {
           if(instance.state.sequence_number>0){
            let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'selectNxtQueAns0');
            buttonComponent.simulate('press');
            }
         
        }); 
        then('I can submit the Answers for the Questions', () => {
            const nextbtn=exampleBlockA.findWhere(
                (node)=>node.prop("testID")==="nxtPress")
            nextbtn.simulate("press")
            const nextBtnresult = new Message(getName(MessageEnum.RestAPIResponceMessage))
            nextBtnresult.addData(getName(MessageEnum.RestAPIResponceDataMessage), nextBtnresult.messageId);
            nextBtnresult.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
                "data": {
                    "id": "1881",
                    "type": "assess_select_answer",
                    "attributes": {
                        "account_id": 291,
                        "question": {
                            "id": 80,
                            "question_title": "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious or on edge?",
                            "sequence_number": 1,
                            "assess_yourself_answer_id": 352,
                            "created_at": "2022-12-06T12:10:16.503Z",
                            "updated_at": "2022-12-06T12:15:00.359Z"
                        },
                        "answer": {
                            "id": 348,
                            "answer": "Nearly every day",
                            "answer_score": "3",
                            "assess_yourself_test_type_id": 80,
                            "created_at": "2022-12-06T12:10:16.509Z",
                            "updated_at": "2022-12-06T12:10:16.509Z"
                        }
                    }
                }
            });
            instance.answersforAssessYourselfTestQue = nextBtnresult.messageId
            runEngine.sendMessage("Unit Test", nextBtnresult)

            
       });
       then('I will Get Result Of The Test', () => {
        if(instance.state.isModal){
            let starNewTestbtn=exampleBlockA.findWhere((node) => node.prop('testID') === 'startNewTest');
            starNewTestbtn.simulate('press');
            let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'closeModal');
            buttonComponent.simulate('press');
           
        }
    }); 
    then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
     });
    });


});
