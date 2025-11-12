// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import LandingPage from "../../src/LandingPage"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
      navigate:jest.fn(),
      goBack:jest.fn(),
      getParam: jest.fn(),
      
     
  },
    id: "LandingPage"
  }
const resMessages=[{"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MB3b131b7fa90e4f4a91129354c82c1332", "body": "hibhi", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T05:04:46Z", "date_updated": "2023-01-10T05:04:46Z", "delivery": null, "index": 2, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM1469024ef90d4f7f99939aaccaf85ad1/Receipts"}, "media": null, "participant_sid": null, "sid": "IM1469024ef90d4f7f99939aaccaf85ad1", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM1469024ef90d4f7f99939aaccaf85ad1"}, {"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MBda17c45772e94362987090c9ef5f1366", "body": "", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T05:03:03Z", "date_updated": "2023-01-10T05:03:03Z", "delivery": null, "index": 1, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74/Receipts"}, "media": [[Object]], "participant_sid": null, "sid": "IM5af16c0176d345209285895c62b66f74", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74"}, {"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MBda17c45772e94362987090c9ef5f1366", "body": "hi", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T04:57:31Z", "date_updated": "2023-01-10T04:57:31Z", "delivery": null, "index": 0, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IMa6308699b492432f940307535e0d6099/Receipts"}, "media": null, "participant_sid": null, "sid": "IMa6308699b492432f940307535e0d6099", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IMa6308699b492432f940307535e0d6099"}];
const resConversation={"conversation_sid":"CHc1dcda7560cd49c7b572594e84f39d19","chat_service_id":"IS05d6b26ffe8a4e88a3fac4386b5c804c","participant1":{"participant_sid1":"MBa2a1baffab614bfd966d5a604ccf6e89","access_token":"eyJjdHkiOiJ0d2lsaW8tZnBhO3Y9MSIsInR3ciI6bnVsbCwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTSzFiYzZmYWFiMWNmNDJkMzMxZDhlNmJiZDY0MWI5MGFmLTE2NzMyNTQwNzkiLCJncmFudHMiOnsiaWRlbnRpdHkiOjE5MiwiY2hhdCI6eyJzZXJ2aWNlX3NpZCI6IklTODNkNTJjZmE5NDUwNGVmNjkxM2U0MGY5YmNlMjYxNWYifX0sImlzcyI6IlNLMWJjNmZhYWIxY2Y0MmQzMzFkOGU2YmJkNjQxYjkwYWYiLCJuYmYiOjE2NzMyNTQwNzksImV4cCI6MTY3MzI1NzY3OSwic3ViIjoiQUMzN2EwNGNjNzgxNWU0MzdiZjhiNTliMzMxYzNjYzcxZiJ9.R5nW8I1LY49AKMigidEAa3BnWlPUqI1N-YZUnZWrguM"},"participant2":{"participant_sid2":"MBfd77fd80a4184ae186814b3e45e3dba2","access_token":"eyJjdHkiOiJ0d2lsaW8tZnBhO3Y9MSIsInR3ciI6bnVsbCwidHlwIjoiSldUIiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJTSzFiYzZmYWFiMWNmNDJkMzMxZDhlNmJiZDY0MWI5MGFmLTE2NzMyNTQwNzkiLCJncmFudHMiOnsiaWRlbnRpdHkiOiIzMjgiLCJjaGF0Ijp7InNlcnZpY2Vfc2lkIjoiSVM4M2Q1MmNmYTk0NTA0ZWY2OTEzZTQwZjliY2UyNjE1ZiJ9fSwiaXNzIjoiU0sxYmM2ZmFhYjFjZjQyZDMzMWQ4ZTZiYmQ2NDFiOTBhZiIsIm5iZiI6MTY3MzI1NDA3OSwiZXhwIjoxNjczMjU3Njc5LCJzdWIiOiJBQzM3YTA0Y2M3ODE1ZTQzN2JmOGI1OWIzMzFjM2NjNzFmIn0.OB72UXkcQENpH1PtuWQQJ-rQ1N9sm9rdUOooEhh9Vxc"}}
const currentCoach ={"data":[{"id":"328","type":"current_coach","attributes":{"coach_details":{"id":328,"full_name":"coach60","expertise":[{"specialization":"Abusive Relationships","id":30},{"specialization":"Role Conflict","id":9}],"rating":null,"education":"","languages":"","city":"","image":"https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBZQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--81efa2fb205d0139b5b54f3c22f40e73205a255c/profile.jpg"}}},{"id":"165","type":"current_coach","attributes":{"coach_details":{"id":165,"full_name":"coach16 test","expertise":[{"specialization":"Career Management","id":1},{"specialization":"Workplace Anxiety","id":2},{"specialization":"Workplace Performance","id":4},{"specialization":"Work Life Balance","id":5},{"specialization":"Workplace communication","id":6},{"specialization":"Workplace Conflict","id":7},{"specialization":"Professional Development","id":11},{"specialization":"Toxic Leadership","id":13},{"specialization":"Gender Identity Issues","id":15},{"specialization":"Cultural Identity issues","id":16},{"specialization":"Trauma","id":17},{"specialization":"Grief","id":18},{"specialization":"OCD","id":21},{"specialization":"ADHD","id":22},{"specialization":"Parenting problems","id":26},{"specialization":"Family issues","id":28},{"specialization":"Abusive Relationships","id":30},{"specialization":"Role Conflict","id":9}],"rating":3.5,"education":"Phsycological","languages":"Hindi & Tamil","city":"Calcutta","image":"https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBZQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--81efa2fb205d0139b5b54f3c22f40e73205a255c/profile.jpg"}}},{"id":"166","type":"current_coach","attributes":{"coach_details":{"id":166,"full_name":"coach17","expertise":[{"specialization":"Career Management","id":1},{"specialization":"Leadership Issues","id":3},{"specialization":"Work Life Balance","id":5},{"specialization":"Workplace communication","id":6},{"specialization":"Diversity and Inclusion At work","id":8},{"specialization":"Role Conflict","id":9},{"specialization":"Workplace Relationships","id":10},{"specialization":"Toxic Work environment","id":12},{"specialization":"Toxic Leadership","id":13},{"specialization":"Workplace Bullying","id":14},{"specialization":"Cultural Identity issues","id":16},{"specialization":"Grief","id":18},{"specialization":"OCD","id":21},{"specialization":"ADHD","id":22},{"specialization":"Autism spectrum","id":23},{"specialization":"Relationship Issues","id":25},{"specialization":"Marital Confilct","id":29},{"specialization":"Abusive Relationships","id":30}],"rating":4.5,"education":"Phsycological","languages":"Hindi & Telugu","city":"Delhi","image":"https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBVdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--222c07fe0b594357723676139b74d4f51241e237/download.png"}}}]}
const pastCoach ={"data":[{"id":"328","type":"current_coach","attributes":{"coach_details":{"id":328,"full_name":"coach60","expertise":[{"specialization":"Abusive Relationships","id":30},{"specialization":"Role Conflict","id":9}],"rating":null,"education":"","languages":"","city":"","image":null}}},{"id":"165","type":"current_coach","attributes":{"coach_details":{"id":165,"full_name":"coach16 test","expertise":[{"specialization":"Career Management","id":1},{"specialization":"Workplace Anxiety","id":2},{"specialization":"Workplace Performance","id":4},{"specialization":"Work Life Balance","id":5},{"specialization":"Workplace communication","id":6},{"specialization":"Workplace Conflict","id":7},{"specialization":"Professional Development","id":11},{"specialization":"Toxic Leadership","id":13},{"specialization":"Gender Identity Issues","id":15},{"specialization":"Cultural Identity issues","id":16},{"specialization":"Trauma","id":17},{"specialization":"Grief","id":18},{"specialization":"OCD","id":21},{"specialization":"ADHD","id":22},{"specialization":"Parenting problems","id":26},{"specialization":"Family issues","id":28},{"specialization":"Abusive Relationships","id":30},{"specialization":"Role Conflict","id":9}],"rating":3.5,"education":"Phsycological","languages":"Hindi & Tamil","city":"Calcutta","image":"https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBZQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--81efa2fb205d0139b5b54f3c22f40e73205a255c/profile.jpg"}}},{"id":"166","type":"current_coach","attributes":{"coach_details":{"id":166,"full_name":"coach17","expertise":[{"specialization":"Career Management","id":1},{"specialization":"Leadership Issues","id":3},{"specialization":"Work Life Balance","id":5},{"specialization":"Workplace communication","id":6},{"specialization":"Diversity and Inclusion At work","id":8},{"specialization":"Role Conflict","id":9},{"specialization":"Workplace Relationships","id":10},{"specialization":"Toxic Work environment","id":12},{"specialization":"Toxic Leadership","id":13},{"specialization":"Workplace Bullying","id":14},{"specialization":"Cultural Identity issues","id":16},{"specialization":"Grief","id":18},{"specialization":"OCD","id":21},{"specialization":"ADHD","id":22},{"specialization":"Autism spectrum","id":23},{"specialization":"Relationship Issues","id":25},{"specialization":"Marital Confilct","id":29},{"specialization":"Abusive Relationships","id":30}],"rating":4.5,"education":"Phsycological","languages":"Hindi & Telugu","city":"Delhi","image":"https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBVdz09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--222c07fe0b594357723676139b74d4f51241e237/download.png"}}}]}
const upcommingAppointments ={"data":{"id":"328","type":"coach_with_past_appointment","attributes":{"upcoming_appointments":{"id":328,"full_name":"coach60","expertise":[{"specialization":"Abusive Relationships","id":30},{"specialization":"Role Conflict","id":9}],"rating":null,"education":"","languages":"","city":"","image":null,"upcoming_appointments":[{"id":368,"start_time":"05/01/2023 19:00 PM","end_time":"05/01/2023 19:59","booking_date":"2023-01-05","viewable_slots":"05/01/2023 19:00 PM - 05/01/2023 19:59"}]}}}}
const docs =[{"account_sid": "AC37a04cc7815e437bf8b59b331c3cc71f", "attributes": "{}", "author": "MBda17c45772e94362987090c9ef5f1366", "body": "", "content_sid": null, "conversation_sid": "CHc595cf0c0a2940238ec700bb65cee914", "date_created": "2023-01-10T05:03:03Z", "date_updated": "2023-01-10T05:03:03Z", "delivery": null, "index": 1, "links": {"delivery_receipts": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74/Receipts"}, "media": [[Object]], "participant_sid": null, "sid": "IM5af16c0176d345209285895c62b66f74", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IM5af16c0176d345209285895c62b66f74"}];


jest.useFakeTimers();

const feature = loadFeature('./__tests__/features/LandingPage-scenario.feature');

defineFeature(feature, (test) => {

    beforeEach(() => {
        jest.resetModules()
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}))
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to LandingPage', ({ given, when, then }) => {
        let landingPageBlock:ShallowWrapper;
        let instance:LandingPage; 

        given('I am a User loading LandingPage', () => {
            landingPageBlock = shallow(<LandingPage {...screenProps}/>)
        });

        when('I navigate to the LandingPage', () => {
             instance = landingPageBlock.instance() as LandingPage;
             instance.componentDidMount();
             instance.getFocusOn();
             instance.setState({isShowcureentCoachDetails:false,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6NDIsImV4cCI6MTY3MjgyNzc0OSwidG9rZW5fdHlwZSI6ImxvZ2luIn0.nD4Jjb1QOSGuvBgtK_nZ6rQSRkkU-Q1tmTYRX7ZaZmCXUfbrOPDcxmkc4YzIE8CvQ5wE1gy85OoYRjvdGgoqBA"})
             const tokenMsg = new Message(
                getName(MessageEnum.SessionResponseMessage)
              );
        
              tokenMsg.addData(
                getName(MessageEnum.SessionResponseToken),
                "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"
              )
        
              runEngine.sendMessage('From unut test', tokenMsg);
              
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
        });

        then('LandingPage will load with out errors', () => {
            expect(landingPageBlock).toBeTruthy();
            instance.getFocusOn();
            instance.setState({isShowcureentCoachDetails:false});
            instance.setState({loading:false});
            instance.goToHome();
            instance.getUpcomingAppointment(393); 
            instance.getPastAppointment(383);
            instance.getChatDetails(383);
            instance.sendMessage("383");
            instance.nextPage();
            instance.previousPage();
             instance.selectFile();
            instance.getFile("1234","IMAGE");           

            instance.backbtnPressProps.onPress();
            const msgPlayloadAPI = new Message(getName(MessageEnum.NavigationPayLoadMessage))
            msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "USER-TOKEN");
            runEngine.sendMessage("Unit Test", msgPlayloadAPI)  

            const msgValidationAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msgValidationAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgValidationAPI.messageId);
            msgValidationAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
                "data": [
                    {
                        "email_validation_regexp": "^[a-zA-Z0-9.!\\#$%&‘*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                        "password_validation_regexp": "^(?=.*[A-Z])(?=.*[#!@$&*?<>',\\[\\]}{=\\-)(^%`~+.:;_])(?=.*[0-9])(?=.*[a-z]).{8,}$",
                        "password_validation_rules": "Password should be a minimum of 8 characters long, contain both uppercase and lowercase characters, at least one digit, and one special character (!@#$&*?<>',[]}{=-)(^%`~+.:;_)."
                    }
                ]
            });
            instance.getPastCoachApiCallId = msgValidationAPI.messageId
            runEngine.sendMessage("Unit Test", msgValidationAPI)
  
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                currentCoach
              )
              instance.getCurrentCoachApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
             
              //  past app
            const pastAppointment = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              pastAppointment.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              pastAppointment.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                upcommingAppointments
              )
              instance.getPastApiCallId = pastAppointment.messageId
              runEngine.sendMessage('From unit test', pastAppointment);


            // err
            const pastAppointmentErr = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              pastAppointmentErr.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              pastAppointmentErr.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {"errors":{
                    "error":"failed"
                }
                }
              );
              instance.getPastApiCallId = pastAppointmentErr.messageId
              runEngine.sendMessage('From unit test', pastAppointmentErr);


              const msgPast = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msgPast.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msgPast.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                pastCoach
              )
              instance.getPastCoachApiCallId = msgPast.messageId
              runEngine.sendMessage('From unit test', msgPast);

              const msgPasterr = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msgPasterr.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msgPasterr.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {"errors":{
                          "error":"failed"
                      }
                      }
              )
              instance.getPastCoachApiCallId = msgPasterr.messageId
              runEngine.sendMessage('From unit test', msgPasterr);
            
              instance.setState({currentCoachData:currentCoach.data,pastCoachData:pastCoach.data,
                conversationId: resConversation.conversation_sid,
                conversationName: resConversation.friendly_name,
                sender: resConversation.participant1.participant_sid1,
                receiver: resConversation.participant2.participant_sid2,
                twilioToken: resConversation.participant2.access_token,
                chatServiceId: resConversation.chat_service_id,
                documents:docs,
                activeTab:1});
              
              instance.renderHeaderBtns();            

              instance.setState({activebtn: "Past Coach"});
              let btnPastCoach = landingPageBlock.findWhere((node) => node.prop('testID') === 'btnPastCoach');
              btnPastCoach.simulate('press');

              instance.setState({activebtn: "Pastoach"});
              let btnPastCoach1 = landingPageBlock.findWhere((node) => node.prop('testID') === 'btnPastCoach1');
              btnPastCoach1.simulate('press');
    
              instance.setState({activebtn: "Current Coach"});
  
              let btnCurCoach = landingPageBlock.findWhere((node) => node.prop('testID') === 'btnCurCoach');
              btnCurCoach.simulate('press');
              instance.renderPastCoachData();

              instance.setState({activebtn: "Currentoach"});
  
              let btnCurCoach1 = landingPageBlock.findWhere((node) => node.prop('testID') === 'btnCurCoach');
              btnCurCoach1.simulate('press');
              instance.renderPastCoachData();
              instance.renerPastCoachHeader();

              let btnCCBack = landingPageBlock.findWhere((node)=> node.prop('testID')==='btnCCBack');
              btnCCBack.simulate('press');

              instance.getList(pastCoach.data[0]);
              instance.renderPastCoachData();
             
              instance.setState({isShowcureentCoachDetails:true,cureentCoachDetails:pastCoach.data[0],messages:resMessages});
              instance.renderisShowcureentCoachDetailsData();
              instance.renerCurretnCoachHeader();

              let btnDocs = landingPageBlock.findWhere((node) => node.prop('testID') === 'btnDocs');
              btnDocs.simulate('press');

              instance.renderDocuments();

              instance.renderFile(docs[0],0);
  
              // let file0 = landingPageBlock.findWhere((node) => node.prop('testID') === 'file');
              // file0.simulate('press');

              let btnMessages = landingPageBlock.findWhere((node) => node.prop('testID') === 'btnMessages');
              btnMessages.simulate('press');

              let btnAppointments = landingPageBlock.findWhere((node)=> node.prop('testID')==='btnAppointments');
              btnAppointments.simulate('press');
              instance.setState({activeTab:3});
              instance.renderList();
              instance.renderPendingAppointments();
              
              
              instance.selectFile();
              instance.getFile("1234","IMAGE");

              instance.renerCurretnCoachHeader();
              instance.renderCurrentCoachExpandList(pastCoach.data[0].attributes.coach_details.expertise, pastCoach.data[0].attributes.coach_details.id, pastCoach.data[0].attributes.coach_details.rating, pastCoach.data[0].attributes.coach_details.city, pastCoach.data[0].attributes.coach_details.languages, pastCoach.data[0].attributes.coach_details.full_name, pastCoach.data[0].attributes.coach_details.image);

              let btnExpertise = landingPageBlock.findWhere((node)=> node.prop('testID')==='btnExpertise0');
             // btnExpertise.simulate('press');
                
             instance.toggleLike();
             instance.handleDoubleTap();
             instance.nextPage();
             instance.previousPage();
             instance.togglePreview();
             instance.onPressCoachDeatails(pastCoach.data[0],pastCoach.data[0].id,pastCoach.data[0].attributes.coach_details.full_name,pastCoach.data[0].attributes.coach_details.image);

             instance.setState({activebtn: "Currentoach"});
             instance.onPressCoachDeatails(pastCoach.data[0],pastCoach.data[0].id,pastCoach.data[0].attributes.coach_details.full_name,pastCoach.data[0].attributes.coach_details.image);
        });

        then('I can select the button with with out errors', () => {
            instance.renderHeaderBasedSelection();
            instance.rendertabsBasedOnActiveBtn();
            instance.renderisShowcureentCoachDetailsData();
            instance.renderGestureHandlerView();
            instance.renderUpcomingAppforCurrentCoach();
            instance.renerPastCoachHeader();
            instance.renderList();
            instance.renderCurrentCoachData();
            instance.renderPastCoachData()
            instance.renderisShowcureentCoachDetailsData();
            instance.rendertabsBasedOnActiveBtn();
            instance.renderImgBasedOnRating(1);
            instance.renderImgBasedOnRating(2);
            instance.renderImgBasedOnRating(3);
            instance.renderImgBasedOnRating(4);
            instance.renderImgBasedOnRating(5);
            instance.renderImgBasedOnRating(0);
            instance.renderImgBasedOnRating();
            instance.renderBorderImgBasedOnRating();
            instance.renderBorderImgBasedOnRating(1);
            instance.renderBorderImgBasedOnRating(2);
            instance.renderBorderImgBasedOnRating(3);
            instance.renderBorderImgBasedOnRating(4);
            instance.renderBorderImgBasedOnRating(5);
            instance.renderBorderImgBasedOnRating(0);
            instance.renderCurrentCoachExpOtherDetials();
            instance.getCurrentCoach();
            instance.getPastCoach();
            instance.renderChat();
            instance.renderDocuments();
            
            instance.renderImgorURL();
            instance.renderImgorURL(instance.state.cureentCoachDetails.attributes.coach_details.image);
            //instance.renderCurrentCoachExpandList();

            instance.renderMessage({item:resMessages[0],index:0});
            instance.renderMessage({item:resMessages[1],index:1});
            instance.renderMessage({item:resMessages[2],index:2});
            // let buttonComponent = landingPageBlock.findWhere((node) => node.prop('testID') === 'goToHomeButton');
            // buttonComponent.simulate('press')
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(landingPageBlock).toBeTruthy();
        });
    });


});
