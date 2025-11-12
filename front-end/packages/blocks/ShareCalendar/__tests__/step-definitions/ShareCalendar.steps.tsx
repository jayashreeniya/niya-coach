// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import React from "react";
import ShareCalendar from "../../src/ShareCalendar"
import { runEngine } from "../../../../framework/src/RunEngine";
import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import { Message } from "../../../../framework/src/Message";
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
        addEventListener:jest.fn()

    },
    screenId: "ShareCalendar"
  }

const feature = loadFeature('./__tests__/features/ShareCalendar-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
   
        jest.resetModules();
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
          
    });

    test('User navigates to ShareCalendar', ({ given, when, then }) => {
        let exampleShareCalendarBlock:ShallowWrapper;
        let instanceshareCalendar:ShareCalendar; 

        given('I am a User loading ShareCalendar', () => {
            exampleShareCalendarBlock = shallow(<ShareCalendar {...screenProps}/>);
        });

        when('I navigate to the ShareCalendar', () => {
            instanceshareCalendar = exampleShareCalendarBlock.instance() as ShareCalendar
        });

        then('ShareCalendar will load with out errors', () => {
            expect(exampleShareCalendarBlock).toBeTruthy();
        });

        then('I can check the slots out errors', () => {
            instanceshareCalendar.componentDidMount();
              const getAppointmentsAPI = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              )
              getAppointmentsAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), getAppointmentsAPI.messageId);
              const tokenMsgdata: Message = new Message(
                getName(MessageEnum.SessionResponseMessage)
              )
              tokenMsgdata.addData(getName(MessageEnum.SessionResponseToken), 'TOKEN')
              runEngine.sendMessage('Unit Test', tokenMsgdata)
              
              getAppointmentsAPI.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                  "data": [
                    {
                        "id": "147",
                        "type": "check_coach_availability",
                        "attributes": {
                            "id": 149,
                            "coach_details": {
                                "id": 166,
                                "full_name": "coach16 ",
                                "expertise": [
                                    {
                                        "specialization": "Career Management",
                                        "id": 1
                                    },
                                    {
                                        "specialization": "Workplace Anxiety",
                                        "id": 2
                                    },
                                   
                                      
                                ],
                                "rating": 4.5,
                                "education": "Phsycological",
                                "languages": "Hindi & English",
                                "city": "Calcutta",
                                "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBZQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--81efa2fb205d0139b5b54f3c22f40e73205a255c/profile.jpg"
                            },
                            "timeslots": []
                        }
                    },
                 
                ]
                }
              )
              instanceshareCalendar.getAppointmentsListApiCallId = getAppointmentsAPI.messageId
              runEngine.sendMessage('Unit Test', getAppointmentsAPI)
              expect(exampleShareCalendarBlock).toBeTruthy();
         
        });

        then('I can select the button with with out errors', () => {
            let buttonComponent = exampleShareCalendarBlock.findWhere((node) => node.prop('testID') === 'btnExample');
            buttonComponent.simulate('press');
            instanceshareCalendar.backBtnPress.onPress();
            instanceshareCalendar.calDateChange("")
            let tmslot={
                item:{
                   item:{
                    booked_status:false,
                    from:"23"
                   } 
                }
            }
          
            instanceshareCalendar.renderTimeslotData(tmslot);
          
        });

        then('I can leave the screen with out errors', () => {
            instanceshareCalendar.componentWillUnmount()
            expect(exampleShareCalendarBlock).toBeTruthy();
        });
    });


});
