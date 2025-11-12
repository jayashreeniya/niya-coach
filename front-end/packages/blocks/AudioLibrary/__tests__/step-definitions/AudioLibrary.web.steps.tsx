import { defineFeature, loadFeature } from "jest-cucumber";
import { shallow, ShallowWrapper } from "enzyme";
import { Message } from "../../../../framework/src/Message"
import * as helpers from "../../../../framework/src/Helpers";
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import {runEngine} from '../../../../framework/src/RunEngine';

import React from "react";
import AudioLibrary from "../../src/AudioLibrary.web";
const navigation = require("react-navigation"); 
export const configJSON = require("../../src/config");


const screenProps = {
  navigation: {
    navigate:jest.fn(),
    goBack:jest.fn(),
    addEventListener:jest.fn(),
    getParam: jest.fn()
       
},
id: "AudioLibrary",
};

const feature = loadFeature(
  "./__tests__/features/AudioLibrary-scenario.web.feature"
);

defineFeature(feature, (test) => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("react-native", () => ({ Platform: { OS: "web" } }));
    jest.spyOn(helpers, "getOS").mockImplementation(() => "web");
  });

  test("User navigates to AudioLibrary web", ({ given, when, then }) => {
    let exampleBlockWebA: ShallowWrapper;
    let instanceweb: AudioLibrary;

    given("I am a User loading AudioLibrary web", () => {
      exampleBlockWebA = shallow(<AudioLibrary {...screenProps} />);
    });

    when("I navigate to the AudioLibrary web", () => {
      instanceweb = exampleBlockWebA.instance() as AudioLibrary;
    });

    then("AudioLibrary web will load with out errors", () => {
      expect(exampleBlockWebA).toBeTruthy();
      instanceweb.componentDidMount();
    });

    then("I can enter text with out errors in web", () => {
      instanceweb.componentDidMount();
      instanceweb.setState({mediaList: configJSON.medilist});
      instanceweb.getMedia();
      instanceweb.togglePlayer();
      instanceweb.fetchMoreData();
      instanceweb.handlePagination({},0);
      });

      then('I can select the button with with out errors in web', () => {
            
        let body={
            device_token:"asdfjlasdfoasdnfasfaernasdf"
          }
        instanceweb.restApiCall({
        endPoint: "audio_list",
        method: "GET",
        newState: { loading: true }
      });

      instanceweb.restApiCall({
        endPoint: "dummy",
        method: "POST",
        newState: { loading: true },
        body:body
      });


        const msggetAssessTestQuestionsList = new Message(getName(MessageEnum.RestAPIResponceMessage))
        msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceDataMessage), msggetAssessTestQuestionsList.messageId);
        msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
        {
           
            "data":configJSON.medilist
         });
            
      
         instanceweb.getMediaApiCallId = msggetAssessTestQuestionsList.messageId
        runEngine.sendMessage("Unit Test", msggetAssessTestQuestionsList);

        instanceweb.renderMedia();
       
         instanceweb.setState({mediaList:configJSON.medArticleList,mediaType:'articles'},()=>{
            
         });
       
        const msggetErrorRes = new Message(getName(MessageEnum.RestAPIResponceMessage))
        msggetErrorRes.addData(getName(MessageEnum.RestAPIResponceDataMessage), 
        msggetErrorRes.messageId);
        msggetErrorRes.addData(getName(MessageEnum.RestAPIResponceErrorMessage), 
        {
           
            "errors": ["Something Went wrong"]
         });
            
      
        instanceweb.getMediaApiCallId = msggetErrorRes.messageId
        runEngine.sendMessage("Unit Test", msggetErrorRes);
        
    });


    then("I can leave the screen with out errors in web", () => {
      instanceweb.componentWillUnmount();
      expect(exampleBlockWebA).toBeTruthy();
    });
  });
});
