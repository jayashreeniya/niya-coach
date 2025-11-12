// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"
import { fireEvent ,screen,render} from "@testing-library/react-native";
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import AdminConsole3 from "../../src/AdminConsole3"

const feature = loadFeature('./__tests__/features/AdminConsole3-scenario.feature');

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn()
    },
    id: "AdminConsole3"
  }


defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
         });

    test('User navigates to AdminConsole3', ({ given, when, then }) => {
        let adminConsoleBlock:ShallowWrapper;
        let instance:AdminConsole3; 

        given('I am a User loading AdminConsole3', () => {
          adminConsoleBlock = shallow(<AdminConsole3 {...screenProps}/>);
        });

        when('I navigate to the AdminConsole3', () => {
             instance = adminConsoleBlock.instance() as AdminConsole3
             instance.txtInputWebProps.onChangeText('txt');
             render(<AdminConsole3 {...screenProps} />)
             instance.componentDidMount();
             instance.btnShowHideProps.onPress();
             instance.btnExampleProps.onPress();
             instance.doButtonPressed();
             instance.setState({prifileimage:""})
             fireEvent.press(screen.getByTestId("btnOpenDrawer"));
             instance.setState({prifileimage:"img1e.png"})
           
             instance.setEnableField();
             fireEvent.press(screen.getByTestId("profile_click"));
             fireEvent.press(screen.getByTestId("Privacy_click"));
      
             fireEvent.press(screen.getByTestId("sendNotify_click"));
      
             fireEvent.press(screen.getByTestId("feedback_click"));
            
             fireEvent.press(screen.getByTestId("logout_click"));

             fireEvent.press(screen.getByTestId("logout_click1"));
             instance.proceedToDel()
             instance.getDelAccApiCallIdRes({
              message:"Deleted",
              data:{}
             })
            
             });

        then('AdminConsole3 will load with out errors', () => {
            const tokenMsg = new Message(
                getName(MessageEnum.AccoutLoginSuccess)
              );
        
              tokenMsg.addData(
                getName(MessageEnum.AuthTokenDataMessage),
                "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"
              )
        
            runEngine.sendMessage('From unut test', tokenMsg);
            instance.setState({token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"})
          
            instance.getUserDataList();
            instance.getAdminDashCount();
            instance.getAllDataList()
            const msgGetuser = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msgGetuser.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgGetuser.messageId
              )
        
              msgGetuser.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {"data": {
                    "id": "11",
                    "type": "account",
                    "attributes": {
                        "type": "EmailAccount",
                        "first_name": null,
                        "last_name": null,
                        "full_name": "test user",
                        "email": "asd@gmail.com",
                        "access_code": "12345",
                        "gender": null,
                        "full_phone_number": "7898125135",
                        "activated": true,
                        "phone_number": null,
                        "country_code": null,
                        "created_at": "2022-08-16T06:52:09.835Z",
                        "updated_at": "2022-08-16T06:52:09.908Z",
                        "image": null
                    }
                }}
              )
              instance.getuserDetailsApiCallId = msgGetuser.messageId
              runEngine.sendMessage('From unit test', msgGetuser);

            //   count 
            const msgCountApi = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msgCountApi.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgCountApi.messageId
              )
        
              msgCountApi.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {"data": {
                    "coaches":12,
                    "employees":11,
                    "companies":11
                }
            }
              )
              instance.getCountApiCallId = msgCountApi.messageId
              runEngine.sendMessage('From unit test', msgCountApi);


      
            expect(adminConsoleBlock).toBeTruthy();
            let btnOpenDrawer = adminConsoleBlock.findWhere((node) => node.prop('testID') === 'btnOpenDrawer');
            btnOpenDrawer.simulate('press');

            let btnCoachList = adminConsoleBlock.findWhere((node) => node.prop('testID') === 'btnCoachList');
            btnCoachList.simulate('press');

            let btnComList = adminConsoleBlock.findWhere((node) => node.prop('testID') === 'btnComList');
            btnComList.simulate('press');

            let btnUGList = adminConsoleBlock.findWhere((node) => node.prop('testID') === 'btnUGList');
            btnUGList.simulate('press');

            
            
        });

        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(adminConsoleBlock).toBeTruthy();
        });
    });


});
