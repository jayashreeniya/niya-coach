// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"
import { TapGestureHandler, GestureHandlerRootView, } from 'react-native-gesture-handler';
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import CoachTab from "../../src/CoachTab"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
        getParam: jest.fn(),
        
       
    },
    id: "CoachTab"
  }
const resMessages=[{"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MB3b131b7fa90e4f4a91129354c82c1332", "body": "hibhi", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T05:04:46Z", "date_updated": "2023-01-10T05:04:46Z", "delivery": null, "index": 2, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM1469024ef90d4f7f99939aaccaf85ad1/Receipts"}, "media": null, "participant_sid": null, "sid": "IM1469024ef90d4f7f99939aaccaf85ad1", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM1469024ef90d4f7f99939aaccaf85ad1"}, {"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MBda17c45772e94362987090c9ef5f1366", "body": "", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T05:03:03Z", "date_updated": "2023-01-10T05:03:03Z", "delivery": null, "index": 1, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74/Receipts"}, "media": [[Object]], "participant_sid": null, "sid": "IM5af16c0176d345209285895c62b66f74", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74"}, {"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MBda17c45772e94362987090c9ef5f1366", "body": "hi", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T04:57:31Z", "date_updated": "2023-01-10T04:57:31Z", "delivery": null, "index": 0, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IMa6308699b492432f940307535e0d6099/Receipts"}, "media": null, "participant_sid": null, "sid": "IMa6308699b492432f940307535e0d6099", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IMa6308699b492432f940307535e0d6099"}];
const upcommingAppointmnts =[{"id":"328","type":"coach_with_past_appointment","attributes":{"upcoming_appointments":{"id":328,"full_name":"coach60","expertise":[{"specialization":"Abusive Relationships","id":30},{"specialization":"Role Conflict","id":9}],"rating":null,"education":"","languages":"","city":"","image":null,"upcoming_appointments":[{"id":368,"start_time":"05/01/2023 19:00 PM","end_time":"05/01/2023 19:59","booking_date":"2023-01-05","viewable_slots":"05/01/2023 19:00 PM - 05/01/2023 19:59"}]}}}]
const resConversation={"conversation_sid":"CHc1dcda7560cd49c7b572594e84f39d19","chat_service_id":"IS05d6b26ffe8a4e88a3fac4386b5c804c","participant1":{"participant_sid1":"MBa2a1baffab614bfd966d5a604ccf6e89","access_token":"eyJjdHkiOiJ0d2lsaW8tZnBhO3Y9MSIsInR3ciI6bnVsbCwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTSzFiYzZmYWFiMWNmNDJkMzMxZDhlNmJiZDY0MWI5MGFmLTE2NzMyNTQwNzkiLCJncmFudHMiOnsiaWRlbnRpdHkiOjE5MiwiY2hhdCI6eyJzZXJ2aWNlX3NpZCI6IklTODNkNTJjZmE5NDUwNGVmNjkxM2U0MGY5YmNlMjYxNWYifX0sImlzcyI6IlNLMWJjNmZhYWIxY2Y0MmQzMzFkOGU2YmJkNjQxYjkwYWYiLCJuYmYiOjE2NzMyNTQwNzksImV4cCI6MTY3MzI1NzY3OSwic3ViIjoiQUMzN2EwNGNjNzgxNWU0MzdiZjhiNTliMzMxYzNjYzcxZiJ9.R5nW8I1LY49AKMigidEAa3BnWlPUqI1N-YZUnZWrguM"},"participant2":{"participant_sid2":"MBfd77fd80a4184ae186814b3e45e3dba2","access_token":"eyJjdHkiOiJ0d2lsaW8tZnBhO3Y9MSIsInR3ciI6bnVsbCwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTSzFiYzZmYWFiMWNmNDJkMzMxZDhlNmJiZDY0MWI5MGFmLTE2NzMyNTQwNzkiLCJncmFudHMiOnsiaWRlbnRpdHkiOiIzMjgiLCJjaGF0Ijp7InNlcnZpY2Vfc2lkIjoiSVM4M2Q1MmNmYTk0NTA0ZWY2OTEzZTQwZjliY2UyNjE1ZiJ9fSwiaXNzIjoiU0sxYmM2ZmFhYjFjZjQyZDMzMWQ4ZTZiYmQ2NDFiOTBhZiIsIm5iZiI6MTY3MzI1NDA3OSwiZXhwIjoxNjczMjU3Njc5LCJzdWIiOiJBQzM3YTA0Y2M3ODE1ZTQzN2JmOGI1OWIzMzFjM2NjNzFmIn0.OB72UXkcQENpH1PtuWQQJ-rQ1N9sm9rdUOooEhh9Vxc"}}
const docs =[{"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MBda17c45772e94362987090c9ef5f1366", "body": "", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T05:03:03Z", "date_updated": "2023-01-10T05:03:03Z", "delivery": null, "index": 1, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74/Receipts"}, "media": [[Object]], "participant_sid": null, "sid": "IM5af16c0176d345209285895c62b66f74", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74"}];

const feature = loadFeature('./__tests__/features/CoachTab-scenario.feature');

defineFeature(feature, (test) => {

    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to Coach Tab', ({ given, when, then }) => {
        let landingPageBlock:ShallowWrapper;
        let instance:CoachTab; 

        given('I am a User loading Coach Tab', () => {
            landingPageBlock = shallow(<CoachTab {...screenProps}/>)
        });

        when('I navigate to the Coach Tab', () => {
             instance = landingPageBlock.instance() as CoachTab;
             instance.componentDidMount();
             instance.getFocusOn();
             instance.setState({isShowcureentCoachDetails:false,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6NDIsImV4cCI6MTY3MjgyNzc0OSwidG9rZW5fdHlwZSI6ImxvZ2luIn0.nD4Jjb1QOSGuvBgtK_nZ6rQSRkkU-Q1tmTYRX7ZaZmCXUfbrOPDcxmkc4YzIE8CvQ5wE1gy85OoYRjvdGgoqBA"})
             instance.getUpcomingAppointment(393); 

             const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                upcommingAppointmnts
              )
              instance.getAppointmentsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
                instance.getChatDetails();
              const msgChat = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msgChat.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgChat.messageId
              )
        
              msgChat.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                resConversation
              )
              instance.getChatDetailsApiCallId = msgChat.messageId
              runEngine.sendMessage('From unit test', msgChat);
            
              instance.setState({messages:resMessages,
                conversationId: resConversation.conversation_sid,
                conversationName: resConversation.friendly_name,
                sender: resConversation.participant1.participant_sid1,
                receiver: resConversation.participant2.participant_sid2,
                twilioToken: resConversation.participant2.access_token,
                chatServiceId: resConversation.chat_service_id,
                documents:docs,
                upcomingAppointment: upcommingAppointmnts,
                activeTab:1});

            let btnDocsTab = landingPageBlock.findWhere((node) => node.prop('testID') === 'btnDocsTab');
            btnDocsTab.simulate('press');

            instance.renderList();

            instance.renderFile(docs[0],0);

            // let file0 = landingPageBlock.findWhere((node) => node.prop('testID') === 'file0');
            // file0.simulate('press');
            instance.selectFile();
            instance.getFile("1234","IMAGE");

            let btnMessTab = landingPageBlock.findWhere((node) => node.prop('testID') === 'btnMessTab');
            btnMessTab.simulate('press');
            instance.renderList();

            instance.renderChat();
            
            instance.renderMessage({item:resMessages[0],index:0});
            instance.renderMessage({item:resMessages[1],index:1});
            instance.renderMessage({item:resMessages[2],index:2});

            let txtnewMessage = landingPageBlock.findWhere((node) => node.prop('testID')==='txtnewMessage');
            txtnewMessage.simulate('changeText',"Hello Niya");

            let btnSendMsg = landingPageBlock.findWhere((node)=> node.prop('testID')==='btnSendMsg');
            btnSendMsg.simulate('press');
            instance.setState({newMessage:"Hello Niya"});
            instance.sendMessage("123");

            instance.nextPage();
            instance.previousPage();

            let btnAppointmentsTab = landingPageBlock.findWhere((node) => node.prop('testID') === 'btnAppointmentsTab');
            btnAppointmentsTab.simulate('press');
            instance.renderList();

            instance.renderPendingAppointments();

            let btnBack = landingPageBlock.findWhere((node)=> node.prop('testID')==='btnBack');
            btnBack.simulate('press');
         
        });

        then('Coach Tab will load with out errors', () => {
            expect(landingPageBlock).toBeTruthy();
            instance.conversationEventLoop();
            instance.renderPendingAppointments();
         
        });

        then('I can select the button with with out errors', () => {
            // let buttonComponent = landingPageBlock.findWhere((node) => node.prop('testID') === 'goToHomeButton');
            // buttonComponent.simulate('press')
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(landingPageBlock).toBeTruthy();
        });
    });


});
