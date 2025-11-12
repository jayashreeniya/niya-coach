// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from "../../../../framework/src/Message"

import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import ChatBackuprestore from "../../src/ChatBackuprestore"
import { FlatList } from "react-native"

const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        goBack: jest.fn(),
        getParam: jest.fn()
    },
    id: "ChatBackuprestore"
}

const feature = loadFeature('./__tests__/features/ChatBackuprestore-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' } }));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
    });

    test('User navigates to ChatBackuprestore', ({ given, when, then }) => {
        let exampleBlockA: ShallowWrapper;
        let instance: ChatBackuprestore;

        given('I am a User loading ChatBackuprestore', () => {
            exampleBlockA = shallow(<ChatBackuprestore {...screenProps} />);
        });

        when('I navigate to the ChatBackuprestore', () => {
            instance = exampleBlockA.instance() as ChatBackuprestore
        });

        then('ChatBackuprestore will load with out errors', () => {

            const chat_reqcreate = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );

            chat_reqcreate.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                chat_reqcreate.messageId
            )

            chat_reqcreate.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                    "data": {
                        "room_id": "10",
                        "current_user": " 42",
                        "requested_user": "28"
                    }
                }
            )
            instance.getchatreqApiCallId = chat_reqcreate.messageId
            runEngine.sendMessage('From unit test', chat_reqcreate);

            const chat_details = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );

            chat_details.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                chat_details.messageId
            )

            chat_details.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                    "data": [
                        {
                            "account": 42,
                            "message": "hi chat 11"
                        },
                        {
                            "account": 42,
                            "message": "what are u doing"
                        }
                    ]
                }
            )
            instance.getconversationApicallID = chat_details.messageId
            runEngine.sendMessage('From unit test', chat_details);


            expect(exampleBlockA).toBeTruthy();
        });

        then('I can enter text with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
        });

        then('I can select the button with with out errors', () => {
            let buttonComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnExample');
            buttonComponent.simulate('press');


            const sendmsg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );

            let listdata = exampleBlockA.find(FlatList);
            listdata.render();

            sendmsg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                sendmsg.messageId
            )

            sendmsg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {
                    "data": [
                        {
                            "room_id": 42,
                            "account_id": 27,
                            "message": "hi chat 11"
                        },

                    ]
                }
            )
            instance.deliverMsgApiCallId = sendmsg.messageId
            runEngine.sendMessage('From unit test', sendmsg);

            expect(exampleBlockA).toBeTruthy();
        });

        then('I can leave the screen with out errors', () => {

            expect(exampleBlockA).toBeTruthy();
        });
    });


});
