// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"
import { fireEvent ,screen,render} from "@testing-library/react-native";

import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";


import AddNewCom from "../../src/AddNewCom"
const navigation = require("react-navigation");


const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
        addListener:('willFocus',()=>{
          
        })
        
       
    },
    id: "AddNewCom"
  }
  jest.useFakeTimers();
  
  const companyData={
    "data": {
        "id": "22",
        "type": "company_detail",
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
            "feedback": "3.0",
            "focus_areas": [
                {
                    "focus_area": "Role Conflict",
                    "per": 75.0
                },
                {
                    "focus_area": "Communication",
                    "per": 50.0
                },
                {
                    "focus_area": "Career progression",
                    "per": 37.5
                },
                {
                    "focus_area": "Navigating Conflict",
                    "per": 25.0
                },
                {
                    "focus_area": "Sleep Concerns   ",
                    "per": 12.5
                }
            ],
            "user_logged_in": [
                {
                    "month": "January",
                    "employees": 0,
                    "hrs": 0
                },
                {
                    "month": "February",
                    "employees": 0,
                    "hrs": 0
                },
                {
                    "month": "March",
                    "employees": 0,
                    "hrs": 0
                },
                {
                    "month": "April",
                    "employees": 0,
                    "hrs": 0
                },
                {
                    "month": "May",
                    "employees": 0,
                    "hrs": 0
                },
                {
                    "month": "June",
                    "employees": 0,
                    "hrs": 0
                },
                {
                    "month": "July",
                    "employees": 0,
                    "hrs": 0
                },
                {
                    "month": "August",
                    "employees": 0,
                    "hrs": 0
                },
                {
                    "month": "September",
                    "employees": 0,
                    "hrs": 0
                },
                {
                    "month": "October",
                    "employees": 0,
                    "hrs": 0
                },
                {
                    "month": "November",
                    "employees": 0,
                    "hrs": 0
                },
                {
                    "month": "December",
                    "employees": 0,
                    "hrs": 9
                }
            ],
            "employees": [
                {
                    "id": 343,
                    "full_name": "dom emp",
                    "email": "dom@gmail.dom"
                },
                {
                    "id": 369,
                    "full_name": "Madhan",
                    "email": "madhan@gmail.com"
                },
                {
                    "id": 321,
                    "full_name": "DEmployee1",
                    "email": "dominos2@gmail.com"
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
                {
                    "id": 333,
                    "full_name": "DEmployee4",
                    "email": "dominos4@gmail.com"
                },
                {
                    "id": 332,
                    "full_name": "DEmployee3",
                    "email": "dominos3@gmail.com"
                },
                {
                    "id": 359,
                    "full_name": "DEmployee7",
                    "email": "dominos7@gmail.com"
                }
            ]
        }
    }
}
const coachExpertise={
    "data": [
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
    ]
}
const profiledata={
    "data": {
        "id": "11",
        "type": "account",
        "attributes": {
            "type": "EmailAccount",
            "first_name": null,
            "last_name": null,
            "full_name": "test user",
            "email": "asd@gmail.com",
            "access_code": "12345",
            "gender": null,
            "full_phone_number": "7898125135",
            "activated": true,
            "phone_number": null,
            "country_code": null,
            "created_at": "2022-08-16T06:52:09.835Z",
            "updated_at": "2022-08-16T06:52:09.908Z",
            "image": null
        }
    }
}
const deviceTokenUpdate={
    "data": {
        "id": 7,
        "device_token": "asdflajsldflasjdflasdf",
        "account_id": 242,
        "created_at": "2022-11-24T05:18:55.470Z",
        "updated_at": "2023-01-02T11:46:59.966Z"
    }
}
const addnewCompany={
    "data": {
        "id": "26",
        "type": "company",
        "attributes": {
            "id": 26,
            "name": "Test",
            "email": "test@gmail.com",
            "address": "test",
            "hr_code": "Cuad6M",
            "employee_code": "HqERhM7",
            "company_date": "2023-01-03",
            "company_image": null
        }
    }
}
const feature = loadFeature('./__tests__/features/AddNewCom-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.spyOn(runEngine, "sendMessage");  
        jest.mock('react-native-drawer', () => {
            return {
              addEventListener: jest.fn(),
              createDrawerNavigator: jest.fn()
            }
          });      
    });

    afterEach(()=>{
        jest.runAllTimers();
      })


    test('User navigates to AddNewCom', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:AddNewCom; 

        given('I am a User loading AddNewCom', () => {
            exampleBlockA = shallow(<AddNewCom {...screenProps}/>);
        });

        when('I navigate to the AddNewCom', () => {
             instance = exampleBlockA.instance() as AddNewCom;
             instance.componentDidMount();
             instance.getFocusOn();
             instance.getToken();
             instance.setState({compid:22,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" });
             instance.getComapnyDetails();
             instance.getUserDataList();
            
             instance.saveFcmTOken("eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA");
             instance.doButtonPressed();
             instance.setInputValue("text");
             instance.setEnableField();
            });  
        then("Response token from the session", () => {
            const tokenMsg = new Message(
              getName(MessageEnum.SessionResponseMessage)
            );
      
            tokenMsg.addData(
              getName(MessageEnum.SessionResponseToken),
              "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"
            )
      
            runEngine.sendMessage('From unut test', tokenMsg);
          });
        then('Network response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                companyData
              )
              instance.getComapnyDetailsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });   
         
        then('Network response for get profile data requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                profiledata
              )
              instance.getuserDetailsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });      

        then('AddNewCom will load with out errors', () => {
            render(<AddNewCom {...screenProps}/>)
            expect(exampleBlockA).toBeTruthy();
            instance.setState({
                prifileimage:profiledata?.data.attributes?.image,
                user_name: profiledata?.data.attributes?.full_name,
                full_name:companyData?.data?.attributes?.name,
                email:companyData?.data?.attributes?.email,
                address:companyData?.data?.attributes?.address,
                access_code:companyData?.data?.attributes?.hr_code,
                emp_access_code:companyData?.data?.attributes?.employee_code,
                loading: false
              
              });
            instance.renderDrawer();
            instance.renderProfile();
            instance.renderEmail();
            instance.renderButton()
            
            let txtCompanyName = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtCompanyName');
            txtCompanyName.simulate('changeText', companyData?.data?.attributes?.name);
            
            let txtEmail = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtEmail');
            txtEmail.simulate('changeText', companyData?.data?.attributes?.email);
            
            let txtAddress = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtAddress');
            txtAddress.simulate('changeText', '91');

            let btnHrList = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnHrList');
            btnHrList.simulate('press');

            let btnCreateCompany = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnCreateCompany');
            btnCreateCompany.simulate('press');
            fireEvent.press(screen.getByTestId("profile_click"));
            fireEvent.press(screen.getByTestId("Privacy_click"));
     
            fireEvent.press(screen.getByTestId("sendNotify_click"));
     
            fireEvent.press(screen.getByTestId("feedback_click"));
           
            fireEvent.press(screen.getByTestId("logout_click"));
           
             instance.logOut();
           
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                addnewCompany
              )
              instance.addNewCompApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
            
                
        });
        then('I can update device token with out errors',()=>{
            
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                deviceTokenUpdate
              )
              instance.devicetokenApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
              const attrs = {
                device_token:'ddsdsfsdejr4ie392ioejekwj'
              };
              instance.devicetokenApiCallId = instance.networkRequest({
                endPoint: "bx_block_push_notifications/device_token",
                method: "POST",
                body:attrs,
                newState: { loading: true }
              });
        });        
        
        then('Network error response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceErrorMessage),
                "Something went wrong. Please try again"
              )
              instance.getuserDetailsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        then('Network responseJson message error response for get all requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                {message:"Something went wrong. Please try again"}
              )
              instance.getuserDetailsApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
              
        });
        
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
