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
import ShareCalendar from "../../src/ShareCalendar.web";
const navigation = require("react-navigation");

const screenProps = {
  navigation: { navigate:jest.fn(),
  goBack:jest.fn(),
  addEventListener:jest.fn()
},

  screenId: "ShareCalendar",
};

const feature = loadFeature(
  "./__tests__/features/ShareCalendar-scenario.web.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to ShareCalendar", ({ given, when, then }) => {
    let exampleBlockA: ShallowWrapper;
    let instance: ShareCalendar;

    given("I am a User loading ShareCalendar", () => {
      exampleBlockA = shallow(<ShareCalendar {...screenProps} />);
    });

    when("I navigate to the ShareCalendar", () => {
      instance = exampleBlockA.instance() as ShareCalendar;
    });

    then("ShareCalendar will load with out errors", () => {
      expect(exampleBlockA).toBeTruthy();
    });

    then("I can enter text with out errors", () => {
      let textInputComponent = exampleBlockA.findWhere(
        (node) => node.prop("data-test-id") === "txtInput"
      );
      const event = {
        preventDefault() {},
        target: { value: "hello@aol.com" },
      };
      textInputComponent.simulate("change", event);
      instance.setEnableField();
      instance.setInputValue()
      expect(exampleBlockA).toBeTruthy();
      
    });

    then("I can select the button with with out errors", () => {
      let buttonComponent = exampleBlockA.findWhere(
        (node) => node.prop("data-test-id") === "btnAddExample"
      );
      buttonComponent.simulate("press");
      instance.doButtonPressed();
      expect(exampleBlockA).toBeTruthy();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(exampleBlockA).toBeTruthy();
    });
  });
});