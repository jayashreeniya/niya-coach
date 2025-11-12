// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import ContactUsScreen from "../../src/ContactUsScreen";
const navigation = require("react-navigation");

const screenProps = {
  navigation: {
    navigate: jest.fn(),
    getParam:jest.fn(),
    addListener:('willFocus',()=>{
        instance.getDataDataList();
      }),
  },
  id: "ContactUsScreen",
};

const feature = loadFeature(
  "./__tests__/features/ContactUsScreen-scenario.feature"
);


defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to Contact Us", ({ given, when, then }) => {
    let UserContactUsBlock: ShallowWrapper;
    let instance: ContactUsScreen;

    given("I am a User loading Contact Us", () => {
        UserContactUsBlock = shallow(<ContactUsScreen {...screenProps} />);
    });

    when("I navigate to the Contact Us Screen", () => {
      instance = UserContactUsBlock.instance() as ContactUsScreen;
   
    });

    then("Contact Us will load with out errors", () => {
      instance = UserContactUsBlock.instance() as ContactUsScreen;
      instance.componentDidMount();
      
    
    });
    then('I can enter a Desciption with out errors', () => {
        instance.renderHeader();
        instance.renderTextField();
        instance.renderButton();
        instance.getToken();
        let textInputComponent = UserContactUsBlock.findWhere((node) => node.prop('testID') === 'msgDesc');
        textInputComponent.simulate('changeText', 'FULL');

    });

    then("I can select submit without errors", () => {
      let saveData = UserContactUsBlock
        .findWhere((node) => node.prop("testID") === "userDataSend")
        .first();

    saveData.simulate("press");
     instance.contactUs();

      expect(UserContactUsBlock).toBeTruthy();
      instance = UserContactUsBlock.instance() as ContactUsScreen;
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
      expect(UserContactUsBlock).toBeTruthy();
      instance.contactUsSuccessCallBack("");
      
      instance.setState({isLoading:false,role:"employee"})
 
    });

    then("Contact Us failed to load data from the server", () => {
      instance = UserContactUsBlock.instance() as UserProfile;
      const msgLoadFailRestAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLoadFailRestAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadFailRestAPI
      );
      msgLoadFailRestAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          errors: [
            {
              message: "Failed to load data",
            },
          ],
        }
      );

      msgLoadFailRestAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadFailRestAPI.messageId
      );
      instance.contactUsApiCallId = msgLoadFailRestAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLoadFailRestAPI);
      instance.contactUsFailureCallBack();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(UserContactUsBlock).toBeTruthy();
    });
  });
});
