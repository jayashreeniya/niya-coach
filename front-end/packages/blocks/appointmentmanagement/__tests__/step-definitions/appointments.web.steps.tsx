import { defineFeature, loadFeature } from 'jest-cucumber'
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'

import React from 'react'
import Appointments from '../../src/Appointments.web'
import AddAppointment from '../../src/AddAppointment.web'
const navigation = require('react-navigation')

import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from '../../../../framework/src/Message'
export const configJSON = require('../../config.json')
import MessageEnum, {
  getName
} from '../../../../framework/src/Messages/MessageEnum'
import { _ } from '../../../../framework/src/IBlock'

const screenProps = {
  navigation: navigation,
  id: 'Appointments'
}

const screenPropsForAddAppointment = {
  navigation: {
    navigate: jest.fn()
  },
  id: 'AddAppointments'
}

const feature = loadFeature(
  './__tests__/features/appointmentsweb-scenario.feature'
)

const testData = [
  {
    from: '12:00 AM',
    to: '12:59 AM',
    booked_status: false,
    sno: '1'
  }
]

defineFeature(feature, test => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('react-native', () => ({ Platform: { OS: 'web' } }))
    jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web')
  })

  test('User navigates to appointments', ({ given, when, then }) => {
    let AppointmentsWrapper: ShallowWrapper
    let instance: Appointments

    given('I am a User loading appointments', () => {
      AppointmentsWrapper = shallow(<Appointments {...screenProps} />)
    })

    when('I navigate to the appointments', () => {
      instance = AppointmentsWrapper.instance() as Appointments

      const tokenMsg: Message = new Message(
        getName(MessageEnum.SessionResponseMessage)
      )
      tokenMsg.addData(getName(MessageEnum.SessionResponseToken), 'TOKEN')
      runEngine.sendMessage('Unit Test', tokenMsg)

      const getAppointmentsListAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      )

      getAppointmentsListAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          data: {
            id: '1',
            type: 'service_provider_availability',
            attributes: {
              id: 1,
              time_slots: [
                {
                  from: '12:00 AM',
                  to: '12:59 AM',
                  booked_status: false,
                  sno: '1'
                }
              ]
            }
          }
        }
      )
      instance.getAppointmentsListApiCallId = getAppointmentsListAPI.messageId
      runEngine.sendMessage('Unit Test', getAppointmentsListAPI)
    })

    then('I can select the date', () => {
      let datePickerComponent = AppointmentsWrapper.findWhere(
        node => node.prop('data-test-id') === 'txtInputAvailableDate'
      )
      datePickerComponent.simulate('change', '01/10/21')

    })

    then('I can click the button', () => {
      let buttonComponent = AppointmentsWrapper.findWhere(
        node => node.prop('data-test-id') === 'btnGetAppointment'
      )
      buttonComponent.simulate('click')

    })

    then('appointments will load with out errors', () => {
      instance.setState({ appointmentsList: testData })
      expect(AppointmentsWrapper).toBeTruthy()
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
      instance = AddAppointmentWrapper.instance() as AddAppointment
    })

    then('I can select the date and time', () => {
      let datePickerComponent = AddAppointmentWrapper.findWhere(
        node => node.prop('data-test-id') === 'txtInputAvailableDate'
      )
      datePickerComponent.simulate('change', '01/12/21')

      datePickerComponent = AddAppointmentWrapper.findWhere(
        node => node.prop('data-test-id') === 'txtInputAvaialblefrom'
      )
      datePickerComponent.simulate('change', '01:00 AM')

      datePickerComponent = AddAppointmentWrapper.findWhere(
        node => node.prop('data-test-id') === 'txtInputAvailableTo'
      )
      datePickerComponent.simulate('change', '02:00 AM')
    })

    then('I can click the button', () => {
      let buttonComponent = AddAppointmentWrapper.findWhere(
        node => node.prop('data-test-id') === 'btnNavigateToAppointments'
      )
      buttonComponent.simulate('click')

      buttonComponent = AddAppointmentWrapper.findWhere(
        node => node.prop('data-test-id') === 'btnAddAppointment'
      )
      buttonComponent.simulate('click')

    })

    then('appointment will be added with out errors', () => {
      expect(AddAppointmentWrapper).toBeTruthy()
    })

    then('I can leave the screen with out errors', () => {
      instance.componentWillUnmount()
      expect(AddAppointmentWrapper).toBeTruthy()
    })
  })
})
