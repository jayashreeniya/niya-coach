// @ts-nocheck
import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'
import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import { fireEvent ,screen,render} from "@testing-library/react-native";
import AddNewCoach from "../../src/AddNewCoach"
const navigation = require("react-navigation");

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn()
       
    },
    id: "AddNewCoach"
  }
  jest.useFakeTimers();
  
  const coachDetData={
    "data": {
        "id": "167",
        "type": "get_coach_admin",
        "attributes": {
            "coach_details": {
                "id": 167,
                "full_name": "coach18",
                "full_phone_number": "917878905445",
                "rating": 4.2,
                "education": "Phsycological",
                "languages": "Hindi & English",
                "city": "Mumbai",
                "email": "coach18@gmail.com",
                "expertise": [
                    {
                        "specialization": "Career Management",
                        "id": 1
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
                        "specialization": "Workplace Bullying",
                        "id": 14
                    },
                    {
                        "specialization": "Gender Identity Issues",
                        "id": 15
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
                        "specialization": "ADHD",
                        "id": 22
                    },
                    {
                        "specialization": "Autism spectrum",
                        "id": 23
                    },
                    {
                        "specialization": "Relationship Issues",
                        "id": 25
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
                    }
                ],
                "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBWUT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--2da18efd0b760848af664250d1b4e500e4bdaa4f/download.png"
            }
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
const addnewCoach={
    "data": {
        "id": "374",
        "type": "email_account",
        "attributes": {
            "full_name": "coach21",
            "email": "coach1234@gmail.com",
            "full_phone_number": "917901817921",
            "access_code": null,
            "activated": true,
            "role": "coach"
        }
    }
}
const feature = loadFeature('./__tests__/features/AddNewCoach-scenario.feature');

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

    test('User navigates to AddNewCoach', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:AddNewCoach; 

        given('I am a User loading AddNewCoach', () => {
            exampleBlockA = shallow(<AddNewCoach {...screenProps}/>);
        });

        when('I navigate to the AddNewCoach', () => {
            
             instance = exampleBlockA.instance() as AddNewCoach;
             instance.componentDidMount();
             instance.getFocusOn();
            
             instance.getToken();
            render(<AddNewCoach {...screenProps}/>)
             instance.setState({userId:192,token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA" },()=>{
                instance.getUserDataList();
                instance.getAllExpertiseDataList();
                instance.getCoachDetails();
             });
             instance.setState({coach_id:374,prifileimage:'image.png'})
             instance.saveFcmTOken("eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA");
             instance.getCoachDetails();
             instance.onPressNewDetails()
             instance.onPressNewDetailsApiCall();
             instance.apiCall({
                contentType: "multipart/form-data",
                method: "POST",
                endPoint: "bx_block_admin/create_coach",
                body: {},
                type: 'formData'
            });
             const requestMessage = new Message(
                getName(MessageEnum.RestAPIRequestMessage)
            )
            requestMessage.addData(
                getName(MessageEnum.RestAPIRequestHeaderMessage),
                "header "
            )
           
            requestMessage.addData(
                getName(MessageEnum.RestAPIRequestMethodMessage),
                "POST"
            )
           requestMessage.addData(
                    getName(MessageEnum.RestAPIRequestBodyMessage),
                    {}
                );
            runEngine.sendMessage(requestMessage.id, requestMessage);
             

             instance.getUserDataList();
             instance.getAllExpertiseDataList();
             instance.renderDrawer();
             instance.apiCall("")
             instance.profilePicImage();
             instance.setState({prifileimage:"img",image:{}})
             instance.clickCategory(coachExpertise,1)
            
             instance.clickCategory({item:coachExpertise?.data?.attributes?.user_logged_in[0],index:0,},1);

             fireEvent.press(screen.getByTestId("profile_click"));
             fireEvent.press(screen.getByTestId("Privacy_click"));
      
             fireEvent.press(screen.getByTestId("sendNotify_click"));
      
             fireEvent.press(screen.getByTestId("feedback_click"));
            
             fireEvent.press(screen.getByTestId("logout_click"));
            
            
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
                coachDetData
              )
              instance.getCoachDetailApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);

              instance.setState({selectedCategoryID:["8","10"],categoriesArray:["8","9"]});
              const msgwithdata = new Message(
                  getName(MessageEnum.RestAPIResponceMessage)
                );
          
                msgwithdata.addData(
                  getName(MessageEnum.RestAPIResponceDataMessage),
                  msgwithdata.messageId
                )
          
                msgwithdata.addData(
                  getName(MessageEnum.RestAPIResponceSuccessMessage),
                  coachDetData
                )
                instance.getCoachDetailApiCallId = msgwithdata.messageId
                runEngine.sendMessage('From unit test', msgwithdata);
     
             
        });   
        then('Network response for get coach expertises requests',()=>{
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                coachExpertise
              )
              instance.getCoachExpertiseApiCallId = msg.messageId
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

        then('AddNewCoach will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.setState({
                prifileimage:profiledata?.data.attributes?.image,
                user_name: profiledata?.data.attributes?.full_name,
                coach_full_name:coachDetData?.data?.attributes?.coach_details?.full_name,
                coach_email:coachDetData?.data?.attributes?.coach_details?.email,
                phone_number:coachDetData?.data?.attributes?.coach_details?.full_phone_number.slice(2),
                data:coachExpertise?.data,
                isData:true,
                categoriesArray: coachExpertise?.data
               });
            instance.renderProfile();
            instance.renderEmail();
            instance.renderExpertise();
            instance.renderButton();
            instance.btnPasswordShowHideProps.onPress()

            let btnOpenDrawer = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnOpenDrawer');
            btnOpenDrawer.simulate('press');
           
            let txtFullname = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtFullName');
            txtFullname.simulate('changeText', coachDetData?.data?.attributes?.coach_details?.full_name);
            
            let txtEmail = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtEmail');
            txtEmail.simulate('changeText', coachDetData?.data?.attributes?.coach_details?.email);
            
            let txtCountryCode = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtCountryCode');
            txtCountryCode.simulate('changeText', '91');

            let txtMobileNo = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtMobileNo');
            txtMobileNo.simulate('changeText', coachDetData?.data?.attributes?.coach_details?.full_phone_number.slice(2));
            
            console.log("flatlstData>>",coachExpertise?.data[0]);
            instance.renderExpertise();
            instance.renderFaltList(coachExpertise?.data[0]);
          
            let btnExpertises = exampleBlockA.findWhere((node) => node.prop('testID') === 'btnExpertises');
            btnExpertises.simulate('press');

            instance.renderFaltList(coachExpertise?.data[0]);


            instance.setState({usertype:"Coaches"});

            let textInputComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputPassword');
            textInputComponent.simulate('changeText', 'passWord1!');

            let txtInputConfirmPassword = exampleBlockA.findWhere((node) => node.prop('testID') === 'txtInputConfirmPassword');
            txtInputConfirmPassword.simulate('changeText', 'passWord1!');

            const passwordToggleButton=exampleBlockA.findWhere(
                (node)=>node.prop("testID")==="btnPasswordShowHide")
            passwordToggleButton.simulate("press")
            // expect(instance.state.enablePasswordField).toBe(false);

            const passwordCToggleButton=exampleBlockA.findWhere(
                (node)=>node.prop("testID")==="btnConfirmPasswordShowHide")
                passwordCToggleButton.simulate("press")
            expect(instance.state.enableReTypePasswordField).toBe(false);
            
            instance.logOut();

            instance.onPressNewDetailsApiCall();
                let headers : Record<string,string>={"Content-Type":"application/json","token":"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"};
                let body: Record<string,any>={
                    device_token:"asdfjlasdfoasdnfasfaernasdf"
                  }
            instance.networkRequest("dummy","POST",headers,body,{ loading: true });
            const msg = new Message(
                getName(MessageEnum.RestAPIResponceMessage)
              );
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceDataMessage),
                msg.messageId
              )
        
              msg.addData(
                getName(MessageEnum.RestAPIResponceSuccessMessage),
                addnewCoach
              )
              instance.addNewCoachApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
             
              instance.apiCall({ contentType: "multipart/form-data",
              method: 'POST',
              endPoint: 'bx_block_admin/create_coach',
              body: {},
              type: 'formData'})
            
                
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
              instance.getCoachExpertiseApiCallId = msg.messageId
              runEngine.sendMessage('From unit test', msg);
        });
        
        then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });


});
