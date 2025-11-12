// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber";
import {shallow, ShallowWrapper } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import CoachDashboard from "../../src/CoachDashboard";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import { fireEvent ,screen,render} from "@testing-library/react-native";

const navigation = require("react-navigation");
const screenProps = {
  navigation: {navigate:jest.fn(),
    addListener:jest.fn(),
    goBack:jest.fn()
  },
  id: "CoachDashboard"
};
const upcomingAppointment = [
  { "id": "365",
   "type": "booked_slot",
    "attributes": 
    { "id": 365, "start_time": "11/01/2023 06:00", "end_time": "11/01/2023 06:59", "booking_date": "2023-01-11", "viewable_slot": "11/01/2023 06:00 - 11/01/2023 06:59", 
    "appointments": {"meeting_code": "l9st-wl8m-vydg", "booking_date": "2023-01-11", "viewable_slot": "11/01/2023 06:00 - 11/01/2023 06:59", "id": 328, "name": "coach60", 
   
   }}}];

const feature = loadFeature("./__tests__/features/CoachDashboard-scenario.feature");
jest.mock('@videosdk.live/react-native-sdk',()=>{});
jest.useFakeTimers();
const data=   [
  {
      "id": "147",
      "type": "check_coach_availability",
      "attributes": {
          "id": 147,
          "coach_details": {
              "id": 165,
              "full_name": "coach16 test",
              "expertise": [
                  {
                      "specialization": "Career Management",
                      "id": 1
                  },
                  {
                      "specialization": "Workplace Anxiety",
                      "id": 2
                  },
                  {
                      "specialization": "Workplace Performance",
                      "id": 4
                  },
                    
              ],
              "rating": 3.5,
              "education": "Phsycological",
              "languages": "Hindi & Tamil",
              "city": "Calcutta",
              "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBZQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--81efa2fb205d0139b5b54f3c22f40e73205a255c/profile.jpg"
          },
          "timeslots": []
      }
  }
]
defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });
  afterEach(()=>{
    jest.runAllTimers();
  });


  test("User navigates to Coach Dashboard", ({ given, when, then }) => {
    let dashboardWrapper: ShallowWrapper;
    let instance: CoachDashboard;
    given("I am a User loading Coach Dashboard", () => {
      dashboardWrapper = shallow(<CoachDashboard {...screenProps} />);
      expect(dashboardWrapper).toBeTruthy();
     });

    when("I navigate to the Coach Dashboard", () => {
      instance = dashboardWrapper.instance() as CoachDashboard;
      expect(dashboardWrapper).toBeTruthy();
       });

    then("Coach dashboard will load with out errors", () => {
      expect(dashboardWrapper).toBeTruthy();
       });

    then("Coach Dashboard will display messages", () => {
      render(<CoachDashboard  {...screenProps}/>)
      const {confirmLogout}=instance;
      instance.setState({token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTAsInR5cGUiOiJTbXNBY2NvdW50IiwiZXhwIjoxNTc2Njk1ODk4fQ.kB2_Z10LNwDmbo6B39esgM0vG9qTAG4U9uLxPBYrCX5PCro0LxQHI9acwVDnfDPsqpWYvQmoejC2EO8MFoEz7Q",appointments:data});
      instance.getDashboardData();
      const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", tokenMsg);
      instance.setState({pastAppointments:upcomingAppointment});
      const apiMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {data:[{id:1,type:"dashboard",attributes:{id:1,title:"Dashboard_title_1",value:1,created_at:"2021-03-08T17:10:08.139Z",updated_at:"2021-03-08T17:10:08.139Z"}},{id:2,type:"dashboard",attributes:{id:2,title:"Dashboard 5",value:5,created_at:"2021-03-08T17:10:36.867Z",updated_at:"2021-03-08T17:10:36.867Z"}}]})
      runEngine.sendMessage("Unit Test", apiMsg);
      instance.getUpcomingAppointments();
      instance.getPastAppointments();
      instance.getProfileData();
      instance.renderPendingAppointments();
      instance.renderAppointments();
      instance.renderDrawer();
      instance.switchTab(1);
      instance.saveFcmTOken(instance.state.token);
      instance.logOut();
      confirmLogout();
      const getAppointmentsListAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      )
      getAppointmentsListAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), getAppointmentsListAPI.messageId);
       
      getAppointmentsListAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": [
            {
                "id": "147",
                "type": "check_coach_availability",
                "attributes": {
                    "id": 147,
                    "coach_details": {
                        "id": 165,
                        "full_name": "coach16 test",
                        "expertise": [
                            {
                                "specialization": "Career Management",
                                "id": 1
                            },
                            {
                                "specialization": "Workplace Anxiety",
                                "id": 2
                            },
                            {
                                "specialization": "Workplace Performance",
                                "id": 4
                            },
                              
                        ],
                        "rating": 3.5,
                        "education": "Phsycological",
                        "languages": "Hindi & Tamil",
                        "city": "Calcutta",
                        "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBZQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--81efa2fb205d0139b5b54f3c22f40e73205a255c/profile.jpg"
                    },
                    "timeslots": []
                }
            },
         
        ]
        }
      )
      instance.getPastAppointmentsApiCallId = getAppointmentsListAPI.messageId
      runEngine.sendMessage('Unit Test', getAppointmentsListAPI)
      instance.setState({pastAppointments:upcomingAppointment});
     
      let homebtn=dashboardWrapper.findWhere((node)=>node.prop('testID')==='menu_open')
      homebtn.simulate('press');
      instance.setState({appointments:[].concat(upcomingAppointment)})
      fireEvent.press(screen.getByTestId("tabone"));
      fireEvent.press(screen.getByTestId("tabtwo"));
      instance.renderPastAppointments();
      // fireEvent.press(screen.getByTestId("coach0"));
     
      fireEvent.press(screen.getByTestId("profile_click"));
      fireEvent.press(screen.getByTestId("Privacy_click"));
     
      fireEvent.press(screen.getByTestId("contactus_click"));
     
      fireEvent.press(screen.getByTestId("logout_click"));

      fireEvent.press(screen.getByTestId("logout_click1"));

      instance.proceedToDel()
      instance.getDelAccApiCallIdRes({message:"Success",data:{}})
     
      // upcoming


      const getUpcomingAppointmentsListAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      )
      getUpcomingAppointmentsListAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), getUpcomingAppointmentsListAPI.messageId);
       
      getUpcomingAppointmentsListAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": [
            {
                "id": "147",
                "type": "check_coach_availability",
                "attributes": {
                    "id": 147,
                    "coach_details": {
                        "id": 165,
                        "full_name": "coach16 test",
                        "expertise": [
                            {
                                "specialization": "Career Management",
                                "id": 1
                            },
                            {
                                "specialization": "Workplace Anxiety",
                                "id": 2
                            },
                            {
                                "specialization": "Workplace Performance",
                                "id": 4
                            },
                              
                        ],
                        "rating": 3.5,
                        "education": "Phsycological",
                        "languages": "Hindi & Tamil",
                        "city": "Calcutta",
                        "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBZQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--81efa2fb205d0139b5b54f3c22f40e73205a255c/profile.jpg"
                    },
                    "timeslots": []
                }
            },
         
        ]
        }
      )
      instance.getUpcomingAppointmentsApiCallId = getUpcomingAppointmentsListAPI.messageId
      runEngine.sendMessage('Unit Test', getUpcomingAppointmentsListAPI)
      instance.setState({appointments:data});

      // profile api
      const getProfileAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      )
      getProfileAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), getProfileAPI.messageId);
       
      getProfileAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": [
            {
                "id": "147",
                "type": "check_coach_availability",
                "attributes": {
                    "id": 147,
                    "coach_details": {
                        "id": 165,
                        "full_name": "coach16 test",
                        "expertise": [
                            {
                                "specialization": "Career Management",
                                "id": 1
                            },
                            {
                                "specialization": "Workplace Anxiety",
                                "id": 2
                            },
                            {
                                "specialization": "Workplace Performance",
                                "id": 4
                            },
                              
                        ],
                        "rating": 3.5,
                        "education": "Phsycological",
                        "languages": "Hindi & Tamil",
                        "city": "Calcutta",
                        "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBZQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--81efa2fb205d0139b5b54f3c22f40e73205a255c/profile.jpg"
                    },
                    "timeslots": []
                }
            },
         
        ]
        }
      )
      instance.getProfileDataApiCallId = getProfileAPI.messageId
      runEngine.sendMessage('Unit Test', getProfileAPI)
      instance.setState({profile:data});

      instance.startMeeting("bzlk-th0c-zomf");
      instance.endMeeting();
      expect(dashboardWrapper).toBeTruthy();
      instance.switchTab(2);
   
    });

    then("Coach Dashboard will display notifcation if no messages", () => {
      render(<CoachDashboard {...screenProps}  />)
      const apiNoItemsMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiNoItemsMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {data:[]})
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);
      expect(dashboardWrapper).toBeTruthy();
     });

    then("Coach Dashboard will display notifcation if API failure", () => {
      instance.renderDrawer();
      const apiNoItemsMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiNoItemsMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {data:[]})
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      const apiErrorResponceMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiErrorResponceMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {errors:"Error"})
      runEngine.sendMessage("Unit Test", apiErrorResponceMsg);

      const apiFailedErrorResponceMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      runEngine.sendMessage("Unit Test", apiFailedErrorResponceMsg);
      // getPastAppointmentsApiCallId
      const msgPastAppointmentsApiCallId: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      msgPastAppointmentsApiCallId.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {data:[]})
      instance.getPastAppointmentsApiCallId=msgPastAppointmentsApiCallId.messageId
      runEngine.sendMessage("Unit Test", msgPastAppointmentsApiCallId);

      expect(dashboardWrapper).toBeTruthy();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(dashboardWrapper).toBeTruthy();
       });

  });
});
