// @ts-nocheck

import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import AsyncStorage from "@react-native-async-storage/async-storage";
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import QuestionAns from "../../src/QuestionAns"
import { data } from "./QuestionAns.steps"
const questions3 = [{"id":"8464","type":"choose_answer","attributes":{"account_id":723,"assesment_test_question":{"id":18,"title":" I understand you, what’s making you feel this way?","created_at":"2022-09-14T05:23:36.362Z","updated_at":"2022-09-20T04:42:26.460Z","sequence_number":2},"assesment_test_answer":{"id":64,"assesment_test_question_id":18,"created_at":"2022-09-14T05:23:36.371Z","updated_at":"2024-02-22T09:56:15.583Z","answers":"My Finances","title":null},"upcoming_question":{"id":12,"question_title":"How does your Financial Wellbeing influence you in these moods?","test_type":null,"sequence_number":null,"created_at":"2022-09-14T05:36:45.383Z","updated_at":"2022-11-25T07:35:03.242Z","assesment_test_answer_id":64},"upcoming_answers":[{"id":100,"assesment_test_type_id":12,"title":null,"answers":"Spending Habits","test_type_id":null,"created_at":"2022-09-14T05:36:45.384Z","updated_at":"2022-09-14T05:36:45.384Z"},{"id":101,"assesment_test_type_id":12,"title":null,"answers":"Budgeting","test_type_id":null,"created_at":"2022-09-14T05:36:45.385Z","updated_at":"2022-09-14T05:36:45.385Z"},{"id":102,"assesment_test_type_id":12,"title":null,"answers":"Investing","test_type_id":null,"created_at":"2022-09-14T05:36:45.387Z","updated_at":"2022-09-14T05:36:45.387Z"},{"id":103,"assesment_test_type_id":12,"title":null,"answers":"Taxation","test_type_id":null,"created_at":"2022-09-14T05:36:45.388Z","updated_at":"2022-09-14T05:36:45.388Z"},{"id":104,"assesment_test_type_id":12,"title":null,"answers":"Financial Planning","test_type_id":null,"created_at":"2022-09-14T05:36:45.389Z","updated_at":"2022-09-14T05:36:45.389Z"}]}}]
const personalQuestionsData=[
    {
      "id": "18",
      "type": "assesment_test_question",
      "attributes": {
        "title": " I understand you, what’s making you feel this way?",
        "sequence_number": 2,
        "answers": [
          {
            "id": 61,
            "assesment_test_question_id": 18,
            "created_at": "2022-09-14T05:23:36.364Z",
            "updated_at": "2022-12-02T05:14:47.511Z",
            "answers": "My Professional Life  ",
            "title": null
          },
          {
            "id": 62,
            "assesment_test_question_id": 18,
            "created_at": "2022-09-14T05:23:36.369Z",
            "updated_at": "2022-12-02T05:14:47.513Z",
            "answers": "My Personal Life & Relationships ",
            "title": null
          },
          {
            "id": 65,
            "assesment_test_question_id": 18,
            "created_at": "2024-01-25T06:14:04.358Z",
            "updated_at": "2024-01-25T06:14:04.358Z",
            "answers": "My Mental Fitness",
            "title": null
          },
          {
            "id": 63,
            "assesment_test_question_id": 18,
            "created_at": "2022-09-14T05:23:36.370Z",
            "updated_at": "2024-02-22T09:56:15.580Z",
            "answers": "My Physical Health",
            "title": null
          },
          {
            "id": 64,
            "assesment_test_question_id": 18,
            "created_at": "2022-09-14T05:23:36.371Z",
            "updated_at": "2024-02-22T09:56:15.583Z",
            "answers": "My Finances",
            "title": null
          }
        ]
      }
    },
    {
      "id": "17",
      "type": "assesment_test_question",
      "attributes": {
        "title": "how are you feeling today?",
        "sequence_number": 1,
        "answers": [
          {
            "id": 49,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.906Z",
            "updated_at": "2022-09-14T05:23:08.906Z",
            "answers": "Anxious ",
            "title": null
          },
          {
            "id": 50,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.908Z",
            "updated_at": "2022-09-14T05:23:08.908Z",
            "answers": "Stressed",
            "title": null
          },
          {
            "id": 51,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.909Z",
            "updated_at": "2022-09-14T05:23:08.909Z",
            "answers": "Worried",
            "title": null
          },
          {
            "id": 53,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.910Z",
            "updated_at": "2022-09-14T05:23:08.910Z",
            "answers": "Angry",
            "title": null
          },
          {
            "id": 54,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.911Z",
            "updated_at": "2022-09-14T05:23:08.911Z",
            "answers": "Sad",
            "title": null
          },
          {
            "id": 55,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.912Z",
            "updated_at": "2022-09-14T05:23:08.912Z",
            "answers": "Afraid",
            "title": null
          },
          {
            "id": 56,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.914Z",
            "updated_at": "2022-09-14T05:23:08.914Z",
            "answers": "Tired",
            "title": null
          },
          {
            "id": 57,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.915Z",
            "updated_at": "2022-09-14T05:23:08.915Z",
            "answers": "Numb",
            "title": null
          },
          {
            "id": 58,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.915Z",
            "updated_at": "2022-09-14T05:23:08.915Z",
            "answers": "Panicked",
            "title": null
          },
          {
            "id": 59,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.916Z",
            "updated_at": "2022-09-14T05:23:08.916Z",
            "answers": "Lonely",
            "title": null
          },
          {
            "id": 60,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.917Z",
            "updated_at": "2022-09-14T05:23:08.917Z",
            "answers": "Overwhelmed",
            "title": null
          },
          {
            "id": 52,
            "assesment_test_question_id": 17,
            "created_at": "2022-09-14T05:23:08.909Z",
            "updated_at": "2022-09-20T06:49:49.931Z",
            "answers": "Depressed/Low mood",
            "title": null
          }
        ]
      }
    }
  ]

const feature = loadFeature('./__tests__/features/QuestionAns-scenario4.feature');



jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn((key) => {
        if (key === "answers1") {
            return Promise.resolve(JSON.stringify({"sequence_number":1,"question_id":"17","answer_id":55}));
          };
    
          if (key === "answers2") {
            return Promise.resolve(JSON.stringify({"sequence_number":2,"question_id":"18","answer_id":64}));
          }
    
    }),
    setItem: jest.fn(() => Promise.resolve(null))
  }));

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
        reset : jest.fn(),
       addListener: jest.fn().mockImplementation((event, callback)=>{
        callback()
       }),
       state:{
        routeName: 'ChooseCategory',
        params:{
            data:data,
            name:"wfdsdf"
        }
       }
    },
    id: "QuestionAns"
  }
defineFeature(feature, (test) => {

test('User will be redirected to last visited screen #4', async({ given, when, then }) => {
    
      let QuestionAnsWrapper:ShallowWrapper;
      let instance:QuestionAns; 
      given("I am a User loading QuestionAns",()=>{
          QuestionAnsWrapper = shallow(<QuestionAns {...screenProps}/>);
          instance = QuestionAnsWrapper.instance() as QuestionAns
      
          expect(QuestionAnsWrapper).toBeTruthy()
      })
      when("Storage is true",()=>{
        instance.componentDidMount();
        instance.handleGetPreviousAnswer();
          const getProfileNameMEssage: Message = new Message(
              getName(MessageEnum.RestAPIResponceMessage)
            );
            getProfileNameMEssage.addData(
              getName(MessageEnum.RestAPIResponceSuccessMessage),
              {
                  "data": {
                    "id": "8468",
                    "type": "choose_answer",
                    "attributes": {
                      "account_id": 723,
                      "assesment_test_question": {
                        "id": 18,
                        "title": " I understand you, what’s making you feel this way?",
                        "created_at": "2022-09-14T05:23:36.362Z",
                        "updated_at": "2022-09-20T04:42:26.460Z",
                        "sequence_number": 2
                      },
                      "assesment_test_answer": {
                        "id": 64,
                        "assesment_test_question_id": 18,
                        "created_at": "2022-09-14T05:23:36.371Z",
                        "updated_at": "2024-02-22T09:56:15.583Z",
                        "answers": "My Finances",
                        "title": null
                      },
                      "upcoming_question": {
                        "id": 12,
                        "question_title": "How does your Financial Wellbeing influence you in these moods?",
                        "test_type": null,
                        "sequence_number": null,
                        "created_at": "2022-09-14T05:36:45.383Z",
                        "updated_at": "2022-11-25T07:35:03.242Z",
                        "assesment_test_answer_id": 64
                      },
                      "upcoming_answers": [
                        {
                          "id": 100,
                          "assesment_test_type_id": 12,
                          "title": null,
                          "answers": "Spending Habits",
                          "test_type_id": null,
                          "created_at": "2022-09-14T05:36:45.384Z",
                          "updated_at": "2022-09-14T05:36:45.384Z"
                        },
                        {
                          "id": 101,
                          "assesment_test_type_id": 12,
                          "title": null,
                          "answers": "Budgeting",
                          "test_type_id": null,
                          "created_at": "2022-09-14T05:36:45.385Z",
                          "updated_at": "2022-09-14T05:36:45.385Z"
                        },
                        {
                          "id": 102,
                          "assesment_test_type_id": 12,
                          "title": null,
                          "answers": "Investing",
                          "test_type_id": null,
                          "created_at": "2022-09-14T05:36:45.387Z",
                          "updated_at": "2022-09-14T05:36:45.387Z"
                        },
                        {
                          "id": 103,
                          "assesment_test_type_id": 12,
                          "title": null,
                          "answers": "Taxation",
                          "test_type_id": null,
                          "created_at": "2022-09-14T05:36:45.388Z",
                          "updated_at": "2022-09-14T05:36:45.388Z"
                        },
                        {
                          "id": 104,
                          "assesment_test_type_id": 12,
                          "title": null,
                          "answers": "Financial Planning",
                          "test_type_id": null,
                          "created_at": "2022-09-14T05:36:45.389Z",
                          "updated_at": "2022-09-14T05:36:45.389Z"
                        }
                      ]
                    }
                  }
                }
            );
            getProfileNameMEssage.addData(
              getName(MessageEnum.RestAPIResponceDataMessage),
              getProfileNameMEssage.messageId
            );
            instance.chooseanswersforPersonalityTestQue = getProfileNameMEssage.messageId;
            runEngine.sendMessage("Unit Test", getProfileNameMEssage);

      })
      then("User will be redirected",()=>{


      })
  });
})