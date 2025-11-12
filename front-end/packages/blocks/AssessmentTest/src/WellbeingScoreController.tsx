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
import { set_user_data } from "../../../components/src/context/actions";
import {BackHandler} from 'react-native';
// Customizable Area End

export const configJSON = require("./config");
type ApiRequestParams = {
  headers?: Record<string, string>;
  body?: Record<string, any>;
  endPoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
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
  token:string;
  question_id:any;
  loading:boolean;
  questionResponse: any[];
  answer_id:any;
  selectedQue: any;
  qtnIndex: number;
  selectedSubCat: string;
  selectedCat: string;
  isFrom: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class WellbeingScoreController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
   getScoresApiCallId: string="";
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
    question_id:0,
    answer_id:0,
    qtnIndex:0,
    
    selectedCat:'',
    questionResponse: [],
    selectedQue:{},
    selectedSubCat:'',
    isFrom:''
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
        const apiRequestCallId = message.getData(getName(MessageEnum.RestAPIResponceDataMessage));
        let responseJson = message.getData(getName(MessageEnum.RestAPIResponceSuccessMessage));
        
        let errorReponse = message.getData(getName(MessageEnum.RestAPIResponceErrorMessage));
      if(errorReponse)
      {
        this.setState({loading:false})
        return;
      }
      else if(responseJson?.errors || responseJson?.message)
      {             
        return false;
      }
      if (responseJson) {       
        this.setState({loading:false});             
        if(apiRequestCallId === this.getScoresApiCallId)
        {
          this.setState({
            loading:false
          });
          this.setState({
            questionResponse: responseJson?.data?.attributes?.results
          });                      
        }          
      } 
    }
    // Customizable Area End
  }

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;

  backWellbeingNavigation=()=>{
    if(this.state.isFrom=="drawer")this.props.navigation.goBack()
    else{ 
      if(this.context.state.isNew){
        const newState = {
          isNew: false,
          isshowReass:false
       }
      this.context.dispatch({ type: set_user_data, payload: newState });
       }
                       
      this.props.navigation.navigate('HomePage');
  }
  }
  cornerImgProps={
    source:headerRightImg
  }
  headerbgImgProps={
    source: headerbg
  }
  letsBeginPressProps={
    onPress:()=>{
    }
  }
  async componentDidMount() {
    super.componentDidMount();
   
     this.setState({ token: this.context.state.token, isFrom:this.props.navigation.state.params.isFrom ? this.props.navigation.state.params.isFrom : ''},()=>{
          
           
            this.getScores();
           
           });
   
    // Customizable Area Start
    BackHandler.addEventListener('hardwareBackPress',()=>this.backAction('wellbeingscore'))
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };


  getScores(): boolean {
    // Customizable Area Start
    this.setState({loading:true});
    const endPoint = this.state.isFrom=="test" ? `bx_block_wellbeing/get_result?value=true` : `bx_block_wellbeing/get_result?value=false` ;
   
    const header = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getScoresApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
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

   backAction = (from:string) => {
    if(this.props.navigation.isFocused()){
    this.props.navigation.navigate('HomePage');
    return true;
    }
    return BackHandler.exitApp();
  };
  componentWillUnmount() {
    BackHandler?.removeEventListener('hardwareBackPress');
  }


  // Customizable Area End
}
