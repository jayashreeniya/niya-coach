// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper,mount } from "enzyme";
import * as helpers from "../../../../framework/src/Helpers";
import React from "react";
import HomePage from "../../src/HomePage";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import MessageEnum, {
  getName
} from "../../../../framework/src/Messages/MessageEnum";
import { Platform } from "react-native";
import moment from "moment";
import * as yup from "yup";
const navigation = require("react-navigation");
const screenProps = {
  navigation: {
    navigate: jest.fn(),
    addListener: ('willFocus', () => {

    }),
    goBack: jest.fn(),

  },
  id: "HomePage"
};
jest.mock('@videosdk.live/react-native-sdk', () => {

});
jest.mock('react-native-track-player',()=>{
  const TrackPlayer = {
      seekTo:jest.fn(),
      pause:jest.fn(),
  }
  return TrackPlayer
})
jest.mock('react-native-orientation-locker', () => ({
  lockToPortrait: jest.fn(),
}));
jest.mock('yup', () => {
  const originalYup = jest.requireActual('yup');

  return {
    ...originalYup,
    string: () => ({
      strict: jest.fn().mockImplementation(()=> ({
        
      })),
      test: jest.fn().mockImplementation((type: string, desc: string, callbackFn: Function) => {
        callbackFn("   ");
        return ({
          strict: () => ({
            min: () => ({
              max: () => ({
                required: () => {}
              })
            }),
          })
        })
      }),
    }),
    object: () => ({
      shape: () => ({
        fields: {
          title: {
            validate: jest.fn((value) => {
              if (!value || value.trim().length === 0) {
                return 'The title cannot be empty';
              }
              if (value.length > 50) {
                return 'The title name cannot exceed 50 characters';
              }
              if (value.length < 3) {
                return 'The title needs to be at least 3 characters';
              }
              
              return true;
            }),
          },
        },
      }),
    }),
  };
});
const responseJson = {
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
}
const data = {
  "id": "378",
  "type": "booked_slot",
  "attributes": {
    "id": 378,
    "start_time": "12/01/2023 08:00",
    "end_time": "12/01/2023 08:59",
    "booking_date": "2023-01-12",
    "viewable_slot": "12/01/2023 08:00 - 12/01/2023 08:59",
    "coach_details": {
      "id": 378,
      "full_name": "coach11",
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
          "specialization": "Leadership Issues",
          "id": 3
        },
        {
          "specialization": "Workplace Performance",
          "id": 4
        },
        {
          "specialization": "Work Life Balance",
          "id": 5
        },
        {
          "specialization": "Workplace communication",
          "id": 6
        },
        {
          "specialization": "Workplace Conflict",
          "id": 7
        },
        {
          "specialization": "Diversity and Inclusion At work",
          "id": 8
        },
        {
          "specialization": "Workplace Relationships",
          "id": 10
        },
        {
          "specialization": "Professional Development",
          "id": 11
        },
        {
          "specialization": "Toxic Work environment",
          "id": 12
        },
        {
          "specialization": "Toxic Leadership",
          "id": 13
        },
        {
          "specialization": "Workplace Bullying",
          "id": 14
        },
        {
          "specialization": "Gender Identity Issues",
          "id": 15
        },
        {
          "specialization": "Cultural Identity issues",
          "id": 16
        },
        {
          "specialization": "Trauma",
          "id": 17
        },
        {
          "specialization": "Grief",
          "id": 18
        },
        {
          "specialization": "Self Esteem",
          "id": 19
        },
        {
          "specialization": "Existential issues",
          "id": 20
        },
        {
          "specialization": "OCD",
          "id": 21
        },
        {
          "specialization": "ADHD",
          "id": 22
        },
        {
          "specialization": "Autism spectrum",
          "id": 23
        },
        {
          "specialization": "Clinical",
          "id": 24
        },
        {
          "specialization": "Relationship Issues",
          "id": 25
        },
        {
          "specialization": "Parenting problems",
          "id": 26
        },
        {
          "specialization": "Pregnancy problems",
          "id": 27
        },
        {
          "specialization": "Family issues",
          "id": 28
        },
        {
          "specialization": "Marital Confilct",
          "id": 29
        },
        {
          "specialization": "Abusive Relationships",
          "id": 30
        },
        {
          "specialization": "Role Conflict",
          "id": 9
        }
      ],
      "rating": null,
      "education": null,
      "languages": "",
      "city": null,
      "image": null
    },
    "meeting_code": "bzlk-th0c-zomf",
    "meeting_token": "eyJhbGciOiJIUzI1NiJ9.eyJhcGlrZXkiOiI0YzkwZWUwOS0xMjRmLTRjMjktYjkyZS00NzVlOTBlMDBiMjQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIiwiYWxsb3dfbW9kIiwiYXNrX2pvaW4iXX0.3URufcS0zoLE6Emo9BLUZqF6hvfoqWor6QJDvIJtwRQ"
  }
}
const moods=[
  
      {
          "id": "1",
          "type": "motion",
          "attributes": {
              "motion_title": "great"
          }
      },
      {
          "id": "2",
          "type": "motion",
          "attributes": {
              "motion_title": "good"
          }
      },
      {
          "id": "4",
          "type": "motion",
          "attributes": {
              "motion_title": "bad"
          }
      },
      {
          "id": "5",
          "type": "motion",
          "attributes": {
              "motion_title": "terrible"
          }
      },
      {
          "id": "3",
          "type": "motion",
          "attributes": {
              "motion_title": "okayish"
          }
      },
      {
          "id": "7",
          "type": "motion",
          "attributes": {
              "motion_title": "okaish"
          }
      }
  ];
const goalApiData ={data:{attributes:{
  current_goals:[
    {"date": "2024-06-19T07:39:53.690Z", "focus_area_id": 57, "goal": "abcddd", "id": 555, "is_complete": false, "time_slot": "10:07 AM"},
    {"date": "2024-07-19T07:39:53.690Z", "focus_area_id": 57, "goal": "abcddd", "id": 555, "is_complete": false, "time_slot": "10:07 AM"},
  ],
  completed_goals:[{"date": "2024-06-19T07:39:53.690Z", "focus_area_id": 57, "goal": "abcddd", "id": 555, "is_complete": false, "time_slot": "10:07 AM"}]
}}}
const apiResponse = {
  data:[
    {"attributes": {"action_item": "gfhdjd", 
    "date": "2024-06-18T00:00:00.000Z", 
    "is_complete": false, "time_slot": "10:56 am"
  }, "id": "573", "type": "action_item"}]}
const flatItemData = {
  "index": 0, 
"item": data
}

  const mockAPICall = (instance: any, apiCallID: string, apiData: any) => {
    const msgSucessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
    msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSucessRestAPI.messageId);
    msgSucessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), apiData);
    instance[apiCallID] = msgSucessRestAPI.messageId
    runEngine.sendMessage("Unit Test", msgSucessRestAPI)
  }

const feature = loadFeature("./__tests__/features/HomePage-scenario.feature");
const current_actions = [{ "id": "152", "type": "action_item", "attributes": { "action_item": "new item to check edit and edited one more time edited", "date": "2022-12-10T00:00:00.000Z", "time_slot": "12:00 pm", "complete": true } }, { "id": "150", "type": "action_item", "attributes": { "action_item": "focus on my work added from postman", "date": "2022-12-08T00:00:00.000Z", "time_slot": "03:15 PM", "complete": true } }, { "id": "148", "type": "action_item", "attributes": { "action_item": "action itm edited ", "date": "2022-12-09T00:00:00.000Z", "time_slot": "10:00 am", "complete": null } }, { "id": "138", "type": "action_item", "attributes": { "action_item": "jkljlklk", "date": "2022-12-06T00:00:00.000Z", "time_slot": "10:00 am", "complete": true } }, { "id": "136", "type": "action_item", "attributes": { "action_item": "first action item", "date": "2022-12-06T00:00:00.000Z", "time_slot": "12:00 pm", "complete": null } }, { "id": "132", "type": "action_item", "attributes": { "action_item": "test1", "date": "2022-12-05T00:00:00.000Z", "time_slot": "10:00 am", "complete": null } }, { "id": "100", "type": "action_item", "attributes": { "action_item": "new item 123", "date": "2022-11-03T00:00:00.000Z", "time_slot": null, "complete": null } }, { "id": "99", "type": "action_item", "attributes": { "action_item": "my first time 1", "date": "2022-11-30T00:00:00.000Z", "time_slot": "10:00 am", "complete": null } }, { "id": "97", "type": "action_item", "attributes": { "action_item": "testing 123", "date": "2022-10-19T00:00:00.000Z", "time_slot": "10:00 am", "complete": null } }, { "id": "76", "type": "action_item", "attributes": { "action_item": "my new  action item", "date": "2022-10-26T00:00:00.000Z", "time_slot": "10:00 am", "complete": null } }, { "id": "75", "type": "action_item", "attributes": { "action_item": "my new item  11 oct", "date": "2022-10-11T00:00:00.000Z", "time_slot": "10:00 am", "complete": null } }, { "id": "74", "type": "action_item", "attributes": { "action_item": "cccccc", "date": "2022-10-11T00:00:00.000Z", "time_slot": "10:00 am", "complete": null } }, { "id": "68", "type": "action_item", "attributes": { "action_item": "my goal 567", "date": "2022-12-08T00:00:00.000Z", "time_slot": "10:00 am", "complete": null } }, { "id": "67", "type": "action_item", "attributes": { "action_item": "item123", "date": "2022-10-18T00:00:00.000Z", "time_slot": "10:00 am", "complete": null } }, { "id": "65", "type": "action_item", "attributes": { "action_item": "my 2nd action item", "date": "2022-10-11T00:00:00.000Z", "time_slot": "10:00 am", "complete": null } }, { "id": "64", "type": "action_item", "attributes": { "action_item": "my first action item", "date": "2022-10-11T00:00:00.000Z", "time_slot": "10:00 am", "complete": true } }]
const upcomingAppointment = [{ "id": "365", "type": "booked_slot", "attributes": { "id": 365, "start_time": "11/01/2023 06:00", "end_time": "11/01/2023 06:59", "booking_date": "2023-01-11", "viewable_slot": "11/01/2023 06:00 - 11/01/2023 06:59", "coach_details": { "id": 328, "full_name": "coach60", "expertise": [{ "specialization": "Abusive Relationships", "id": 30 }, { "specialization": "Role Conflict", "id": 9 }], "rating": null, "education": "", "languages": "", "city": "", "image": null }, "meeting_code": "l9st-wl8m-vydg", "meeting_token": null } }];
const files_actions = [{ "id": "152", "url": "https://conversations.twilio.com/v1/Conversations/CHc595cf0c0a2940238ec700bb65cee914/Messages/IMa6308699b492432f940307535e0d6099", "title":"title1","file_content":"flessa" }]

defineFeature(feature, test => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.doMock("react-native", () => ({ Platform: { OS: "android" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "android");

  });
  afterEach(() => {
  jest.runAllTimers();
  });

  test("User navigates to Home Page screen",({ given, when, then })=>{
    let HomePagedWrapperBolck: ShallowWrapper;
    let instance: HomePage;
    given("I am a User loading Home Page screen", () => {
      Platform.OS = "android"
      HomePagedWrapperBolck = shallow(
             <HomePage {...screenProps} />
    );
    });
    when("I navigate to the Home Page screen",()=>{
      instance = HomePagedWrapperBolck.instance() as HomePage;
      mockAPICall(instance, "getGoalBoardApiCallId", goalApiData);
      mockAPICall(instance,"getActionsApiCallId",apiResponse)
    })
    then("Home Page screen will load with out errors",()=>{
      const welcomeTextID = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'welcomeTextID');
      expect(welcomeTextID.props().children).toBe('Welcome')

    })
    when('I press on current goal item in home page',()=>{
      const currentGoalBtnIds = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'currentGoalBtnId1');
      currentGoalBtnIds.simulate('press') 
    })
    then('I can see the result in modal page',()=>{
      const currenGoalTextIDs = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'currenGoalTextID');
       expect(currenGoalTextIDs.props().style[1].textAlign).toBe('center')
    })
    when('I press on mark as completed button in modal',()=>{
      const goalMarkcompletedID = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'goalMarkcompletedID');
      goalMarkcompletedID.simulate('press') 
    })
    then('I can see the result in completed goal',()=>{
      const bookAppointmentsID = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'bookAppointmentsID');
      expect(bookAppointmentsID.props().children).toBe('Book Appointment')
    })
    when('I press on curren goal Item',()=>{
      const currentGoalBtnId = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'currentGoalBtnId0');
      currentGoalBtnId.simulate('press') 
    })
    then('I see the result Modal in home page',()=>{
      const currenGoalTextID = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'currenGoalTextID');
      expect(currenGoalTextID.props().children).toBe('Current Goals')
    })
    when('I press on curren goal next Modal',()=>{
      const CurrentGoalNextID = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'CurrentGoalNextID');
      CurrentGoalNextID.simulate('press') 
    })
    then('I can see the DatetimepickerModal',()=>{
      const currenGoaleDateTimeId = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'currenGoaleDateTimeId');
      expect(currenGoaleDateTimeId.props().mode).toBe('time')
    })
    when('I can select the time in DateTimePicker Modal',()=>{
      const currenGoaleDateTimeId = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'currenGoaleDateTimeId');
      currenGoaleDateTimeId.simulate('select')

    })
    then('I can see the selected time in modal',()=>{
      const currenGoaleDateTimeId = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'currenGoaleDateTimeId');
      expect(currenGoaleDateTimeId.props().sliderTime).toBe('10:07 AM')
    })
    when('I press on curren goal save button',()=>{ 
      const currengoalsaveBtn = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'currengoalsaveBtn');
      currengoalsaveBtn.simulate('press') 
    })
    then('I can see the update Time in curren goals',()=>{
      const currengoalsaveBtn = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'currengoalsaveBtn');
      expect(currengoalsaveBtn.props().children).toBe('Save')
})

    when('I press on current Action item',()=>{
      const currenActionBtn = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'currenActionBtn0');
      currenActionBtn.simulate('press')
    })
    then('I see the current Action time in Modal',()=>{
      const currenGoaleDateTimeId = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'currenGoaleDateTimeId');
      expect(currenGoaleDateTimeId.props().isSlider).toBe(false)
    })
    when('I send the appointment data in home page',()=>{
    })
    then('I see the appointment data in Home page',()=>{

    })
    when('I send the form data to modal',()=>{
      let formikList = HomePagedWrapperBolck.findWhere(
        (node) => node.prop("data-test-id") === "formicActionID")

      const wrapperFormik = shallow(formikList.props().children({
    values: {
      time: moment("10:00", "hh:mm"),
      date: new Date(),
      title: 'titkee'
    },
    touched: {},
    errors: {},
    validationSchema:yup.object().shape({
      title: yup
        .string()
        .test('not-only-spaces', 'The title cannot be empty', (value) => value && value.trim().length !== 0)
        .strict(true)
        .min(3, 'The title needs to be at least 3 char')
        .max(50, 'The title name cannot exceed 50 char')
        .required('The title is required') ,
    }),
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    setFieldValue: jest.fn(),
    handleReset: jest.fn(),
    handleBlur:jest.fn()
  }))
  formikList.props().onSubmit({
    title: 'titke e',
    time: moment("10:00", "hh:mm"),
    date: moment().subtract(1, 'day')
  })
  formikList.props().onSubmit({
    title: 'titke e',
    time: moment("10:00", "hh:mm"),
    date: moment()
  })
    })
    then('I see the values in modal in home page',()=>{
      let formikList = HomePagedWrapperBolck.findWhere(
        (node) => node.prop("data-test-id") === "formicActionID")
        expect(formikList.props().initialValues.title).toBe('gfhdjd')
    })
    when("I press on Add goal button in home page",()=>{
      const addActionItemID = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'addActionItemID');
      addActionItemID.simulate('press')
    })
    then("I see the Add goal Text in modal",()=>{
      const addActionItemIDs = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'addActionItemID');
      expect(addActionItemIDs.props().children).toBe('Add Action Item +')
    })
    when("I press on Add action item button",()=>{
      let addformikList = HomePagedWrapperBolck.findWhere(
        (node) => node.prop("data-test-id") === "addformicActionID")
          addformikList.props().children({
          values: {
            title: 'titkee',
            time: moment("10:00", "hh:mm"),
            date: "2024-07-19T07:39:53.690Z",
          },
          touched: {},
          errors: {},
          handleChange: jest.fn(),
          handleSubmit: jest.fn(),
          setFieldValue: jest.fn(),
          handleReset: jest.fn(),
          handleBlur:jest.fn()
        })
        addformikList.props().onSubmit({
          title: 'titkee',
          time: moment("10:00", "hh:mm"),
          date: moment().subtract(1, 'day')
        })
        addformikList.props().onSubmit({
          title: 'titkee',
          time: moment("10:00", "hh:mm"),
          date: moment()
        })

      const addGoalBtnID = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'addGoalBtnID');
      addGoalBtnID.simulate('press')   
    })
    then("I see the Add action item text in modal",()=>{
      const addGoalBtnIDComponent = HomePagedWrapperBolck.findWhere((node) => node.prop('testID') === 'addGoalBtnID');
      expect(addGoalBtnIDComponent.props().children).toBe('Add Goals +')
    })

  })

  test("User navigates to Home Page", ({ given, when, then }) => {
      let HomePagedWrapper: ShallowWrapper;
      let instance: HomePage;
      given("I am a User loading Home Page", () => {
        HomePagedWrapper = shallow(<HomePage {...screenProps} />);
      expect(HomePagedWrapper).toBeTruthy();

    });

    when("I navigate to the Home Page", () => {
      instance = HomePagedWrapper.instance() as HomePage;
      expect(HomePagedWrapper).toBeTruthy();
      instance.setState({moodsList:moods,token: "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA", competeGoalModal: true, showActionModal: false, iscompeteGaol: true });
      instance.setState({ competeGoalModal: false, showActionModal: true, iscompeteGaol: false,appointmentData:upcomingAppointment});
      instance.componentDidMount();
      instance.getActions();
      instance.getFocusOn();
      instance.blurHandler();
      instance.getMoodList();
      instance.isFirstTimeUserAssesing();
      instance.setState({showId:101});
      
      instance.getList({item:upcomingAppointment[0],index:0});
   
      instance.renderExpandableList(upcomingAppointment[0].attributes.coach_details.expertise,upcomingAppointment[0].attributes.id,upcomingAppointment[0].attributes.coach_details.full_name,false,{item:upcomingAppointment[0]})
      instance.renderArticles();
      instance.renderAudio();
     
      instance.renderImgBasedOnRating(0);
      instance.renderImgBasedOnRating(1);
      instance.renderImgBasedOnRating(2);
      instance.renderImgBasedOnRating(3);
      instance.renderImgBasedOnRating(4);
      instance.renderImgBasedOnRating(5);
      instance.getGoalBoard(); 
      instance.getSuggestions();
      instance.getDataDataList();
      instance.setState({prifileimage:"img1ew.png"})
      instance.renderDrawer();
      instance.startMeeting("bzlk-th0c-zomf");
      instance.endMeeting();
      instance.blurHandler()
      instance.getToken();
      instance.setState({actionData:current_actions,actionLoader:false});
      instance.renderActions();
      instance.setState({articleData:files_actions,suggestionsLoader:false});
      instance.renderArticles();
      instance.setState({audioData:files_actions,suggestionsLoader:false});
      instance.renderAudio();
      instance.setState({videoData:files_actions,suggestionsLoader:false});
      instance.renderVideo();
      instance.adjustWhaleSlider(10)
      instance.adjustWhaleSlider(20)
      instance.adjustWhaleSlider(30)
      instance.adjustWhaleSlider(38)
      instance.adjustWhaleSlider(50)
      instance.adjustWhaleSlider(70)
      instance.adjustWhaleSlider(100)
      instance.renderDashboardFocuseAreaItems({
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
        }
      });
      instance.asessYourselfPressProps.onPress();
      instance.getMedia();
      instance.getVideos();
      instance.getArticles();
      instance.completeAction(101, { data: "m" })
      instance.toggleAudio();
      instance.pauseAudio();
      instance.toggleAudio("",true);
      instance.saveFcmTOken(instance.state.token);
      instance.getDataDataList();
      instance.getScores();
      instance.addGoal(101, { data: 'new' });
      instance.getInsights();
      instance.getSuggestions()
      instance.logOut()

    });

    then("Home Page will load with out errors", () => {
      instance.getUpcomingAppointmentsData();
      expect(HomePagedWrapper).toBeTruthy();
      const tokenMsg: Message = new Message(getName(MessageEnum.SessionResponseMessage));
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), "TOKEN");
      runEngine.sendMessage("Unit Test", tokenMsg);
      // get focus areas
      const apiMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        data: [{
          "id": "481",
          "type": "focus_area",
          "attributes": {
            "assesment_test_type_answers": [
              {
                "id": 98,
                "assesment_test_type_id": 11,
                "title": null,
                "answers": "Low Immunity",
                "test_type_id": null,
                "created_at": "2022-09-14T05:36:18.599Z",
                "updated_at": "2022-09-14T05:36:18.599Z"
              },
              {
                "id": 99,
                "assesment_test_type_id": 11,
                "title": null,
                "answers": "Lifestyle Diseases ",
                "test_type_id": null,
                "created_at": "2022-09-14T05:36:18.600Z",
                "updated_at": "2022-09-14T05:36:18.600Z"
              }
            ]
          }
        }]
      })
      instance.getfocusAreaApiCallId = apiMsg.messageId

      runEngine.sendMessage("Unit Test", apiMsg);
      instance.setState({ focusAreaData: [].concat(responseJson), insightsLoader: false })
      

      //  get upcoming appointments
      const apiAppointmentMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiAppointmentMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage),
        { data: upcomingAppointment })
      instance.getAppointmentApicallId = apiAppointmentMsg.messageId
      instance.setState({ appointmentData: upcomingAppointment });
      runEngine.sendMessage("Unit Test", apiAppointmentMsg);

      //  current Action
      const apiActionitemMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiActionitemMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage),
        { data: current_actions })
      instance.getActionsApiCallId = apiActionitemMsg.messageId

      runEngine.sendMessage("Unit Test", apiActionitemMsg);
      expect(HomePagedWrapper).toBeTruthy();

    });

    then("Home Page will display data", () => {
      let menubtn = HomePagedWrapper.findWhere((node) => node.prop('testID') === 'menu_open');
      menubtn.simulate('press');
      let AssessbtnPress = HomePagedWrapper.findWhere((node) => node.prop('testID') === 'Assessbtn');
      AssessbtnPress.simulate('press');
      let wellBeingbtn = HomePagedWrapper.findWhere((node) => node.prop('testID') === 'wellBeingPess');
      wellBeingbtn.simulate('press');
      let Appointmentbtn = HomePagedWrapper.findWhere((node) => node.prop('testID') === 'AppointmentsPess');
      Appointmentbtn.simulate('press');

       let JourneyDashbtn = HomePagedWrapper.findWhere((node) => node.prop('testID') === 'JourneyDashpress');
      JourneyDashbtn.simulate('press');
       instance.setState({iscompeteGaol:true});
      instance.renderArticles();
      instance.renderAudio();
      instance.renderVideo();
      instance.pauseAudio();
      instance.beforeVideoCall();
      instance.stopAudio();
      instance.wellBeingAssessPessProps.onPress();
      instance.selectDuration();
      instance.toggleAddGoalModal();
      instance.txtInputGoalNamePrpos.onChangeText('txt');
      instance.txtInputEditGoalNamePrpos.onChangeText('tx');
      instance.btnNxtModal.onPress();
      instance.btnSubmitModal.onPress();
      instance.getGoaldata();
      instance.getCompetedGoaldata();
      instance.deleteGoal();
      instance.markasCompetGoalModal();
      instance.createAction("");
      instance.btnEditNxtModal.onPress();
      instance.setState({editgoalstepmodal:0,editgoal:""})
      instance.btnEditNxtModal.onPress();
      instance.setState({editgoalstepmodal:0,editgoal:"sds",goalCompetionDate:""})
      instance.btnEditNxtModal.onPress();
      instance.btnSaveCompeteGoalModal.onPress();
      instance.btnDeleteGoal.onPress();
      instance.btnMarkasCompeteGoal.onPress();
      instance.btnNxtModal.onPress();
      instance.setState({ checked: '232', goalstepmodal: 1 })
      instance.btnNxtModal.onPress();
      instance.setState({ checked: '232', goalstepmodal: 1, goalnm: 'namne fos' })
      instance.btnNxtModal.onPress();
      instance.setState({ checked: '232', goalstepmodal: 2, goalnm: 'namne fos', goalCompetionDate: "" })
      instance.btnNxtModal.onPress();
      instance.setState({checked:["1"]})
      instance.btChooseGaol(1,101);
      instance.setState({ checked: '232', goalstepmodal: 1, goalnm: 'namne fos', goalCompetionDate: "21-04-2023" })
      instance.btnNxtModal.onPress();
      instance.setState({goalstepmodal:1,goalnm:""})
      instance.setState({ checked: '232', goalstepmodal: 1, goalnm: '' })
      instance.btnSubmitModal.onPress();
      instance.onRefresh()
      instance.setState({  goalstepmodal: 2, goalCompetionDate: '',goalnm:"sd" })
      instance.btnSubmitModal.onPress();

      instance.setState({  goalstepmodal: 2, goalCompetionTime: '',goalnm:"sd",goalCompetionDate:"" })
      instance.btnSubmitModal.onPress();
      instance.onCancelPressbtn("",false)
      instance.onMeetingPress(false,"");
      instance.cancelBookingApiResponse("");
      instance.logOut()


    });

    then("Dashboard will display data", () => {
      const apiNoItemsMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiNoItemsMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), { data: [] })
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);


    });

    then("Dashboard will display notifcation if API failure", () => {

      const apiNoItemsMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiNoItemsMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), { data: [] })
      runEngine.sendMessage("Unit Test", apiNoItemsMsg);

      const apiErrorResponceMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      apiErrorResponceMsg.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), { errors: "Error" })
      runEngine.sendMessage("Unit Test", apiErrorResponceMsg);

      const apiFailedErrorResponceMsg: Message = new Message(getName(MessageEnum.RestAPIResponceMessage));
      runEngine.sendMessage("Unit Test", apiFailedErrorResponceMsg);


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
      instance.getfocusAreaApiCallId = msgLoadDataAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLoadDataAPI);

      // getAppointmentApicallId
      const msgAppointmentApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgAppointmentApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgAppointmentApicallId.messageId
      );
      msgAppointmentApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
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
        }
      );
      instance.getAppointmentApicallId = msgAppointmentApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgAppointmentApicallId);
      //  get Action Items

      const msgActionItemsApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgActionItemsApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgActionItemsApicallId.messageId
      );
      msgActionItemsApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "id": "147",
            "type": "check_coach_availability",

          }
        }
      );
      instance.getActionsApiCallId = msgActionItemsApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgActionItemsApicallId);

      // goal api
      const msgGoalItemsApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgGoalItemsApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgGoalItemsApicallId.messageId
      );
      msgGoalItemsApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "id": "147",
            "type": "check_coach_availability",

          }
        }
      );
      instance.getGoalApiCallId = msgGoalItemsApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgGoalItemsApicallId);

      // media 

      const msgMediaApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgMediaApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgMediaApicallId.messageId
      );
      msgMediaApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "id": "147",
            "type": "check_coach_availability",

          }
        }
      );
      instance.getMediaApiCallId = msgMediaApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgMediaApicallId);

      // getVdieos

      const msgVideoApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgVideoApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgVideoApicallId.messageId
      );
      msgVideoApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "id": "147",
            "type": "check_coach_availability",

          }
        }
      );
      instance.getVideosApiCallId = msgVideoApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgVideoApicallId);

      // getArticle
      const msgArticleApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgArticleApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgArticleApicallId.messageId
      );
      msgArticleApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "id": "147",
            "type": "check_coach_availability",

          }
        }
      );
      instance.getArticlesApiCallId = msgArticleApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgArticleApicallId);

      // AddGoal 
      const msgAddGoaApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgAddGoaApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgAddGoaApicallId.messageId
      );
      msgAddGoaApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "id": "147",
            "type": "check_coach_availability",

          }
        }
      );
      instance.addGoalApiCallId = msgAddGoaApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgAddGoaApicallId);

      // getcompeted goal
      const msgCompetedGoalApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgCompetedGoalApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgCompetedGoalApicallId.messageId
      );
      msgCompetedGoalApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "id": "147",
            "type": "check_coach_availability",

          }
        }
      );
      instance.getCompetedGoalApiCallId = msgCompetedGoalApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgCompetedGoalApicallId);

      // update goal
      const msgupdateGoalApiCallIdApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgupdateGoalApiCallIdApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgupdateGoalApiCallIdApicallId.messageId
      );
      msgupdateGoalApiCallIdApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "meta": { "message": "message" }

          }
        }
      );
      instance.updateGoalApiCallId = msgupdateGoalApiCallIdApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgupdateGoalApiCallIdApicallId);
      instance.getGoalBoard();
      // delete goal

      const msgDeleteeGoalApiCallIdApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgDeleteeGoalApiCallIdApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgDeleteeGoalApiCallIdApicallId.messageId
      );
      msgDeleteeGoalApiCallIdApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "message": { "message": "message" }

          }
        }
      );
      instance.deleteGoalApiCallId = msgDeleteeGoalApiCallIdApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgDeleteeGoalApiCallIdApicallId);
        instance.showAlert("Err","Messa");
      // create action 

      const msgcreateActApiCallIdApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgcreateActApiCallIdApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgcreateActApiCallIdApicallId.messageId
      );
      msgcreateActApiCallIdApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "meta": { "message": "message" }

          }
        }
      );
      instance.createActionApiCallId = msgcreateActApiCallIdApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgcreateActApiCallIdApicallId);

      // comleteAction

      const msgcomleteActionApiCallIdApicallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgcomleteActionApiCallIdApicallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgcomleteActionApiCallIdApicallId.messageId
      );
      msgcomleteActionApiCallIdApicallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "meta": { "message": "message" }

          }
        }
      );
      instance.completeActionApiCallId = msgcomleteActionApiCallIdApicallId.messageId;
      runEngine.sendMessage("Unit Test", msgcomleteActionApiCallIdApicallId);


      // getachievementApiCallId

      const msggetachievementApiCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msggetachievementApiCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msggetachievementApiCallId.messageId
      );
      msggetachievementApiCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "meta": { "message": "message" }

          }
        }
      );
      instance.getachievementApiCallId = msggetachievementApiCallId.messageId;
      runEngine.sendMessage("Unit Test", msggetachievementApiCallId);

      // getMoodsApiCallId
      const msgMoodsApiCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgMoodsApiCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgMoodsApiCallId.messageId
      );
      msgMoodsApiCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "attributes": { "motion_title": "great" }

          }
        }
      );
      instance.getMoodsApiCallId = msgMoodsApiCallId.messageId;
      runEngine.sendMessage("Unit Test", msgMoodsApiCallId);

      // getScoresApiCallId

      const msgScoresApiCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgScoresApiCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgScoresApiCallId.messageId
      );
      msgScoresApiCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "meta": { "message": "message" }

          }
        }
      );
      instance.getScoresApiCallId = msgScoresApiCallId.messageId;
      runEngine.sendMessage("Unit Test", msgScoresApiCallId);

      // getInsightsApiCallId

      const msggetInsightsApiCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msggetInsightsApiCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msggetInsightsApiCallId.messageId
      );
      msggetInsightsApiCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "meta": { "message": "message" }

          }
        }
      );

      instance.getInsightsApiCallId = msggetInsightsApiCallId.messageId;
      runEngine.sendMessage("Unit Test", msggetInsightsApiCallId);
      // 

      const msggetInsightsApiCallId1 = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msggetInsightsApiCallId1.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msggetInsightsApiCallId1.messageId
      );
      msggetInsightsApiCallId1.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "attributes": { "top_strength": "message", "focus_areas": "focus_areas" }

          }
        }
      );

      instance.getInsightsApiCallId = msggetInsightsApiCallId1.messageId;
      runEngine.sendMessage("Unit Test", msggetInsightsApiCallId1);




      // getGoalBoardApiCallId
      const msgGoalBoardApiCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgGoalBoardApiCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgGoalBoardApiCallId.messageId
      );
      msgGoalBoardApiCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "message": "message 123"
        }
      );
      instance.getGoalApiCallId = msgGoalBoardApiCallId.messageId;
      runEngine.sendMessage("Unit Test", msgGoalBoardApiCallId);

      // resonsdata

      const msgGoalBoardApiCallId1 = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgGoalBoardApiCallId1.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgGoalBoardApiCallId1.messageId
      );
      msgGoalBoardApiCallId1.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "attributes": { "current_goals": "message", "completed_goals": "completed_goals" }

          }
        }
      );
      instance.getGoalApiCallId = msgGoalBoardApiCallId1.messageId;
      runEngine.sendMessage("Unit Test", msgGoalBoardApiCallId1);

      // getSuggestionApiCallId
      const msgSuggestionApiCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgSuggestionApiCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgSuggestionApiCallId.messageId
      );
      msgSuggestionApiCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "meta": { "message": "message" }

          }
        }
      );
      instance.getSuggestionApiCallId = msgSuggestionApiCallId.messageId;
      runEngine.sendMessage("Unit Test", msgSuggestionApiCallId);


      // devicetokenApiCallId
      const msgdevicetokenApiCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgdevicetokenApiCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgdevicetokenApiCallId.messageId
      );
      msgdevicetokenApiCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "meta": { "message": "message" }

          }
        }
      );
      instance.devicetokenApiCallId = msgdevicetokenApiCallId.messageId;
      runEngine.sendMessage("Unit Test", msgdevicetokenApiCallId);

      // getvideocallApiCallId

      const msgvideocallApiCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgvideocallApiCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgvideocallApiCallId.messageId
      );
      msgvideocallApiCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "meta": { "message": "message2" }

          }
        }
      );
      instance.getvideocallApiCallId = msgvideocallApiCallId.messageId;
      runEngine.sendMessage("Unit Test", msgvideocallApiCallId);

      // apiDashboardItemCallId
      const msgapiDashboardItemCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgapiDashboardItemCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgapiDashboardItemCallId.messageId
      );
      msgapiDashboardItemCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "meta": { "message": "message2" }

          }
        }
      );
      instance.apiDashboardItemCallId = msgapiDashboardItemCallId.messageId;
      runEngine.sendMessage("Unit Test", msgapiDashboardItemCallId);

      // getGoalBoardApiCallId


      const msggetGoalBoardApiCallId = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msggetGoalBoardApiCallId.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msggetGoalBoardApiCallId.messageId
      );
      msggetGoalBoardApiCallId.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": {
            "meta": { "message": "message2" }

          }
        }
      );

      instance.getGoalBoardApiCallId = msggetGoalBoardApiCallId.messageId;
      runEngine.sendMessage("Unit Test", msggetGoalBoardApiCallId);
      instance.setState({ loading: false, goalData: [{ "data": "nm" }], completedGoalData: [{ "data": "nm" }] });

    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(HomePagedWrapper).toBeTruthy();
    });

  });

});
