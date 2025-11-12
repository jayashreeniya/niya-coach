// @ts-nocheck
import { defineFeature, loadFeature } from 'jest-cucumber'
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'

import React from 'react'
import Appointments from '../../src/Appointments'
import AddAppointment from '../../src/AddAppointment'
import { FlatList,BackHandler } from "react-native";

const navigation = require('react-navigation')

import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from '../../../../framework/src/Message'
export const configJSON = require('../../config.json')
import MessageEnum, {
  getName
} from '../../../../framework/src/Messages/MessageEnum'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import moment from 'moment'
const screenProps = {
  navigation: {
    navigate:jest.fn(),
    goBack:jest.fn(),
    addListener:jest.fn()
   
},
  id: 'Appointments'
}

const mockApICall = (instance: any, apiCallID: string, apiData: object,) => {
  const msgSuccessRestAPI = new Message(getName(MessageEnum.RestAPIResponceMessage))
  msgSuccessRestAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), msgSuccessRestAPI.messageId);
  msgSuccessRestAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), apiData);
  instance[apiCallID] = msgSuccessRestAPI.messageId
  runEngine.sendMessage("Unit Test", msgSuccessRestAPI)
}


const screenPropsForAddAppointment = {
  navigation: {
    navigate:jest.fn(),
    goBack:jest.fn(),
    addEventListener:jest.fn()
   
},
  id: 'AddAppointments'
}

const feature = loadFeature(
  './__tests__/features/appointments-scenario.feature'
)
jest.useFakeTimers();
const testData = [
  {
    from: '12:00 AM',
    to: '12:59 AM',
    booked_status: false,
    sno: '1'
  }
]
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

const coachListData =   {data: [
  {
      "id": "147",
      "type": "check_coach_availability",
      "attributes": {
          "id": 147,
          coach_details: {
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
              "languages": "Hindi Tamil",
              "city": "Calcutta",
              "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBZQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--81efa2fb205d0139b5b54f3c22f40e73205a255c/profile.jpg"
          },
          "timeslots": [
            {
              "to": "12:14 PM",
              "sno": "5",
              "from": "12:00 PM",
              "booked_status": false
          }
          ]
      }
  }
]}

defineFeature(feature, test => {
  jest.mock( 'react-native',() => ({
    BackHandler: {mockOnBackPress: jest.fn()}
    })
);
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('react-native', () => ({ Platform: { OS: 'web' } }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web')
    jest.spyOn(global, 'setTimeout');
 
  })
  afterEach(()=>{

    jest.runOnlyPendingTimers()

  })

  test('User navigates to appointments', ({ given, when, then }) => {
    let AppointmentsWrapper: ShallowWrapper
    let instance: Appointments

    given('I am a User loading appointments', () => {
      AppointmentsWrapper = shallow(<Appointments {...screenProps} />)
    })

    when('I navigate to the appointments', () => {
      instance = AppointmentsWrapper.instance() as Appointments
      instance.componentDidMount();
      instance.getToken()


      BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.navigate("HomePage"); 
      return true
      });
      let layout={ layout: {
        width: 520,
        height: 70.5,
        x: 0,
        y: 42.5
    },
    target: 1127
     }
     instance.onLayout({nativeEvent:layout})
      instance.schdeuleCallProps.onPress();
      instance.backbtnPressProps.onPress();
      instance.onValuesChangeFinish(10);
      instance.onValuesChangeFinish(20);
      instance.DateChange(new Date());
      const tokenMsg: Message = new Message(
        getName(MessageEnum.SessionResponseMessage)
      )
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), 'TOKEN')
      runEngine.sendMessage('Unit Test', tokenMsg)
      
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
      instance.getAppointmentsListApiCallId = getAppointmentsListAPI.messageId
      runEngine.sendMessage('Unit Test', getAppointmentsListAPI)
      instance.setState({appointmentsList:data});

      const getAppointmentsErrorListAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      )
      getAppointmentsErrorListAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), getAppointmentsErrorListAPI.messageId);
       
      getAppointmentsErrorListAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "errors": [
            {
                "booking_date": "No booking for this date"
            }
        ]
        }
      )
      instance.getAppointmentsListApiCallId = getAppointmentsErrorListAPI.messageId
      runEngine.sendMessage('Unit Test', getAppointmentsErrorListAPI)
      instance.getList({index:0,item:data[0]});
      instance.setState({showId:data[0].attributes.id})
      instance.renderImgBasedOnRating(0)
      instance.renderImgBasedOnRating(1)
      instance.renderImgBasedOnRating(3)
      instance.renderImgBasedOnRating(4)
      instance.renderImgBasedOnRating(6)
      instance.renderExpandableList(data[0].attributes.coach_details.expertise,data[0].attributes.id,data[0].attributes.coach_details.full_name,data[0].attributes.coach_details.education);
      instance.renderHideExpList(data[0].attributes.coach_details.expertise,data[0].attributes.id)
      instance.renderShowExpListIds(data[0].attributes.coach_details.expertise,data[0].attributes.id)
      instance.showDataonLeng("San Francisco")
      instance.showDataonLeng("NYC")
      instance.setState({date: null}, ()=> instance.returnDate())
 
      const addAppointmentsListAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      )
      addAppointmentsListAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), addAppointmentsListAPI.messageId);
       
      addAppointmentsListAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "data": []
        }
      )
      instance.addAppointmentApiCallId = addAppointmentsListAPI.messageId
      runEngine.sendMessage('Unit Test', addAppointmentsListAPI)
     
      const addAppointmentsErrAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      )
      addAppointmentsErrAPI.addData(getName(MessageEnum.RestAPIResponceDataMessage), addAppointmentsErrAPI.messageId);
       
      addAppointmentsErrAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          "errors": []
        }
      )
      instance.addAppointmentApiCallId = addAppointmentsErrAPI.messageId
      runEngine.sendMessage('Unit Test', addAppointmentsErrAPI)
        instance.setState({selected_date:"",start_time:"",end_time:"",checked:""});
       instance.addAppointment();
   
    })

    then('I can select the date and time', () => {
      let datePickerComponent = AppointmentsWrapper.findWhere(
        node => node.prop('testID') === 'txtInputAvailableDate'
      )
      datePickerComponent.simulate('dateChange', instance.state.available_date);
   
    })

    then('appointments will load with out errors', () => {
      expect(AppointmentsWrapper).toBeTruthy()
      const {loadMoreAppointments, handleScroll: mockHandleScroll, setState: mockValue} = instance;
      mockValue({ loading: false });
      mockHandleScroll({
        nativeEvent: {
          contentOffset: {
            y: 74
          },
          contentSize: {
            height: 488
          },
          layoutMeasurement: {
            height: 413
          },
        }
      })
      loadMoreAppointments();
    })

    then('I will book appointments with out errors', () => {
      instance.setState({isSlotModal:true})
      let buttonComponent = AppointmentsWrapper.findWhere(
        node => node.prop('testID') === 'bookAppointment'
      )
      buttonComponent.simulate('press')

    })

    then('I can leave the screen with out errors', () => {
      instance.componentWillUnmount()
      expect(AppointmentsWrapper).toBeTruthy()
    })
  })

  test('User navigates to addappointment', ({ given, when, then }) => {
    let AddAppointmentWrapper: ShallowWrapper
    let instance: AddAppointment

    given('I am a User loading addappointment', () => {
      AddAppointmentWrapper = shallow(
        <AddAppointment {...screenPropsForAddAppointment} />
      )
    })

    when('I navigate to the addappointment', () => {
      instance = AddAppointmentWrapper.instance() as AddAppointment;
    
    })

    then('I can select the date and time', () => {
      
      let datePickerComponent = AddAppointmentWrapper.findWhere(
        node => node.prop('testID') === 'txtInputAvailableDate'
      )
      datePickerComponent.simulate('dateChange', '01/12/21')

      datePickerComponent = AddAppointmentWrapper.findWhere(
        node => node.prop('testID') === 'txtInputAvaialblefrom'
      )
      datePickerComponent.simulate('dateChange', '01:00 AM')

      datePickerComponent = AddAppointmentWrapper.findWhere(
        node => node.prop('testID') === 'txtInputAvailableTo'
      )
      datePickerComponent.simulate('dateChange', '02:00 AM')
      
     
    })

    then('I can click the button', () => {
      let buttonComponent = AddAppointmentWrapper.findWhere(
        node => node.prop('testID') === 'hideKeyboard'
      )
      buttonComponent.simulate('press')

      buttonComponent = AddAppointmentWrapper.findWhere(
        node => node.prop('testID') === 'btnNavigateToAppointments'
      )
      buttonComponent.simulate('press')

      buttonComponent = AddAppointmentWrapper.findWhere(
        node => node.prop('testID') === 'btnAddAppointment'
      )
      buttonComponent.simulate('press')
    })

    then('appointment will be added with out errors', () => {
      expect(AddAppointmentWrapper).toBeTruthy()
    })

    then('I can leave the screen with out errors', () => {
      instance.componentWillUnmount()
      expect(AddAppointmentWrapper).toBeTruthy()
    })
  })


  
  test('User navigates to addappointment screen',({given,when,then})=>{
    let AppointmentWrapper: ShallowWrapper
    let instance: Appointments
    given('I am a User loading addappointment screen', () => {
      AppointmentWrapper = shallow(
        <Appointments {...screenProps} />
      )
    })
    when('I navigate to the addappointment screen', () => {
      instance = AppointmentWrapper.instance() as AddAppointment;
    })
    then('I can see the addappointment Screen without errors',()=>{
        const DateTimePickerComponent = AppointmentWrapper.find('DateTimePicker')
        expect(DateTimePickerComponent.props().mode).toBe('time')
    })
    when('I select the Time in DateTimePicker',()=>{
      const DateTimePickerComponent = AppointmentWrapper.find('DateTimePicker')
      DateTimePickerComponent.simulate("select", moment('10:00', "hh:mm A"))
    })
    then('I can see the Time in appointment Screen',()=>{
      const DateTimePickerComponent = AppointmentWrapper.find('DateTimePicker')
      expect(DateTimePickerComponent.props().sliderTime).toBe('6:00 AM')
    })
    when('Page is loading time network call is happen', () => {
      mockApICall(instance, "getAppointmentsListApiCallId", coachListData)
    })
    then('I can see the coach data',()=>{
    })

    when('I change time by MultiSlider',()=>{
      const multiSlider = AppointmentWrapper.find(MultiSlider);
      multiSlider.prop('onValuesChangeFinish')(8.25);
      multiSlider.prop('onValuesChangeFinish')(8.50);
      multiSlider.prop('onValuesChangeFinish')(8.75);
    })
    then('I can see the Time in appointment screen',()=>{
      const { setState: setValue } = instance;
      setValue({ shownisconfirmmsg: true })
      const DateTimePickerComponents = AppointmentWrapper.find('DateTimePicker')
      expect(DateTimePickerComponents.props().sliderTime).toBe('08:45 AM')
    })
  })

})
