// @ts-nocheck
import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";

import * as helpers from "../../../../framework/src/Helpers";
import { runEngine } from "../../../../framework/src/RunEngine";
import { Message } from "../../../../framework/src/Message";
import{fireEvent,screen,render} from '@testing-library/react-native';
import MessageEnum, {
  getName,
} from "../../../../framework/src/Messages/MessageEnum";
import React from "react";
import UserProfile from "../../src/UserProfile";
const navigation = require("react-navigation");

const screenProps = {
  navigation: {
    navigate: jest.fn(),
    getParam:jest.fn(),
    goBack:jest.fn(),
    
    addListener:('willFocus',()=>{
        
      }),
   
  },
  id: "UserProfile",
};
jest.mock('react-native-image-crop-picker');
const feature = loadFeature(
  "./__tests__/features/UserProfile-scenario.feature"
);

const mockNotifications = [
    {
        id: 1,
        name: "Female",
      },
      {
        id: 2,
        name: "Male",
      },
      {
        id: 3,
        name: "Other",
      },
];

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to User Profile", ({ given, when, then }) => {
    let UserProfileBlock: ShallowWrapper;
    let instance: UserProfile;

    given("I am a User loading User Profile", () => {
       
       UserProfileBlock = shallow(<UserProfile {...screenProps}  />);
    });

    when("I navigate to the User Profile Screen", () => {
      instance = UserProfileBlock.instance() as UserProfile;
      instance.role="employee";
  
   
    });

    then("User Profile will load with out errors", () => {
      instance = UserProfileBlock.instance() as UserProfile;
      instance.setState({full_name:'sds',image:'finel0',email:'abc@gmail.com',gender:'Female',phone_number:'9045905655',access_code:'1234334'})
      instance.componentDidMount();
      instance.getToken();
      instance.onPressNewDetailsApiCall();
      instance.onPressNewDetails()
      instance.getDataDataList(instance.state.token);
      instance.getDataDataList();
      
      expect(UserProfileBlock).toBeTruthy();
      const msgLoadAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLoadAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadAPI.messageId
      );
      msgLoadAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        data: []
      });
    
      instance.getachievementApiCallId = msgLoadAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLoadAPI);
      expect(UserProfileBlock).toBeTruthy();
      instance.getSuccessCallBack();
      instance.getFailureCallBack();
     
      instance.setState({isLoading:false,role:"employee"})
      // for err
      const msgLoadAPIerr = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLoadAPIerr.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadAPIerr.messageId
      );
      msgLoadAPIerr.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        errors: [
          {
            message: "Failed to load data",
          },
        ],
      });
    
      instance.getachievementApiCallId = msgLoadAPIerr.messageId;
      runEngine.sendMessage("Unit Test", msgLoadAPIerr);
     
      instance.getFailureCallBack();
     
 
    });
    then('I can enter a full name with out errors', () => {
      const{container}=  render(<UserProfile {...screenProps}  />);
        instance.renderHeader();
        instance.renderProfile();
        
        let btnHeader=UserProfileBlock.findWhere((node)=>node.prop('testID')==='btnHeaderPress');
        btnHeader.simulate('press');
       
        let textInputComponent = UserProfileBlock.findWhere((node) => node.prop('testID') === 'txtInputFullName');
        textInputComponent.simulate('changeText', 'FULL');

    });


        
    then('I can enter a email with out errors', () => {
        instance.renderEmail();
        
        let textInputComponent = UserProfileBlock.findWhere((node) => node.prop('testID') === 'txtInputEmail');
        textInputComponent.simulate('changeText', 'a@bb.com');
        let textAccesscode = UserProfileBlock.findWhere((node) => node.prop('testID') === 'txtInputaccess_code');
        textAccesscode.simulate('changeText', 'DZZHzv8');
    });

    then('I can select gender', () => {
        let genderItem = UserProfileBlock
        .findWhere((node) => node.prop("testID") === "selectTxtInput")
      
        genderItem.simulate("changeText","Female");
        expect(UserProfileBlock).toBeTruthy();

    });
  
 
    then("I can select submit without errors", async() => {
        instance.setState({full_name:'fullnm',email:'abc@gmail.com',gender:'female'})
      let saveData = UserProfileBlock
        .findWhere((node) => node.prop("testID") === "userDataSave")
        .first();

      saveData.simulate("press");
      await instance.onPressNewDetails();
      expect(UserProfileBlock).toBeTruthy();
     
      instance = UserProfileBlock.instance() as UserProfile;
      const msgLoadAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLoadAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadAPI.messageId
      );
      msgLoadAPI.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), {
        data: {
        "id": "119",
        "type": "account",
        "attributes": {
            "type": "EmailAccount",
            "first_name": null,
            "last_name": null,
            "full_name": "Sonali",
            "email": "sonali@gmail.com",
            "access_code": "12345",
            "gender": "Female",
            "full_phone_number": "918976543234",
            "activated": true,
            "phone_number": "8976543234",
            "country_code": "91",
            "created_at": "2022-09-23T13:04:43.414Z",
            "updated_at": "2022-10-07T12:10:15.116Z",
            "image": "https://niya-178517-ruby.b178517.dev.eastus.az.svc.builder.cafe/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBDQT09IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--e7da9ff8ccb886565e256d1443c2e99203d74b31/images.jpeg"
        }}
      });
     
      instance.userProfileApiCallId = msgLoadAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLoadAPI);
     
      instance.userProfileSuccessCallBack();
      instance.setState({isLoading:false,role:"employee"})
 
    });

    then("User Profile failed to load data from the server", () => {
      instance = UserProfileBlock.instance() as UserProfile;
      const msgLoadFailRestAPI = new Message(
        getName(MessageEnum.RestAPIResponceMessage)
      );
      msgLoadFailRestAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadFailRestAPI
      );
      msgLoadFailRestAPI.addData(
        getName(MessageEnum.RestAPIResponceSuccessMessage),
        {
          errors: [
            {
              message: "Failed to load data",
            },
          ],
        }
      );

      msgLoadFailRestAPI.addData(
        getName(MessageEnum.RestAPIResponceDataMessage),
        msgLoadFailRestAPI.messageId
      );
      instance.userProfileApiCallId = msgLoadFailRestAPI.messageId;
      runEngine.sendMessage("Unit Test", msgLoadFailRestAPI);
      instance.userProfileFailureCallBack();
    });

    then("I can leave the screen with out errors", () => {
      instance.componentWillUnmount();
      expect(UserProfileBlock).toBeTruthy();
    });
  });
});
