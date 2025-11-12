// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import HRDashboard from "../../src/HRDashboard";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import { fireEvent ,screen,render} from "@testing-library/react-native";

const navigation = require("react-navigation");
const screenProps = {
  navigation: {navigate:jest.fn()},
  id: "HRDashboard"
};
const feature = loadFeature("./__tests__/features/HRDashboard-scenario.feature");
jest.useFakeTimers();
const data = {
  "id": "378",
  "type": "booked_slot",
  "attributes": {
    "focus_areas":[{"focus_area":'emoa',per:'37%'}],
    "id": 378,
    "start_time": "12/01/2023 08:00",
    "end_time": "12/01/2023 08:59",
    "booking_date": "2023-01-12",
    "viewable_slot": "12/01/2023 08:00 - 12/01/2023 08:59",
    "employee_details": [{
      "id": 378,
      "email": "coach11@gmail.com",
    }
    ],
  }
}
defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  afterEach(()=>{
    jest.runAllTimers();
  });

  test("User navigates to HR Dashboard", ({ given, when, then }) => {
    let dashboardWrapper: ShallowWrapper;
    let instance: HRDashboard;
    given("I am a User loading HR Dashboard", () => {
      dashboardWrapper = shallow(<HRDashboard {...screenProps} />);
      expect(dashboardWrapper).toBeTruthy();
     });

    when("I navigate to the HR Dashboard", () => {
      instance = dashboardWrapper.instance() as HRDashboard;
      expect(dashboardWrapper).toBeTruthy();
      instance.setState({ token: "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA", competeGoalModal: true, showActionModal: false, iscompeteGaol: true });
   
      instance.componentDidMount();
      instance.getToken();
      const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", tokenMsg);
      const apiMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiMsg.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        apiMsg.messageId
      );
      apiMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {data:[{id:1,type:"dashboard",attributes:{id:1,title:"Dashboard_title_1",value:1,created_at:"2021-03-08T17:10:08.139Z",updated_at:"2021-03-08T17:10:08.139Z"}},{id:2,type:"dashboard",attributes:{id:2,title:"Dashboard 5",value:5,created_at:"2021-03-08T17:10:36.867Z",updated_at:"2021-03-08T17:10:36.867Z"}}]})
      runEngine.sendMessage("Unit Test", apiMsg);

      // err
      const apiMsgErr: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiMsgErr.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        apiMsgErr.messageId
      );
      apiMsgErr.addData(getName(MessageEnum.RestAPIResponceErrorMessage), {"Errors":[{id:1,type:"dashboard",attributes:{id:1,title:"Dashboard_title_1",value:1,created_at:"2021-03-08T17:10:08.139Z",updated_at:"2021-03-08T17:10:08.139Z"}},{id:2,type:"dashboard",attributes:{id:2,title:"Dashboard 5",value:5,created_at:"2021-03-08T17:10:36.867Z",updated_at:"2021-03-08T17:10:36.867Z"}}]})
      runEngine.sendMessage("Unit Test", apiMsgErr);

      // dashboad 
      const apiMsgDash: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiMsgDash.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        apiMsg.messageId
      );
      apiMsgDash.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {"data":[{id:1,type:"dashboard",attributes:{id:1,title:"Dashboard_title_1",value:1,created_at:"2021-03-08T17:10:08.139Z",updated_at:"2021-03-08T17:10:08.139Z"}},{id:2,type:"dashboard",attributes:{id:2,title:"Dashboard 5",value:5,created_at:"2021-03-08T17:10:36.867Z",updated_at:"2021-03-08T17:10:36.867Z"}}]})
      instance.dashboardApiCallId = apiMsgDash.messageId
      runEngine.sendMessage("Unit Test", apiMsgDash);
      instance.setState({data:[],loading:false})

      // apiMsgDashgetProfileDataApiCallId
      const apiMsgDashgetProfileDataApiCallId: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiMsgDashgetProfileDataApiCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        apiMsgDashgetProfileDataApiCallId.messageId
      );
      apiMsgDashgetProfileDataApiCallId.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {"data":[{id:1,type:"dashboard",attributes:{id:1,title:"Dashboard_title_1",value:1,created_at:"2021-03-08T17:10:08.139Z",updated_at:"2021-03-08T17:10:08.139Z"}},{id:2,type:"dashboard",attributes:{id:2,title:"Dashboard 5",value:5,created_at:"2021-03-08T17:10:36.867Z",updated_at:"2021-03-08T17:10:36.867Z"}}]})
      instance.getProfileDataApiCallId = apiMsgDashgetProfileDataApiCallId.messageId
     
      runEngine.sendMessage("Unit Test", apiMsgDashgetProfileDataApiCallId);
      instance.setState({profile:[],loading:false,data:data})
      instance.saveFcmTOken(instance.state.token)
      instance.renderDrawer();
      instance.getProfileData();
      instance.renderList();
      instance.getHRDashboardDetails();
      instance.logOut()
    });

    then("HR dashboard will load with out errors", () => {
      expect(dashboardWrapper).toBeTruthy();
   
    });

    then("HR Dashboard will display messages", () => {
      render(<HRDashboard  {...screenProps}/>)
    
      const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", tokenMsg);

      const apiMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {data:[{id:1,type:"dashboard",attributes:{id:1,title:"Dashboard_title_1",value:1,created_at:"2021-03-08T17:10:08.139Z",updated_at:"2021-03-08T17:10:08.139Z"}},{id:2,type:"dashboard",attributes:{id:2,title:"Dashboard 5",value:5,created_at:"2021-03-08T17:10:36.867Z",updated_at:"2021-03-08T17:10:36.867Z"}}]})
      runEngine.sendMessage("Unit Test", apiMsg);
      let menubtn = dashboardWrapper.findWhere((node) => node.prop('testID') === 'menu_open');
      menubtn.simulate('press');
      fireEvent.press(screen.getByTestId("profile_click"));
      fireEvent.press(screen.getByTestId("Privacy_click"));
     
      fireEvent.press(screen.getByTestId("contactus_click"));
     
      fireEvent.press(screen.getByTestId("logout_click"));

      fireEvent.press(screen.getByTestId("logout_click1"));

      instance.proceedToDel()
      instance.getDelAccApiCallIdRes({message:"Success", data:[]})
     
      expect(dashboardWrapper).toBeTruthy();
   
    });

    then("HR Dashboard will display notifcation if no messages", () => {
      const apiNoItemsMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiNoItemsMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {data:[]})
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      expect(dashboardWrapper).toBeTruthy();
    });

    then("HR Dashboard will display notifcation if API failure", () => {
      const apiNoItemsMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiNoItemsMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {data:[]})
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      const apiErrorResponceMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiErrorResponceMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {errors:"Error"})
      runEngine.sendMessage("Unit Test", apiErrorResponceMsg);

      const apiFailedErrorResponceMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      runEngine.sendMessage("Unit Test", apiFailedErrorResponceMsg);
      
      expect(dashboardWrapper).toBeTruthy();
       });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(dashboardWrapper).toBeTruthy();
     });

  });
});
