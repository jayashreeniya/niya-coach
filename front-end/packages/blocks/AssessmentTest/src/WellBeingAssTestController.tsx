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
    
       this.setState({ token: this.context.state.token,selectedCatId:this.props.navigation.state.params.categoryId},()=>{
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
        this.setState({loading:false})
        return true;
      }
      else if(responseJson?.errors)
      {
       
        return true;
      }

    if (responseJson) {
      this.setState({loading:false});        
 
  if(apiRequestCallId === this.getQuestionsApiCallId)
  {

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

    if(responseJson?.last_question)
    {
        this.props.navigation.navigate("WellbeingScore",{isFrom:"test"});
    }else{
this.setState({ answer_id:"",question_id:"",qtnIndex:  this.state.qtnIndex+1 },()=>{
  this.setState({selectedQue:this.state.questionResponse[this.state.qtnIndex]},()=>{
      this.setState({question_id:this.state.selectedQue?.id});
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
      
      const body = {
    
        question_id: Number(this.state.question_id),
        answer_id: Number(this.state.answer_id)
       
    }
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
      `bx_block_wellbeing/well_beings?category_id=${this.state.selectedCatId}`
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
      header
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
