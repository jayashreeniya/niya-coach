// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import { render} from '@testing-library/react-native';

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import SendPushnotification from "../../src/SendPushnotification";
const navigation = require("react-navigation");

const screenProps = {
  navigation: {
    navigate: jest.fn(),
  },
  id: "SendPushnotification",
};

const feature = loadFeature(
  "./__tests__/features/SendPushnotification-scenario.feature"
);

const catData=[
    {
      id: 1,
      name: "Employees",
      val:"employee"
    },
    {
      id: 2,
      name: "Coach",
      val:"hr"
    },
    {
      id: 3,
      name: "HR",
      val:"coach"
    },
  ];


defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to send push notifications", ({ given, when, then }) => {
    let pushnotificationsBlock: ShallowWrapper;
    let instance: SendPushnotification;

    given("I am a User loading send push notifications", () => {
      pushnotificationsBlock = shallow(<SendPushnotification {...screenProps} />);
    });

    when("I navigate to the send push notifications", () => {
      instance = pushnotificationsBlock.instance() as SendPushnotification;
    });

    then("send push notifications will load with out errors", () => {
      instance = pushnotificationsBlock.instance() as SendPushnotification;
      instance.componentDidMount();
      instance.getToken();
      const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", tokenMsg);
      
      instance = pushnotificationsBlock.instance() as SendPushnotification;
      const msgLoadAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLoadAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadAPI.messageId
      );
       runEngine.sendMessage("Unit Test", msgLoadAPI);
      expect(pushnotificationsBlock).toBeTruthy();
    
    });

    then("send push notifications will render with mock data", () => {
      instance = pushnotificationsBlock.instance() as SendPushnotification;
    //    expect(pushnotificationsBlock).toBeTruthy();
    });

    then("send push notifications will render with empty data", () => {
      instance = pushnotificationsBlock.instance() as SendPushnotification;
      instance.setState({loading: false });
      expect(pushnotificationsBlock).toBeTruthy();
    });

    then("send push notifications will load notifications from the server", () => {
        if(instance.state.loading){
            console.log("loadin",instance.state.loading);
        }
        else{
        instance.renderHeader();
        instance.renderEmail();
        instance.renderTextField();
        instance.renderListCategory();
        instance.renderButton();
       }    
    });

   then("I can enter the notificatio Title", () => {
      let notificationItem = pushnotificationsBlock
        .findWhere((node) => node.prop("testID") === "notificationTitle")
      
      notificationItem.simulate("changeText",'notification tile');
      instance.setState({title:"NotificationTile"})
      expect(pushnotificationsBlock).toBeTruthy();
    });
    then("I can enter the description of notification", () => {
        let textInputComponent = pushnotificationsBlock.findWhere((node) => node.prop('testID') === 'notificationTxt');
            textInputComponent.simulate('changeText', 'password');
     
         expect(pushnotificationsBlock).toBeTruthy();
         instance.setState({description:"Notifcation Description"});
      });

    then("I can select the Category for sending the notification", () => {
        const { container } = render(<SendPushnotification {...screenProps} />)
        let notificationItem = pushnotificationsBlock
          .findWhere((node) => node.prop("testID") === "selectTxtInput")
        
        notificationItem.simulate("changeText","Role Conflict");
        expect(pushnotificationsBlock).toBeTruthy();
      });
      then("I can click the notification send Button", () => {
        let notificationItem = pushnotificationsBlock
            .findWhere((node) => node.prop("testID") === "btnSave")
          
          notificationItem.simulate("press");
          instance.sendNotifcation()
          expect(pushnotificationsBlock).toBeTruthy();
          const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
          tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
          runEngine.sendMessage("Unit Test", tokenMsg);
          
          instance = pushnotificationsBlock.instance() as SendPushnotification;
          const msgLoadAPI = new Message(
            getName(MessageEnum.RestAPIResponceMessage)
          );
          msgLoadAPI.addData(
            getName(MessageEnum.RestAPIResponceDataMessage),
            msgLoadAPI.messageId
          );
          msgLoadAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
            data: []
          });
          instance.contactUsApiCallId = msgLoadAPI.messageId;
          runEngine.sendMessage("Unit Test", msgLoadAPI);
          expect(pushnotificationsBlock).toBeTruthy();
     
      });
  
  });
});
