import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import RandomNumberGenerator from "../../src/RandomNumberGenerator.web";
const navigation = require("react-navigation");

const screenProps = {
  navigation: navigation,
  id: "RandomNumberGenerator",
};

const feature = loadFeature(
  "./__tests__/features/RandomNumberGenerator-scenario.web.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to RandomNumberGenerator", ({ given, when, then }) => {
    let radomNumberGenerator: ShallowWrapper;
    let instance: RandomNumberGenerator;

    given("I am a User loading RandomNumberGenerator", () => {
      radomNumberGenerator = shallow(<RandomNumberGenerator {...screenProps} />);
    });

    when("I navigate to the RandomNumberGenerator", () => {
      instance = radomNumberGenerator.instance() as RandomNumberGenerator;
    });

    then("RandomNumberGenerator will load with out errors", () => {
      expect(radomNumberGenerator).toBeTruthy();
    });

    then("I can enter text with out errors", () => {
      let textInputComponent = radomNumberGenerator.findWhere(
        (node) => node.prop("data-test-id") === "lowerbound"
      );
      let event = {
        preventDefault() {},
        target: { value: "5" },
      };
      textInputComponent.simulate("change", event);

      textInputComponent = radomNumberGenerator.findWhere(
        (node) => node.prop("data-test-id") === "upperbound"
      );
      event = {
        preventDefault() {},
        target: { value: "7" },
      };
      textInputComponent.simulate("change", event);

    });

    then("I can select the button with with out errors", () => {
      let buttonComponent = radomNumberGenerator.findWhere(
        (node) => node.prop("data-test-id") === "btnGenerateRandomNumber"
      );
      buttonComponent.simulate("click");
      expect(radomNumberGenerator).toBeTruthy();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(radomNumberGenerator).toBeTruthy();
    });
  });
});
