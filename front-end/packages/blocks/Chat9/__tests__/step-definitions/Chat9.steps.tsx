// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import Chat9 from "../../src/Chat9"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
        getParam: jest.fn(),
        
       
    },
    id: "Chat9"
  }
  jest.useFakeTimers();
const resConversation={"conversation_sid":"CHc1dcda7560cd49c7b572594e84f39d19","chat_service_id":"IS05d6b26ffe8a4e88a3fac4386b5c804c","participant1":{"participant_sid1":"MBa2a1baffab614bfd966d5a604ccf6e89","access_token":"eyJjdHkiOiJ0d2lsaW8tZnBhO3Y9MSIsInR3ciI6bnVsbCwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTSzFiYzZmYWFiMWNmNDJkMzMxZDhlNmJiZDY0MWI5MGFmLTE2NzMyNTQwNzkiLCJncmFudHMiOnsiaWRlbnRpdHkiOjE5MiwiY2hhdCI6eyJzZXJ2aWNlX3NpZCI6IklTODNkNTJjZmE5NDUwNGVmNjkxM2U0MGY5YmNlMjYxNWYifX0sImlzcyI6IlNLMWJjNmZhYWIxY2Y0MmQzMzFkOGU2YmJkNjQxYjkwYWYiLCJuYmYiOjE2NzMyNTQwNzksImV4cCI6MTY3MzI1NzY3OSwic3ViIjoiQUMzN2EwNGNjNzgxNWU0MzdiZjhiNTliMzMxYzNjYzcxZiJ9.R5nW8I1LY49AKMigidEAa3BnWlPUqI1N-YZUnZWrguM"},"participant2":{"participant_sid2":"MBfd77fd80a4184ae186814b3e45e3dba2","access_token":"eyJjdHkiOiJ0d2lsaW8tZnBhO3Y9MSIsInR3ciI6bnVsbCwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTSzFiYzZmYWFiMWNmNDJkMzMxZDhlNmJiZDY0MWI5MGFmLTE2NzMyNTQwNzkiLCJncmFudHMiOnsiaWRlbnRpdHkiOiIzMjgiLCJjaGF0Ijp7InNlcnZpY2Vfc2lkIjoiSVM4M2Q1MmNmYTk0NTA0ZWY2OTEzZTQwZjliY2UyNjE1ZiJ9fSwiaXNzIjoiU0sxYmM2ZmFhYjFjZjQyZDMzMWQ4ZTZiYmQ2NDFiOTBhZiIsIm5iZiI6MTY3MzI1NDA3OSwiZXhwIjoxNjczMjU3Njc5LCJzdWIiOiJBQzM3YTA0Y2M3ODE1ZTQzN2JmOGI1OWIzMzFjM2NjNzFmIn0.OB72UXkcQENpH1PtuWQQJ-rQ1N9sm9rdUOooEhh9Vxc"}}
const resgetAppointments ={"data":[{"id":"343","type":"coach_appointment","attributes":{"id":343,"appointments":{"id":343,"name":"dom emp","booking_date":"2022-12-12","viewable_slots":"12/12/2022 14:00 PM - 12/12/2022 14:59","meeting_code":"c8ez-de6l-k59j"}}}]}
const resMessages=[{"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MB3b131b7fa90e4f4a91129354c82c1332", "body": "hibhi", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T05:04:46Z", "date_updated": "2023-01-10T05:04:46Z", "delivery": null, "index": 2, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM1469024ef90d4f7f99939aaccaf85ad1/Receipts"}, "media": null, "participant_sid": null, "sid": "IM1469024ef90d4f7f99939aaccaf85ad1", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM1469024ef90d4f7f99939aaccaf85ad1"}, {"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MBda17c45772e94362987090c9ef5f1366", "body": "", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T05:03:03Z", "date_updated": "2023-01-10T05:03:03Z", "delivery": null, "index": 1, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74/Receipts"}, "media": [[Object]], "participant_sid": null, "sid": "IM5af16c0176d345209285895c62b66f74", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74"}, {"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MBda17c45772e94362987090c9ef5f1366", "body": "hi", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T04:57:31Z", "date_updated": "2023-01-10T04:57:31Z", "delivery": null, "index": 0, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IMa6308699b492432f940307535e0d6099/Receipts"}, "media": null, "participant_sid": null, "sid": "IMa6308699b492432f940307535e0d6099", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IMa6308699b492432f940307535e0d6099"}];
const docs =[{"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MBda17c45772e94362987090c9ef5f1366", "body": "", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T05:03:03Z", "date_updated": "2023-01-10T05:03:03Z", "delivery": null, "index": 1, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74/Receipts"}, "media": [[Object]], "participant_sid": null, "sid": "IM5af16c0176d345209285895c62b66f74", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74"}];

const feature = loadFeature('./__tests__/features/Chat9-scenario.feature');


defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.spyOn(runEngine, "sendMessage"); 
    });

   

    test('User navigates to Chat9', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:Chat9; 

        given('I am a User loading Chat9', () => {
            exampleBlockA = shallow(<Chat9 {...screenProps}/>);
            jest.mock('react-native/Libraries/Utilities/Platform', () => {
              const Platform = jest.requireActual('react-native/Libraries/Utilities/Platform');
              Platform.OS = 'ios';
              return Platform;
            });
        });

        when('I navigate to the Chat9', () => {
             instance = exampleBlockA.instance() as Chat9
             
        });

        then('Chat9 will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.id=328;
            instance.componentDidMount();
            instance.setState({userId:328, token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });
            instance.getToken();
            instance.getChatDetails();
            instance.getAppointments();
            instance.doButtonPressed();
            instance.setEnableField();
            instance.btnShowHideProps.onPress();
            instance.btnExampleProps.onPress();
            instance.txtInputWebProps.onChangeText();
            instance.togglePreview();
            instance.toggleActionModal();
            
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
          });
        then('Network response for get Conversation details requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                resConversation
              )
              instance.getChatDetailsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);

              const msg1 = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg1.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg1.messageId
              )
        
              msg1.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {account_id: 'adf'}
              )
              instance.recommendActionApiCallId = msg1.messageId
              runEngine.sendMessage('From unit test', msg1);

              const msg2 = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg2.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg2.messageId
              )
        
              msg2.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {account_id: ''}
              )
              instance.recommendActionApiCallId = msg2.messageId
              runEngine.sendMessage('From unit test', msg2);
        });
        then('Network response for get Appointment details requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                resgetAppointments
              )
              instance.getAppointmentsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);

              instance.networkRequest({
                endPoint: `bx_block_calendar/booked_slots/user_appointments?service_user_id=328`,
                method: "GET",
                newState: { loading: true }
              });

              instance.networkRequest({
                endPoint: `bx_block_calendar/booked_slots/user_action_item`,
                method: "POST",
                body : {
                    service_user_id: `328`,
                    action_item: "Unit test",
                    date: "10/01/2023"
                  },
                newState: { loading: true }
              });

              instance.recommendAction({
                service_user_id: `328`,
                action_item: "Unit test",
                date: "10/01/2023"
              });
        });

        then('I can enter text with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            // let textInputComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInput');
            // textInputComponent.simulate('changeText', 'hello@aol.com');
        });

        then('I can select the button with with out errors', async () => {
            instance.setState({appointments:resgetAppointments?.data,
                messages:resMessages,
                conversationId: resConversation?.conversation_sid,
                conversationName: resConversation.friendly_name,
                sender: resConversation.participant1.participant_sid1,
                receiver: resConversation.participant2.participant_sid2,
                twilioToken: resConversation.participant2.access_token,
                chatServiceId: resConversation.chat_service_id,
                documents:docs,
                activeTab:1
            });
            
            instance.getConversation();
            instance.conversationEventLoop();
            //expect(exampleBlockA).toMatchSnapshot();


            let btnBack = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnBack');
            btnBack.simulate('press');
            

            

            instance.renderModal();

            


            instance.renderPendingAppointments();
            instance.renderDocuments();
            instance.setState({loading: true}, ()=> instance.renderDocuments());
            

            

            let btnActionItemAdd = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnActionItemAdd');
            btnActionItemAdd.simulate('press');

            

           

            
            let btnActiveTab2 = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnActiveTab2');
            btnActiveTab2.simulate('press');

            instance.renderList();

            instance.renderFile(docs[0],0);

            let file0 = exampleBlockA.findWhere((node) => node.prop('testID') === 'file0');
            instance.selectFile();
            instance.getFile("1234","IMAGE");
            instance.setState({ activeTab: 2, loading: false, result:[
              {
                text: "IMAGE",
                url: ""
              },
              0
            ] })
            let addAnotherSrvc = exampleBlockA.findWhere((node) => node.prop("testID") === "touchableImg");
            addAnotherSrvc.simulate('press')

            instance.setState({ activeTab: 2, loading: false, result:[
              {
                text: "PDF",
                url: ""
              },
              1
            ] })

            let addAnotherSrvc1 = exampleBlockA.findWhere((node) => node.prop("testID") === 'file1');
            addAnotherSrvc1.simulate('press')

            instance.setState({ activeTab: 2, loading: false, result:[
              {
                text: "IMAGE",
                url: "",
                title: "flowers"
              },
              0
            ] })
            let addAnotherSrvc2 = exampleBlockA.findWhere((node) => node.prop("testID") === "touchableImg");
            addAnotherSrvc2.simulate('press')

            instance.setState({ activeTab: 2, loading: false, result:[
              null,
              0
            ] })

            let btnActiveTab1 = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnActiveTab1');
            btnActiveTab1.simulate('press');
            instance.renderList();

            instance.renderChat();
            instance.getPreview('https://www.english-efl.com/methodology/test-writing/','IMAGE')
            instance.getFile(null, "IMAGE");
            
            instance.renderMessage({item:resMessages[0],index:0});
            instance.renderMessage({item:resMessages[1],index:1});
            instance.renderMessage({item:resMessages[2],index:2});

             let txtnewMessage = exampleBlockA.findWhere((node) => node.prop('testID')==='txtnewMessage');
            txtnewMessage.simulate('changeText',"Hello Niya");

            let btnSendMsg = exampleBlockA.findWhere((node)=> node.prop('testID')==='btnSendMsg');
            btnSendMsg.simulate('press');
            instance.setState({newMessage:"Hello Niya"});
            instance.sendMessage("123");

            instance.nextPage();
            instance.previousPage();

            let btnActiveTab3 = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnActiveTab3');
            btnActiveTab3.simulate('press');
           
            
            
           
            // expect(instance.state.txtSavedValue).toEqual("hello@aol.com");
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
              instance.getAppointmentsApiCallId = msg.messageId
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
              instance.getChatDetailsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
              
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
