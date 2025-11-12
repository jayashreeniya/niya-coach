import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";

import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import {View} from "react-native";
import moment from "moment";
import Scheduling from "../../src/Scheduling";
const navigation = require("react-navigation");

const availabilityData = {
  data: {
    id: "137",
    type: "service_provider_availability",
    attributes: {
      id: 137,
      time_slots: [
        { from: "10:00 AM", to: "10:59 AM", booked_status: false, sno: "1" },
        { from: "11:00 AM", to: "11:59 AM", booked_status: false, sno: "2" },
        { from: "12:00 PM", to: "12:59 PM", booked_status: false, sno: "3" },
        { from: "01:00 PM", to: "01:59 PM", booked_status: false, sno: "4" },
        { from: "02:00 PM", to: "02:59 PM", booked_status: false, sno: "5" },
        { from: "03:00 PM", to: "03:59 PM", booked_status: false, sno: "6" },
        { from: "04:00 PM", to: "04:59 PM", booked_status: false, sno: "7" },
        { from: "05:00 PM", to: "05:59 PM", booked_status: false, sno: "8" },
        { from: "06:00 PM", to: "06:59 PM", booked_status: false, sno: "9" },
        { from: "07:00 PM", to: "07:59 PM", booked_status: false, sno: "10" },
        { from: "08:00 PM", to: "08:59 PM", booked_status: false, sno: "11" },
        { from: "09:00 PM", to: "09:59 PM", booked_status: false, sno: "12" },
        { from: "10:00 PM", to: "10:59 PM", booked_status: false, sno: "13" }
      ]
    }
  }
};

const screenProps = {
  navigation: navigation,
  id: "Scheduling"
};

const feature = loadFeature("./__tests__/features/scheduling-scenario.feature");

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to scheduling", ({ given, when, then }) => {
    let schedulingBlock: ShallowWrapper;
    let instance: Scheduling;

    given("I am a User loading scheduling", () => {
      schedulingBlock = shallow(<Scheduling {...screenProps} />);
    });

    when("I navigate to the scheduling", () => {
      instance = schedulingBlock.instance() as Scheduling;
      instance.calendarProps.minDate = moment("2020-12-25T04:45:25.565Z");
    });

    then("scheduling will load with out errors", () => {
      expect(schedulingBlock).toBeTruthy();
    });

    then("scheduling will load calendar with out errors", () => {
      let calendarComponent = schedulingBlock.findWhere(node => {
        return node.prop("testID") === "CALENDAR";
      });
      expect(calendarComponent.length).toEqual(1);
    });

    then(
      "scheduling will load availabilty generic card with out errors",
      () => {
        let availabiltyComponent = schedulingBlock.findWhere(node => {
          return node.prop("testID") === "testAvailability";
        });
        expect(availabiltyComponent.props().testID).toEqual("testAvailability");
      }
    );


    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(schedulingBlock).toBeTruthy();
    });
  });
});
