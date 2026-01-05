// @ts-nocheck
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { headerbg,headerRightImg } from "../../AssessmentTest/src/assets";
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";

import { BackHandler } from "react-native";
// Customizable Area End

export const configJSON = require("./config");
type ApiRequestParams = {
  headers?: Record<string, string>;
    endPoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    body?: Record<string, any>;
  }

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start

  // Customizable Area End
}

interface S {
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  // Customizable Area Start
  loading:boolean;
  token:string;
  question_id:any;
  answer_id:any;
  questionResponse: any[];
  selectedQue: any;
  qtnIndex: number;
  selectedCatId: number;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class WellBeingAssTestController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
   ansFirstQuestionApiCallId:string="";
   getQuestionsApiCallId: string="";
   getMoodsApiCallId: string="";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      
      // Customizable Area Start
      getName(MessageEnum.SessionResponseMessage),
      
      getName(MessageEnum.RestAPIResponceMessage),
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      // Customizable Area Start
    
    token:"",
    loading:false,
    answer_id:0,
    question_id:0,
   
    questionResponse: [],
    qtnIndex:0,
    selectedQue:{},
    selectedCatId:0
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);
    // Customizable Area Start
    
    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id ) {
        
      this.handleResponse(message)
    }
    // Customizable Area End
  }

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;
  cornerImgProps={
    source:headerRightImg
  }
  headerbgImgProps={
    source: headerbg
  }
  letsBeginPressProps={
    onPress:()=>{}
  }
  async componentDidMount() {
    super.componentDidMount();
    
    // Safely get categoryId from navigation params
    const categoryId = this.props.navigation.getParam?.('categoryId') 
      || this.props.navigation.state?.params?.categoryId
      || this.props.route?.params?.categoryId;
    
    console.log('[WellBeingAssTest] componentDidMount - categoryId:', categoryId);
    console.log('[WellBeingAssTest] navigation params:', this.props.navigation.state?.params);
    
    if (!categoryId) {
      console.error('[WellBeingAssTest] No categoryId provided!');
      this.setState({ loading: false, questionResponse: [] });
      return;
    }
    
    this.setState({ 
      token: this.context.state.token,
      selectedCatId: categoryId
    }, () => {
      console.log('[WellBeingAssTest] Making API call for category:', this.state.selectedCatId);
      this.getQuestions();
    });
    
    // Customizable Area Start
    BackHandler.addEventListener('hardwareBackPress',()=> true); 

    // Customizable Area End
  }

  handleResponse = (message:Message) => {
    const apiRequestCallId = message.getData(
      getName(MessageEnum.RestAPIResponceDataMessage)
    );
    let responseJson = message.getData(
      getName(MessageEnum.RestAPIResponceSuccessMessage)
    );
     let errorReponse = message.getData(
      getName(MessageEnum.RestAPIResponceErrorMessage)
    );
 if(errorReponse)
      {
        console.log('[WellBeingAssTest] API Error response:', errorReponse);
        this.setState({loading:false})
        return true;
      }
      else if(responseJson?.errors)
      {
        console.log('[WellBeingAssTest] API returned errors:', responseJson.errors);
        return true;
      }

    if (responseJson) {
      this.setState({loading:false});
      console.log('[WellBeingAssTest] API Response received:', JSON.stringify(responseJson).substring(0, 500));
 
  if(apiRequestCallId === this.getQuestionsApiCallId)
  {
      console.log('[WellBeingAssTest] Questions API response - data length:', responseJson?.data?.length);
      console.log('[WellBeingAssTest] Full response structure:', Object.keys(responseJson || {}));
      
      // Check if data exists and has questions
      if (!responseJson?.data || responseJson.data.length === 0) {
        console.log('[WellBeingAssTest] No questions found for category:', this.state.selectedCatId);
        this.setState({
          questionResponse: [],
          selectedQue: null,
          qtnIndex: 0,
          question_id: 0
        });
        return;
      }

      let fquestion = responseJson?.data[0]
     
      const firstUnansweredIndex = responseJson.data.findIndex(question => !question.attributes.question_answers.answered);
   
      this.setState({question_id: fquestion?.attributes?.question_answers?.question?.id,
        selectedQue:responseJson.data[firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0], 
        questionResponse: responseJson?.data,
        qtnIndex:firstUnansweredIndex !== -1 ? firstUnansweredIndex : 0
      });  


  }
  else if(apiRequestCallId === this.ansFirstQuestionApiCallId)
  {       
    this.handleQtnSubmitRes(responseJson);            
  }
  
  } 
  }

  handleQtnSubmitRes=(responseJson:any)=>{
    console.log('[WellBeingAssTest] handleQtnSubmitRes - response:', responseJson);
    console.log('[WellBeingAssTest] handleQtnSubmitRes - last_question:', responseJson?.last_question);
    console.log('[WellBeingAssTest] handleQtnSubmitRes - current qtnIndex:', this.state.qtnIndex);

    if(responseJson?.last_question)
    {
        console.log('[WellBeingAssTest] Last question reached, navigating to WellbeingScore');
        this.props.navigation.navigate("WellbeingScore",{isFrom:"test"});
    }else{
      const newIndex = this.state.qtnIndex + 1;
      console.log('[WellBeingAssTest] Moving to next question - newIndex:', newIndex);
      console.log('[WellBeingAssTest] Next question will be:', this.state.questionResponse[newIndex]);
      
      this.setState({ answer_id:"",question_id:"",qtnIndex: newIndex },()=>{
        console.log('[WellBeingAssTest] State updated - qtnIndex now:', this.state.qtnIndex);
        this.setState({selectedQue:this.state.questionResponse[this.state.qtnIndex]},()=>{
            console.log('[WellBeingAssTest] selectedQue now:', this.state.selectedQue?.attributes?.question_answers?.question?.question);
            // Fix: Use correct path to question id
            this.setState({question_id: this.state.selectedQue?.attributes?.question_answers?.question?.id});
        })
      });
    }

  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  nxtPressProps={
    onPress:()=>{
      console.log('[WellBeingAssTest] Next pressed - current state:', {
        qtnIndex: this.state.qtnIndex,
        question_id: this.state.question_id,
        answer_id: this.state.answer_id,
        selectedQue_id: this.state.selectedQue?.id,
        selectedQue_question_id: this.state.selectedQue?.attributes?.question_answers?.question?.id,
        totalQuestions: this.state.questionResponse?.length
      });
      
      const body = {
        question_id: Number(this.state.question_id),
        answer_id: Number(this.state.answer_id)
      }
      console.log('[WellBeingAssTest] Submitting answer:', body);
      
      if(this.state.answer_id=="" || this.state.question_id=="")
      {
        this.showAlert("Alert !","No option is selected");
      }
      else{
        this.ansFirstQuestion(body);
      }
    }
  }
 
  getQuestions(): boolean {
    // Customizable Area Start
    this.setState({loading:true});
    
    const endpoint = `bx_block_wellbeing/well_beings?category_id=${this.state.selectedCatId}`;
    console.log('[WellBeingAssTest] Calling API endpoint:', endpoint);
    console.log('[WellBeingAssTest] With token:', this.state.token ? 'Token present' : 'NO TOKEN!');
   
    const header = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getQuestionsApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endpoint
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "GET"
    );
    
    runEngine.sendMessage(requestMessage.id, requestMessage);
    // Customizable Area End
    return true;
  }
  ansFirstQuestion(body:any): boolean {
    // Customizable Area Start
    this.setState({loading:true});
    const header = {
      "Content-Type": configJSON.exampleApiContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.ansFirstQuestionApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      "bx_block_wellbeing/user_answer"
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "POST"
    );

    requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body) 
      );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    // Customizable Area End
    return true;
  }
  componentWillUnmount() {
    BackHandler?.removeEventListener('hardwareBackPress');
  }
  // Customizable Area End
}
