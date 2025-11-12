import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React from "react";
import AudioLibrary from "../../src/AudioLibrary";

export const configJSON = require("../../src/config");
const navigation = require("react-navigation")

const screenProps = {
    navigation: {
        navigate:jest.fn(),
        goBack:jest.fn(),
        addEventListener:jest.fn(),
        getParam: jest.fn()
           
    },
    id: "AudioLibrary"
  }

 

const feature = loadFeature('./__tests__/features/AudioLibrary-scenario.feature');
jest.mock("react-native-video", () => "Video");

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.resetModules();
        jest.useFakeTimers()
       
    });

    test('User navigates to AudioLibrary', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:AudioLibrary; 

        given('I am a User loading AudioLibrary', () => {
            exampleBlockA = shallow(<AudioLibrary {...screenProps}/>);
        });

        when('I navigate to the AudioLibrary', () => {
             instance = exampleBlockA.instance() as AudioLibrary
             
        });

        then('AudioLibrary will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            instance.componentDidMount();
            instance.setState({mediaList:configJSON.medilist, mediaType:'audio'});
            instance.getData(instance.state.mediaType);
            instance.getData("dsj");
           

            instance.getMedia();
            instance.getArticles();
            instance.getVideos();
            instance.fetchMoreData();
            instance.togglePlayer();
            instance.getData('articles');
            instance.setState({mediaList:configJSON.medArticleList});
            instance.renderArticles(configJSON.medArticleList[0]);
            instance.openDoc(configJSON.medArticleList[0]?.attributes?.file_info?.[0]?.url,configJSON.medArticleList[0].attributes?.file_info?.[0]?.title);
            instance.getData('video');
            instance.renderVideos(configJSON.medArticleList[0]);
            
        });

        then('I can enter text with out errors', () => {
            let body={
                device_token:"3445676asdfjlasdfoasdnfasfaernasdf"
              }
           

          instance.restApiCall({
            endPoint: "dummy",
            method: "POST",
            newState: { loading: true },
            body:body
          });

          instance.restApiCall({
            endPoint: "audio_list",
            method: "GET",
            newState: { loading: true }
          });
            const msggetAssessTestQuestionsList = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceDataMessage), msggetAssessTestQuestionsList.messageId);
            msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
               
                "data":configJSON.medilist
             });
                
          
            instance.getMediaApiCallId = msggetAssessTestQuestionsList.messageId
            runEngine.sendMessage("Unit Test", msggetAssessTestQuestionsList);

             let touchableBackComponent = exampleBlockA.findWhere((node) => node.prop('testID') === 'tblBack');
             touchableBackComponent.simulate('press');

             instance.setState({mediaList:configJSON.medArticleList,mediaType:'articles'},()=>{
               
             });
           
            const msggetErrorRes = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msggetErrorRes.addData(getName(MessageEnum.RestAPIResponceDataMessage), 
            msggetErrorRes.messageId);
            msggetErrorRes.addData(getName(MessageEnum.RestAPIResponceErrorMessage), 
            {
               
                "errors": ["Something Went wrong"]
             });
                
          
            instance.getMediaApiCallId = msggetErrorRes.messageId
            runEngine.sendMessage("Unit Test", msggetErrorRes);


            const AccoutLoginSuccess = new Message(getName(MessageEnum.AccoutLoginSuccess))
            AccoutLoginSuccess.addData(getName(MessageEnum.AuthTokenDataMessage), AccoutLoginSuccess.messageId);
            AccoutLoginSuccess.addData(getName(MessageEnum.AuthTokenDataMessage), 
            {
               
                "token":"12345"
             });
            
            runEngine.sendMessage("Unit Test", AccoutLoginSuccess);

          
        });
         then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(exampleBlockA).toBeTruthy();
        });
    });

    test('User navigates to AudioLibrary to view Articles', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:AudioLibrary; 
        const screenProps2 = {
            navigation: {
                navigate:jest.fn(),
                goBack:jest.fn(),
                addEventListener:jest.fn(),
                getParam: jest.fn((type: string) => "articles")
                   
            },
            id: "AudioLibrary"
          }

        given('I am a User loading AudioLibrary', () => {
            exampleBlockA = shallow(<AudioLibrary {...screenProps2}/>);
        });

        when('I navigate to the AudioLibrary', () => {
             instance = exampleBlockA.instance() as AudioLibrary
             
        });

        then('AudioLibrary will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            const {loadMoreArticles} = instance;
            loadMoreArticles();
        });
    });

    test('User navigates to AudioLibrary to view Audios', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:AudioLibrary; 
        const screenProps3 = {
            navigation: {
                navigate:jest.fn(),
                goBack:jest.fn(),
                addEventListener:jest.fn(),
                getParam: jest.fn((type: string) => "audio")
                   
            },
            id: "AudioLibrary"
          }

        given('I am a User loading AudioLibrary', () => {
            exampleBlockA = shallow(<AudioLibrary {...screenProps3}/>);
        });

        when('I navigate to the AudioLibrary', () => {
             instance = exampleBlockA.instance() as AudioLibrary
        });

        then('AudioLibrary will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            const {loadMoreAudios, setState} = instance;
            loadMoreAudios();
            loadMoreAudios();
        });
    });

    test('User navigates to AudioLibrary to view Videos', ({ given, when, then }) => {
        let exampleBlockA:ShallowWrapper;
        let instance:AudioLibrary; 
        const screenProps4 = {
            navigation: {
                navigate:jest.fn(),
                goBack:jest.fn(),
                addEventListener:jest.fn(),
                getParam: jest.fn((type: string) => "video")
                   
            },
            id: "AudioLibrary"
          }

        given('I am a User loading AudioLibrary', () => {
            exampleBlockA = shallow(<AudioLibrary {...screenProps4}/>);
        });

        when('I navigate to the AudioLibrary', () => {
             instance = exampleBlockA.instance() as AudioLibrary
        });

        then('AudioLibrary will load with out errors', () => {
            expect(exampleBlockA).toBeTruthy();
            const {loadMoreVideos, componentDidMount} = instance;
            componentDidMount();
            loadMoreVideos();
            loadMoreVideos();
        });
    });

});
