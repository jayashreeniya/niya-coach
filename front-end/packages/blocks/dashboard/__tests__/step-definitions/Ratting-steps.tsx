// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import Ratting from "../../src/Ratting";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import { render, screen, fireEvent } from '@testing-library/react-native';
const navigation = require("react-navigation");
const screenProps = {
  navigation: { navigate: jest.fn() },
  id: "Ratting"
};
const feature = loadFeature("./__tests__/features/Ratting-scenario.feature");

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });
  afterEach(()=>{
    jest.runAllTimers();
  });


  test("User navigates to Ratting", ({ given, when, then }) => {
    let RattingWrapper: ShallowWrapper;
    let instance: Ratting;
    given("I am a User loading Ratting", () => {
      RattingWrapper = shallow(<Ratting {...screenProps} />);
      expect(RattingWrapper).toBeTruthy();
      // expect(RattingWrapper).toMatchSnapshot();
    });

    when("I navigate to the Ratting", () => {
      instance = RattingWrapper.instance() as Ratting;
      expect(RattingWrapper).toBeTruthy();
      // expect(RattingWrapper).toMatchSnapshot();
      instance.submitPressProps.onPress()
      instance.setState({appRating:1,coachRating:1});
      instance.submitPressProps.onPress();
    });

    then("Ratting will load with out errors", () => {
      expect(RattingWrapper).toBeTruthy();
      // expect(RattingWrapper).toMatchSnapshot();
      instance.getToken();
      const msgLoadDataAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLoadDataAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadDataAPI.messageId
      );
      msgLoadDataAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "message": {
            "id": "487",
            "type": "focus_area",
            "attributes": {
              "assesment_test_type_answers": [
                {
                  "id": 57,
                  "assesment_test_type_id": 9,
                  "title": null,
                  "answers": "Career progression",
                  "test_type_id": null,
                  "created_at": "2022-09-14T05:30:38.947Z",
                  "updated_at": "2022-09-14T05:30:38.947Z"
                },
                {
                  "id": 65,
                  "assesment_test_type_id": 9,
                  "title": null,
                  "answers": "Role Conflict",
                  "test_type_id": null,
                  "created_at": "2022-09-14T05:30:38.966Z",
                  "updated_at": "2022-09-14T05:30:38.966Z"
                }
              ]
            }
          },
        }
      );
      instance.postRatingApiCallId = msgLoadDataAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLoadDataAPI);
      // data
      const msgLoadDataAPI1 = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLoadDataAPI1.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadDataAPI1.messageId
      );
      msgLoadDataAPI1.addData(
        getName(MessageEnum.RestAPIResponceErrorMessage),
        {
          "data": {
            "id": "487",
            "type": "focus_area",
            "attributes": {
              "assesment_test_type_answers": [
                {
                  "id": 57,
                  "assesment_test_type_id": 9,
                  "title": null,
                  "answers": "Career progression",
                  "test_type_id": null,
                  "created_at": "2022-09-14T05:30:38.947Z",
                  "updated_at": "2022-09-14T05:30:38.947Z"
                },
                {
                  "id": 65,
                  "assesment_test_type_id": 9,
                  "title": null,
                  "answers": "Role Conflict",
                  "test_type_id": null,
                  "created_at": "2022-09-14T05:30:38.966Z",
                  "updated_at": "2022-09-14T05:30:38.966Z"
                }
              ]
            }
          },
        }
      );
      instance.postRatingApiCallId = msgLoadDataAPI1.messageId;
      runEngine.sendMessage("Unit Test", msgLoadDataAPI1);

      // 
      instance.postRating("");
      const msgLoadDataAPI2 = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLoadDataAPI2.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadDataAPI2.messageId
      );
      msgLoadDataAPI2.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "id": "487",
            "type": "focus_area",
            "attributes": {
              "assesment_test_type_answers": [
                {
                  "id": 57,
                  "assesment_test_type_id": 9,
                  "title": null,
                  "answers": "Career progression",
                  "test_type_id": null,
                  "created_at": "2022-09-14T05:30:38.947Z",
                  "updated_at": "2022-09-14T05:30:38.947Z"
                },
                {
                  "id": 65,
                  "assesment_test_type_id": 9,
                  "title": null,
                  "answers": "Role Conflict",
                  "test_type_id": null,
                  "created_at": "2022-09-14T05:30:38.966Z",
                  "updated_at": "2022-09-14T05:30:38.966Z"
                }
              ]
            }
          },
        }
      );
      instance.postRatingApiCallId = msgLoadDataAPI2.messageId;
      runEngine.sendMessage("Unit Test", msgLoadDataAPI2);
      instance.hideKeyboard();
      instance.bookacallPressProps.onPress();
      instance.setState({ appRating: 1 });
      instance.postRating("");
      instance.bookacallPressProps.onPress();
    });

    then("Ratting will display messages", () => {

      const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", tokenMsg);

      const apiMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), { data: [{ id: 1, type: "dashboard", attributes: { id: 1, title: "Dashboard_title_1", value: 1, created_at: "2021-03-08T17:10:08.139Z", updated_at: "2021-03-08T17:10:08.139Z" } }, { id: 2, type: "dashboard", attributes: { id: 2, title: "Dashboard 5", value: 5, created_at: "2021-03-08T17:10:36.867Z", updated_at: "2021-03-08T17:10:36.867Z" } }] })
      runEngine.sendMessage("Unit Test", apiMsg);

      expect(RattingWrapper).toBeTruthy();
       let btn = RattingWrapper.findWhere((node) => node.prop('testID') === 'keyboardhide');
      btn.simulate('press');
      instance.ratingCompleted(1);
      instance.letsBeginPressProps.onPress();
      instance.setState({coachID:120})

    });

    then("Ratting will display notifcation if no messages", () => {
      render(<Ratting {...screenProps} />)
    
      const apiNoItemsMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiNoItemsMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), { data: [] })
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);
      fireEvent.press(screen.getByTestId('Bookacallsubmitbtn'));
   
      expect(RattingWrapper).toBeTruthy();
     
    });

    then("Ratting will display notifcation if API failure", () => {
      render(<Ratting {...screenProps} />)
      const apiNoItemsMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiNoItemsMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), { data: [] })
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      const apiErrorResponceMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiErrorResponceMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), { errors: "Error" })
      runEngine.sendMessage("Unit Test", apiErrorResponceMsg);

      const apiFailedErrorResponceMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      runEngine.sendMessage("Unit Test", apiFailedErrorResponceMsg);
      fireEvent.press(screen.getByTestId('HomePagePress'));
      fireEvent.press(screen.getByTestId('submitbtn'));
      fireEvent.press(screen.getByTestId('HomePagePress'));
    
       expect(RattingWrapper).toBeTruthy();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(RattingWrapper).toBeTruthy();
     });

  });
});
