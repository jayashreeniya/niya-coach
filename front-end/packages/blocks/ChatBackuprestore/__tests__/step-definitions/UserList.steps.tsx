// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from "../../../../framework/src/Message"

import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import UserList from "../../src/UserList"
import { FlatList } from "react-native"
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate: jest.fn(),
        goBack: jest.fn(),
        getParam: jest.fn()

    },
    id: "UserList"
}

const feature = loadFeature('./__tests__/features/UserList-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {

        jest.doMock('react-native', () => ({ Platform: { OS: 'web' } }));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.resetModules();

    });

    test('User navigates to UserList Screen', ({ given, when, then }) => {
        let exampleBlockA: ShallowWrapper;
        let userinstance: UserList;

        given('I am a User loading UserList', () => {
            exampleBlockA = shallow(<UserList {...screenProps} />);
        });

        when('I navigate to the UserList', () => {
            userinstance = exampleBlockA.instance() as UserList
        });

        then('UserList will load with out errors', () => {

            const userdetails = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );

            userdetails.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                userdetails.messageId
            )

            userdetails.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                    "data": [
                        {
                            "id": 229,
                            "full_name": "Dinesh A"
                        },

                        {
                            "id": 218,
                            "full_name": "DEmployee"
                        },

                        {
                            "id": 290,
                            "full_name": "sonali s"
                        },


                        {
                            "id": 421,
                            "full_name": "testing123"
                        },

                        {
                            "id": 394,
                            "full_name": "niya"
                        },

                    ]
                }
            )
            userinstance.getuserlistApiCallId = userdetails.messageId
            runEngine.sendMessage('From unit test', userdetails);
            let flatdata = exampleBlockA.find(FlatList);
            flatdata.render();
            expect(exampleBlockA).toBeTruthy();


        });



        then('Network error response for get all requests', () => {
            const msg_err = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );

            msg_err.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg_err.messageId
            )

            msg_err.addData(
                getName(MessageEnum.RestAPIResponceErrorMessage),
                "Something went wrong. Please try again"
            )
            userinstance.getuserlistApiCallId = msg_err.messageId
            runEngine.sendMessage('From unit test', msg_err);


            expect(exampleBlockA).toBeTruthy();

        });


        then('I can leave the screen with out errors', () => {
            userinstance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
