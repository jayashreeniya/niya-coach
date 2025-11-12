// @ts-nocheck

import { defineFeature, loadFeature} from "jest-cucumber"
import { shallow, ShallowWrapper } from 'enzyme'

import * as helpers from '../../../../framework/src/Helpers'
import {runEngine} from '../../../../framework/src/RunEngine'
import {Message} from "../../../../framework/src/Message"
import MergeEngineUtilities from "../../../utilities/src/MergeEngineUtilities";
import { AppContext } from "../../../components/src/context/AppContext";
import { set_user_data } from "../../../../components/src/context/actions";
import MessageEnum, {getName} from "../../../../framework/src/Messages/MessageEnum"; 
import React,{ Context } from "react";
import ReassorOrContinue from "../../src/ReassOrContinue"
import { render, screen, fireEvent } from '@testing-library/react-native';
const navigation = require("react-navigation")
                 
       
    const screenProps = {
    navigation: {
      navigate:jest.fn(),
      addListener:jest.fn()
       
    },
    id: "ReassorOrContinue"
  }
  jest.mock('../../../utilities/src/MergeEngineUtilities',()=>{
    return {
        get: () => ({
          width: 375,
          height: 667,
        }),
        addEventListener:('change',(e)=>{
          console.log(e);

        })
}
});

jest.useFakeTimers();
// jest.mock('react-native',()=>{
//   return {
    
//       get: () => ({
//         width: 375,
//         height: 667,
//       }),
//       addEventListener: jest.fn(),
// }
// });
const data= {
    "id": "484",
    "type": "focus_area",
    "attributes": {
      "assesment_test_type_answers": [
        {
          "id": 57,
          "assesment_test_type_id": 9,
          "title": null,
          "answers": "Career progression",
          "test_type_id": null,
          "created_at": "2022-09-14T05:30:38.947Z",
          "updated_at": "2022-09-14T05:30:38.947Z"
        },
        {
          "id": 65,
          "assesment_test_type_id": 9,
          "title": null,
          "answers": "Role Conflict",
          "test_type_id": null,
          "created_at": "2022-09-14T05:30:38.966Z",
          "updated_at": "2022-09-14T05:30:38.966Z"
        },
        {
          "id": 56,
          "assesment_test_type_id": 9,
          "title": null,
          "answers": "Career Change ",
          "test_type_id": null,
          "created_at": "2022-09-14T05:30:38.943Z",
          "updated_at": "2022-09-14T05:31:02.159Z"
        }
      ]
    }
}
const feature = loadFeature('./__tests__/features/ReassOrContinue-scenario.feature');

defineFeature(feature, (test) => {


    beforeEach(() => {
        jest.resetModules();
        jest.doMock('react-native', () => ({ Platform: { OS: 'web' }}));
        jest.spyOn(helpers, 'getOS').mockImplementation(() => 'web');
       
    });

    test('User navigates to ReassorOrContinue', ({ given, when, then }) => {
      let renderedContext;

        let ReassorOrContinueWrapper:ShallowWrapper;
        let instance:ReassorOrContinue; 
        given('I am a User loading ReassorOrContinue', () => {
            ReassorOrContinueWrapper = shallow(<ReassorOrContinue {...screenProps}/>);
            instance = ReassorOrContinueWrapper.instance() as ReassorOrContinue;
            instance.forceUpdate();
            instance.getToken();
            expect(ReassorOrContinueWrapper).toBeTruthy()
            instance.txtInputWebProps.onChangeText('data');
            instance.CustomCheckBoxProps.onChangeValue(false);
            instance.btnShowHideProps("101");
            instance.btnExampleProps.onPress();
            instance.sendbtnPressProps.onPress();
            instance.reAssessProps.onPress();
            instance.hideKeyboard();
            instance.closeReply();
            instance.doButtonPressed();
            instance.setEnableField();
            instance.setInputValue('dsd');
             const msgPlayloadAPI = new Message(getName(MessageEnum.AccoutLoginSuccess))
            msgPlayloadAPI.addData(getName(MessageEnum.AuthTokenDataMessage), "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA");
            runEngine.sendMessage("Unit Test", msgPlayloadAPI)  

            instance.setState({token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA"})
            instance.isFirstTimeUserAssesing(instance.state.token)
         
            const msgsessionResAPI = new Message(getName(MessageEnum.SessionResponseMessage))
            msgsessionResAPI.addData(getName(MessageEnum.SessionResponseMessage), "eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA");
            runEngine.sendMessage("Unit Test", msgsessionResAPI)  

           
            const msggetAssessTestQuestionsList = new Message(getName(MessageEnum.RestAPIResponceMessage))
            msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceDataMessage), msggetAssessTestQuestionsList.messageId);
            msggetAssessTestQuestionsList.addData(getName(MessageEnum.RestAPIResponceSuccessMessage), 
            {
               
                "data":{"id":"484","type":"focus_area","attributes":{"assesment_test_type_answers":[{"id":57,"assesment_test_type_id":9,"title":null,"answers":"Career progression","test_type_id":null,"created_at":"2022-09-14T05:30:38.947Z","updated_at":"2022-09-14T05:30:38.947Z"},{"id":65,"assesment_test_type_id":9,"title":null,"answers":"Role Conflict","test_type_id":null,"created_at":"2022-09-14T05:30:38.966Z","updated_at":"2022-09-14T05:30:38.966Z"},{"id":56,"assesment_test_type_id":9,"title":null,"answers":"Career Change ","test_type_id":null,"created_at":"2022-09-14T05:30:38.943Z","updated_at":"2022-09-14T05:31:02.159Z"}]}
            }
             });
                
          
            instance.getfocusAreaApiCallId = msggetAssessTestQuestionsList.messageId
            runEngine.sendMessage("Unit Test", msggetAssessTestQuestionsList)
            instance.setState({token:"eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MTkyLCJleHAiOjE2NzIyMjY2ODUsInRva2VuX3R5cGUiOiJsb2dpbiJ9.PY-GehPKm5dK90iVZTxTZBge_U41ctkc6QMFcPBc3HT7gQxwY_rsxt09qoOjCWf5CXwylQ8XV26w1FmMBcyUYA",loading:false,options:[].concat(data)})
        });
               
        
     
        when('I navigate to the ReassorOrContinue', () => {
            instance = ReassorOrContinueWrapper.instance() as ReassorOrContinue;
      
            });

    

        then('ReassorOrContinue will load with out errors', () => {
            expect(ReassorOrContinueWrapper).toBeTruthy();
            // expect(ReassorOrContinueWrapper).toMatchSnapshot();

        });

     
        then('I can select the button with with out errors', () => {
             instance.renderFocusAre(instance.state.options[0],0);
         
       
            let buttonComponent = ReassorOrContinueWrapper.findWhere((node)=>node.prop('testID')==='Background');
            buttonComponent.simulate('press')
    
           
                const btnNext=ReassorOrContinueWrapper.findWhere(
                    (node)=>node.prop("testID")==="btnNxt")
                // btnNext.simulate("press")
    
        
           expect(instance.props.navigation.navigate).toHaveBeenCalled();

           const btnreAssessProps=ReassorOrContinueWrapper.findWhere(
            (node)=>node.prop("testID")==="reAssessPress");
             expect(instance.props.navigation.navigate).toHaveBeenCalled();
     
    
         
        });


         then('I can leave the screen with out errors', () => {
            instance.componentWillUnmount()
            expect(ReassorOrContinueWrapper).toBeTruthy();
     });
        
})

});
