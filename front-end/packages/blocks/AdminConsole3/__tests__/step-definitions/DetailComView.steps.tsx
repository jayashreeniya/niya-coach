// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import { runEngine } from '../../../../framework/src/RunEngine'
import { Message } from "../../../../framework/src/Message"

import MessageEnum, { getName } from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native"

import { FlatList } from "react-native"
import DetailComView from "../../src/DetailComView"

const screenProps = {
    navigation: {
        navigate: jest.fn(),
        goBack: jest.fn()

    },
    id: "DetailComView"
}
jest.useFakeTimers();

const DetcompanyData = {

    "attributes": {
        "id": 22,
        "name": "Dominos",
        "email": "dominos@gmail.com",
        "address": "Chennai,India",
        "hr_code": "hgMue9",
        "employee_code": "ZcBHSkC",
        "company_image": null,
        "total_users": 8,
        "total_hours": "01:04:27",
        "feedback": 3.0,
        "focus_areas": [
            {
                "focus_area": "Communication",
                "per": 50.0
            },
            {
                "focus_area": "Role Conflict",
                "per": 75.0
            },

            {
                "focus_area": "Sleep Concerns   ",
                "per": 12.5
            },
            {
                "focus_area": "Navigating Conflict",
                "per": 25.0
            },

            {
                "focus_area": "Career progression",
                "per": 37.5
            }
        ],
        "user_logged_in": [
            {
                "item": {
                    "month": "February",
                    "employees": 10,
                    "hrs": 2
                },
            },
            {
                "item": {
                    "month": "January",
                    "employees": 100,
                    "hrs": 10
                },
            },
         
        ],
        "employees": [
            {
                "id": 332,
                "full_name": "DEmployee3",
                "email": "dominos3@gmail.com"
            },
            {
                "id": 369,
                "full_name": "Madhan",
                "email": "madhan@gmail.com"
            },
            {
                "id": 343,
                "full_name": "dom emp",
                "email": "dom@gmail.dom"
            },

            {
                "id": 321,
                "full_name": "DEmployee1",
                "email": "dominos2@gmail.com"
            },
            {
                "id": 333,
                "full_name": "DEmployee4",
                "email": "dominos4@gmail.com"
            },

            {
                "id": 359,
                "full_name": "DEmployee7",
                "email": "dominos7@gmail.com"
            },
            {
                "id": 349,
                "full_name": "DEmployee6 ",
                "email": "dominos6@gmail.com"
            },
            {
                "id": 318,
                "full_name": "DEmployee",
                "email": "dominos1@gmail.com"
            },

        ]
    }

}



const ComUserdeviceTokenUpdate = {
    "data": {
        "id": 7,
        "device_token": "asdflajsldflasjdflasdf",
        "account_id": 242,
        "created_at": "2022-11-24T05:18:55.470Z",
        "updated_at": "2023-01-02T11:46:59.966Z"
    }
}

const CompDetprofileData = {
    "data": {
        "id": "12",
        "type": "account",
        "attributes": {
            "type": "EmailAccount",
            "first_name": null,
            "last_name": null,
            "full_name": "abc user",
            "email": "asd12@gmail.com",
            "access_code": "DDZHzv8",
            "gender": "female",
            "full_phone_number": "7808125135",
            "activated": true,
            "country_code": null,
            "created_at": "2022-08-16T06:52:09.835Z",
            "image": "image.png",
            "updated_at": "2022-08-16T06:52:09.908Z",
            "phone_number": null

        }
    }
}
const feature = loadFeature('./__tests__/features/DetailComView-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.mock('react-native-drawer', () => {
            return {
                addEventListener: jest.fn(),
                createDrawerNavigator: jest.fn()
            }
        });
        jest.spyOn(runEngine, "sendMessage");
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' } }));

    });

    afterEach(() => {
        jest.runAllTimers();
    });

    test('User navigates to DetailComView', ({ given, when, then }) => {
        let DetCompViewBlockA: ShallowWrapper;
        let instance: DetailComView;

        given('I am a User loading DetailComView', () => {
            DetCompViewBlockA = shallow(<DetailComView {...screenProps} />);
        });

        when('I navigate to the DetailComView', () => {
            instance = DetCompViewBlockA.instance() as DetailComView;
            render(<DetailComView {...screenProps} />)
            instance.componentDidMount();
            instance.getFocusOn();
            instance.getToken();
            instance.setState({ compid: 22, prifileimage: "", token: "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });

            instance.getUserDataList();
            instance.getComapnyDetails();
            fireEvent.press(screen.getByTestId("btnOpenDrawer"));

            fireEvent.press(screen.getByTestId("profile_click"));
            fireEvent.press(screen.getByTestId("sendNotify_click"));

            fireEvent.press(screen.getByTestId("Privacy_click"));
            instance.saveFcmTOken("eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA");


            fireEvent.press(screen.getByTestId("feedback_click"));

            fireEvent.press(screen.getByTestId("logout_click"));

        });

        then("Response token from the session", () => {
            const tokensessMsg = new Message(
                getName(MessageEnum.SessionResponseMessage)
            );

            tokensessMsg.addData(
                getName(MessageEnum.SessionResponseToken),
                "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"
            )

            runEngine.sendMessage('From unut test', tokensessMsg);
        });
        then('Network response for get all requests', () => {
            const networkmsg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );

            networkmsg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                networkmsg.messageId
            )

            networkmsg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                DetcompanyData
            )
            instance.getComapnyDetailsApiCallId = networkmsg.messageId
            runEngine.sendMessage('From unit test', networkmsg);


            const msgGetuser = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );

            msgGetuser.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msgGetuser.messageId
            )

            msgGetuser.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                DetcompanyData
            )
            instance.getuserDetailsApiCallId = msgGetuser.messageId
            runEngine.sendMessage('From unit test', msgGetuser);

            instance.setState({
                prifileimage: CompDetprofileData?.data.attributes?.image,
                full_name: CompDetprofileData?.data.attributes?.full_name,
                CompDataList: {
                    "attributes": {
                        "id": 22,
                        "name": "Dominos",
                        "email": "dominos@gmail.com",
                        "address": "Chennai,India",
                        "hr_code": "hgMue9",
                        "employee_code": "ZcBHSkC",
                        "company_image": null,
                        "total_users": 8,
                        "total_hours": "01:04:27",
                        "feedback": 3.0,
                        "focus_areas": [
                            {
                                "focus_area": "Communication",
                                "per": 50.0
                            },
                            {
                                "focus_area": "Role Conflict",
                                "per": 75.0
                            },

                            {
                                "focus_area": "Sleep Concerns   ",
                                "per": 12.5
                            },
                            {
                                "focus_area": "Navigating Conflict",
                                "per": 25.0
                            },

                            {
                                "focus_area": "Career progression",
                                "per": 37.5
                            }
                        ],

                        "employees": [
                            {
                                "id": 332,
                                "full_name": "DEmployee3",
                                "email": "dominos3@gmail.com"
                            },
                            {
                                "id": 369,
                                "full_name": "Madhan",
                                "email": "madhan@gmail.com"
                            },
                            {
                                "id": 343,
                                "full_name": "dom emp",
                                "email": "dom@gmail.dom"
                            },

                            {
                                "id": 321,
                                "full_name": "DEmployee1",
                                "email": "dominos2@gmail.com"
                            },


                        ],
                        "user_logged_in": [
                            {
                                "item": {
                                    "month": "February",
                                    "employees": 10,
                                    "hrs": 2
                                },
                            },
                            {
                                "item": {
                                    "month": "January",
                                    "employees": 100,
                                    "hrs": 10
                                },
                            },
                            {
                                "item": {
                                    "month": "March",
                                    "employees": 40,
                                    "hrs": 3
                                },
                            }

                        ],
                    }
                }


            });

        });

        then('DetailComView will load with out errors', () => {
            expect(DetCompViewBlockA).toBeTruthy();


            instance.renderCompDataList();
            render(
                <FlatList data={instance.state.CompDataList?.attributes?.user_logged_in}
                    horizontal
                    renderItem={(itm) => instance.renderItm(itm)}

              />,
            );

            let btnAddNewCom = DetCompViewBlockA.findWhere((node) => node.prop('testID') === 'btnAddNewCom');
            btnAddNewCom.simulate('press');

            instance.logOut();

        });

        then('I can update device token with out errors', () => {
            const devtokmsg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );

            devtokmsg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                devtokmsg.messageId
            )

            devtokmsg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                ComUserdeviceTokenUpdate


            )
            instance.devicetokenApiCallId = devtokmsg.messageId
            runEngine.sendMessage('From unit test', devtokmsg);

        });

        then('Network error response for get all requests', () => {
            const neterrmsg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );

            neterrmsg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                neterrmsg.messageId
            )

            neterrmsg.addData(
                getName(MessageEnum.RestAPIResponceErrorMessage),
                "Something went wrong. Please try again"
            )
            instance.getComapnyDetailsApiCallId = neterrmsg.messageId
            runEngine.sendMessage('From unit test', neterrmsg);
        });
        then('Network responseJson message error response for get all requests', () => {
            const resmsg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
            );

            resmsg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                resmsg.messageId
            )

            resmsg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                { message: "Something went wrong. Please try again" }
            )
            instance.getComapnyDetailsApiCallId = resmsg.messageId
            runEngine.sendMessage('From unit test', resmsg);

        });
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(DetCompViewBlockA).toBeTruthy();
        });
    });


});
