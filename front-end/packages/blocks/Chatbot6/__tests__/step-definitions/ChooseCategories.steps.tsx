// @ts-nocheck

import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChooseCategories from "../../src/ChooseCategories";
import { fireEvent, render,screen } from "@testing-library/react-native"
import { set_user_data } from "../../../../components/src/context/actions"

const navigation = require("react-navigation")

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn((key) => {
      if (key === "answers1") {
        return Promise.resolve(JSON.stringify({"sequence_number":"1","question_id":"17","answer_id":49}));
      };
      if (key === "answers2") {
        return Promise.resolve(JSON.stringify({"sequence_number":"1","question_id":"17","answer_id":49}));
      }

      if(key === 'question3'){
        return Promise.resolve(JSON.stringify(questions3))
      }
    }),
    setItem: jest.fn(() => Promise.resolve(null)),
    removeItem:jest.fn(() => Promise.resolve(null)),
  }));

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
        addEventListener:jest.fn(),
        addListener: jest.fn().mockImplementation((event, callback)=>{
            callback()
           }),
           state:{
            routeName: 'ChooseCategories'
           }
       
    },
    id: "ChooseCategories",
    isshowReass:false,
    dispatchEvent:jest.fn(),
    type:set_user_data

  }
jest.useFakeTimers();
const user_details={
    "question_id": 18,
    "answer_id":63
}
const feature = loadFeature('./__tests__/features/ChooseCategories-scenario.feature');
const  data=   [
    {
        "id": "18",
        "type": "assesment_test_question",
        "attributes": {
            "title": " I understand you, what’s making you feel this way?",
            "sequence_number": 2,
            "answers": [
                {
                    "id": 63,
                    "assesment_test_question_id": 18,
                    "created_at": "2022-09-14T05:23:36.370Z",
                    "updated_at": "2022-09-14T05:23:36.370Z",
                    "answers": "My Physical Wellbeing",
                    "title": null
                },
                {
                    "id": 64,
                    "assesment_test_question_id": 18,
                    "created_at": "2022-09-14T05:23:36.371Z",
                    "updated_at": "2022-09-14T05:23:36.371Z",
                    "answers": "My Financial Wellbeing",
                    "title": null
                },
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
                }
            ]
        }
    }
];
const datachoose_answer=   {
    "id": "1537",
    "type": "choose_answer",
    "attributes": {
        "account_id": 42,
        "assesment_test_question": {
            "id": 18,
            "title": " I understand you, what’s making you feel this way?",
            "created_at": "2022-09-14T05:23:36.362Z",
            "updated_at": "2022-09-20T04:42:26.460Z",
            "sequence_number": 2
        },
        "assesment_test_answer": {
            "id": 63,
            "assesment_test_question_id": 18,
            "created_at": "2022-09-14T05:23:36.370Z",
            "updated_at": "2022-09-14T05:23:36.370Z",
            "answers": "My Physical Wellbeing",
            "title": null
        },
        "upcoming_question": {
            "id": 11,
            "question_title": "How does your Physical Wellbeing influence you in these moods?",
            "test_type": null,
            "sequence_number": null,
            "created_at": "2022-09-14T05:36:18.592Z",
            "updated_at": "2022-11-25T07:35:14.536Z",
            "assesment_test_answer_id": 63
        },
        "upcoming_answers": [
            {
                "id": 95,
                "assesment_test_type_id": 11,
                "title": null,
                "answers": "Sleep Concerns   ",
                "test_type_id": null,
                "created_at": "2022-09-14T05:36:18.594Z",
                "updated_at": "2022-09-14T05:36:18.594Z"
            },
            {
                "id": 96,
                "assesment_test_type_id": 11,
                "title": null,
                "answers": "Eating Habits",
                "test_type_id": null,
                "created_at": "2022-09-14T05:36:18.595Z",
                "updated_at": "2022-09-14T05:36:18.595Z"
            },
            {
                "id": 97,
                "assesment_test_type_id": 11,
                "title": null,
                "answers": "Weight concerns ",
                "test_type_id": null,
                "created_at": "2022-09-14T05:36:18.596Z",
                "updated_at": "2022-09-14T05:36:18.596Z"
            },
            {
                "id": 98,
                "assesment_test_type_id": 11,
                "title": null,
                "answers": "Low Immunity",
                "test_type_id": null,
                "created_at": "2022-09-14T05:36:18.599Z",
                "updated_at": "2022-09-14T05:36:18.599Z"
            },
            {
                "id": 99,
                "assesment_test_type_id": 11,
                "title": null,
                "answers": "Lifestyle Diseases ",
                "test_type_id": null,
                "created_at": "2022-09-14T05:36:18.600Z",
                "updated_at": "2022-09-14T05:36:18.600Z"
            }
        ]
    }
}



defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.spyOn(global, 'setTimeout');
    });

    test('User navigates to ChooseCategories', ({ given, when, then }) => {
        let ChooseCategoriesWrapper:ShallowWrapper;
        
        let instance:ChooseCategories; 
        let removeStorageSpy;
         given('I am a User loading ChooseCategories', () => {
            ChooseCategoriesWrapper = shallow(<ChooseCategories {...screenProps}/>);
            instance = ChooseCategoriesWrapper.instance() as ChooseCategories
        
           
        });

        when('I navigate to the ChooseCategories', () => {
             instance = ChooseCategoriesWrapper.instance() as ChooseCategories

        });

        then('ChooseCategories will load with out errors', () => {
            
            expect(ChooseCategoriesWrapper).toBeTruthy();
            // expect(ChooseCategoriesWrapper).toMatchSnapshot();
            instance.setState({name:"sonali",token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA",loading:true });
            instance.forceUpdate();
            const msgsessionResAPI = new Message(getName(MessageEnum.SessionResponseMessage))
            msgsessionResAPI.addData(getName(MessageEnum.SessionResponseMessage), "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA");
            runEngine.sendMessage("Unit Test", msgsessionResAPI)  
      
            instance.getAssessmenttestQuestions(instance.state.token);
          
            const msggetAssessTestQuestionsList = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceDataMessage), msggetAssessTestQuestionsList.messageId);
            msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
               data:data
             
            });
            instance.getPersonalityTestApiCallId = msggetAssessTestQuestionsList.messageId;
            runEngine.sendMessage("Unit Test", msggetAssessTestQuestionsList);
            instance.setState({loading:false,options:[].concat(data)})
            instance.componentDidMount();
            instance.handleGetPreviousAnswer();
        
      });

        then('I can select the options with out errors', () => {
            expect(AsyncStorage.getItem).toHaveBeenCalledWith("answers1");
            expect(AsyncStorage.getItem).toHaveBeenCalledWith("answers2");

            if(instance.state.loading){

            }
            else{
            instance.setState({loading:false});
            instance.renderQuestionsSeq2({index:0, item:data[0].attributes},data[0].id);
            let btnOptComponent =ChooseCategoriesWrapper.findWhere((node) => node.prop('testID') === 'selectTypeOfTest0');
            btnOptComponent.simulate('press');
            instance.setState({ sequence_number:2,question_id: data[0].id, answer_id:data[0].attributes.answers[0].id })
                
           }
           });

        then('I can select the button with with out errors', () => {
            if(instance.state.options.length>0&&data[0].type==="assesment_test_question")
            {
              
            const btnNext=ChooseCategoriesWrapper.findWhere(
                (node)=>node.prop("testID")==="btnNxt")
            btnNext.simulate("press")
            instance.chooseanswersAssessmenttestQuestions()
            instance.isPlatformWeb();
            const msggetAssessTestQuestionsList = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceDataMessage), msggetAssessTestQuestionsList.messageId);
            msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
            "data": {
                "id": "1536",
                "type": "choose_answer",
                "attributes": {
                    "account_id": 42,
                    "assesment_test_question": {
                        "id": 18,
                        "title": " I understand you, what’s making you feel this way?",
                        "created_at": "2022-09-14T05:23:36.362Z",
                        "updated_at": "2022-09-20T04:42:26.460Z",
                        "sequence_number": 2
                    },
                    "assesment_test_answer": {
                        "id": 63,
                        "assesment_test_question_id": 18,
                        "created_at": "2022-09-14T05:23:36.370Z",
                        "updated_at": "2022-09-14T05:23:36.370Z",
                        "answers": "My Physical Wellbeing",
                        "title": null
                    },
                    "upcoming_question": {
                        "id": 11,
                        "question_title": "How does your Physical Wellbeing influence you in these moods?",
                        "test_type": null,
                        "sequence_number": null,
                        "created_at": "2022-09-14T05:36:18.592Z",
                        "updated_at": "2022-11-25T07:35:14.536Z",
                        "assesment_test_answer_id": 63
                    },
                    "upcoming_answers": [
                        {
                            "id": 95,
                            "assesment_test_type_id": 11,
                            "title": null,
                            "answers": "Sleep Concerns   ",
                            "test_type_id": null,
                            "created_at": "2022-09-14T05:36:18.594Z",
                            "updated_at": "2022-09-14T05:36:18.594Z"
                        },
                        {
                            "id": 96,
                            "assesment_test_type_id": 11,
                            "title": null,
                            "answers": "Eating Habits",
                            "test_type_id": null,
                            "created_at": "2022-09-14T05:36:18.595Z",
                            "updated_at": "2022-09-14T05:36:18.595Z"
                        },
                        {
                            "id": 97,
                            "assesment_test_type_id": 11,
                            "title": null,
                            "answers": "Weight concerns ",
                            "test_type_id": null,
                            "created_at": "2022-09-14T05:36:18.596Z",
                            "updated_at": "2022-09-14T05:36:18.596Z"
                        },
                        {
                            "id": 98,
                            "assesment_test_type_id": 11,
                            "title": null,
                            "answers": "Low Immunity",
                            "test_type_id": null,
                            "created_at": "2022-09-14T05:36:18.599Z",
                            "updated_at": "2022-09-14T05:36:18.599Z"
                        },
                        {
                            "id": 99,
                            "assesment_test_type_id": 11,
                            "title": null,
                            "answers": "Lifestyle Diseases ",
                            "test_type_id": null,
                            "created_at": "2022-09-14T05:36:18.600Z",
                            "updated_at": "2022-09-14T05:36:18.600Z"
                        }
                    ]
                }
             } });
            instance.chooseanswersforPersonalityTestQue = msggetAssessTestQuestionsList.messageId;
           runEngine.sendMessage("Unit Test", msggetAssessTestQuestionsList)
            expect(ChooseCategoriesWrapper).toBeTruthy();
            instance.setState({loading:false})
         }
    
          
        });

        then('I will get Next set of Questions', () => {
            removeStorageSpy=jest.spyOn(instance,"removeStorage")
            expect(ChooseCategoriesWrapper).toBeTruthy();
            instance.setState({options:[].concat(datachoose_answer),isNxt:true})
            instance.removeStorage()
            instance.handleBackButtonClick()
           
        }); 

        then('I can select the Answers for the Questions', () => {

             if(instance.state.isNxt&&datachoose_answer.type=="choose_answer"){
                console.log(datachoose_answer.attributes.upcoming_question.question_title)
                instance.renderUpcomingQuestionsAnsforSeq2(datachoose_answer.attributes,datachoose_answer.id,0);
                let btnOptComponent =ChooseCategoriesWrapper.findWhere((node) => node.prop('testID') === 'chooseAns0');
                // btnOptComponent.simulate('press');
                // btnOptComponent.simulate('press');
               instance.setState({checked:["95"],question_id:datachoose_answer.attributes.upcoming_answers[0].id});
             }

        }); 
        then('I can submit the Answers for the Questions', () => {
            render(<ChooseCategories  {...screenProps} />)
            if(instance.state.isNxt){
            const nextBtnresult = new Message(getName(MessageEnum.RestAPIResponceMessage))
            nextBtnresult.addData(getName(MessageEnum.RestAPIResponceDataMessage), nextBtnresult.messageId);
            nextBtnresult.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
                 meta:{
                    token:"exampleToken",
                    email_otp_token:"exampleToken"
                 },
                 data:user_details
             
            });
            instance.chooseMultipleAnsForItem = nextBtnresult.messageId
            runEngine.sendMessage("Unit Test", nextBtnresult);
            const nextbtn=ChooseCategoriesWrapper.findWhere(
                (node)=>node.prop("testID")==="btnNxt")
            //  nextbtn.simulate("press");

            const apiMethod=instance.chooseMultipleAnswersforItemQuestions()
            // expect(apiMethod).toBe(true);
            instance.renderModal();
         }
       });
         then('I can leave the screen with out errors', () => {

            instance.componentWillUnmount()
            expect(ChooseCategoriesWrapper).toBeTruthy();

     });
    });


});

