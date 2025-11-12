// @ts-nocheck
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible,headerbg,headerRightImg } from "./assets";

import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";

// Customizable Area End

export const configJSON = require("./config");

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
  options:any[];
  token:string;
  loading:boolean;
  answer_id:any;
  sequence_number:any;
  question_id:any;
  lastque_number:any
  isModal:boolean;
  isFirst:boolean;
  last_score:number;
  type_queId:string,
  test_Res:any,
  modalSubtitle:string;
  u_Are:string;
  result:string;
  max_lenght:number,
  show_value:number

  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class AssessmentTestController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
   getAssessTestQuestionsListApiCallId:string="";
   answersforAssessYourselfTestQue:string="";
   chooseMultipleAnsForItem:string="";
   getAssessScoreApiCallId:string="";
 
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
    options:[],
    token:"",
    loading:false,
    sequence_number:0,
    lastque_number:0,
    answer_id:0,
    question_id:0,
    isModal:false,
    isFirst:true,
    last_score:0,
    type_queId:"0",
    max_lenght:100,
    test_Res:false,
    modalSubtitle:"Last time you took the test,your score was",
    u_Are:'which means -',
    result:"",
    show_value:0
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {

    // Customizable Area Start
     if (getName(MessageEnum.SessionResponseMessage) === message.id) {
    
      runEngine.debugLog("Message Recived", message);
    
       this.setState({ token: this.context.state.token,loading:true },()=>{
        this.getAssessYourselfTestQues()
       });
    
  
      }
    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id ) {
        const apiRequestCallId = message.getData(
            getName(MessageEnum.RestAPIResponceDataMessage)
          );
        const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
     
     
      if (apiRequestCallId && responseJson) {
   
      if (apiRequestCallId===this.getAssessTestQuestionsListApiCallId ) {
          this.setState({loading:false});
   
          if(responseJson.errors != undefined) {
          this.showAlert("Alert", "question not found", "");
         

          return false;
        }else{
          this.setState({options:responseJson.data})
          return false;
        }
      }
      if (apiRequestCallId===this.answersforAssessYourselfTestQue ) {
          this.setState({loading:false});
          if(responseJson.errors != undefined) {
          setTimeout(()=>{
            this.showAlert(
             configJSON.errorTitle,
              JSON.stringify(responseJson.errors),
            );
          },500)
          return false;
        }else{
            this.setState({sequence_number:this.state.sequence_number+1, answer_id:0,
              question_id:0});
          if(this.state.sequence_number>this.state.lastque_number){
            this.setState({isFirst:false,options:[],loading:true});
            this.getScoressessYourselfTestQues();
           }
          return false;
        }
      }
      if (apiRequestCallId===this.chooseMultipleAnsForItem ) {
          this.mulAnsForitmHandlingApires(responseJson);
       
      }
      if (apiRequestCallId===this.getAssessScoreApiCallId ) {
       
          this.accessScoreHandApi(responseJson);
         }
      } 
    }
    // Customizable Area End
  }

  txtInputWebProps = {
    onChangeText: (text: string) => {
      this.setState({ txtInputValue: text });
    },
    secureTextEntry: false,
  };

  txtInputMobileProps = {
    ...this.txtInputWebProps,
    autoCompleteType: "email",
    keyboardType: "email-address",
  };

  txtInputProps = this.isPlatformWeb()
    ? this.txtInputWebProps
    : this.txtInputMobileProps;

  btnShowHideProps = {
    onPress: () => {
      this.setState({ enableField: !this.state.enableField });
      this.txtInputProps.secureTextEntry = !this.state.enableField;
      this.btnShowHideImageProps.source = this.txtInputProps.secureTextEntry
        ? imgPasswordVisible
        : imgPasswordInVisible;
    },
  };

  btnShowHideImageProps = {
    source: this.txtInputProps.secureTextEntry
      ? imgPasswordVisible
      : imgPasswordInVisible,
  };

  btnExampleProps = {
    onPress: () => this.doButtonPressed(),
  };

  doButtonPressed() {
    let msg = new Message(getName(MessageEnum.AccoutLoginSuccess));
    msg.addData(
      getName(MessageEnum.AuthTokenDataMessage),
      this.state.txtInputValue
    );
    this.send(msg);
  }

  // web events
  setInputValue = (text: string) => {
    this.setState({ txtInputValue: text });
  };

  setEnableField = () => {
    this.setState({ enableField: !this.state.enableField });
  };

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;

  cornerImgProps={
    source:headerRightImg
  }
  headerbgImgProps={
    source:headerbg
  }
  letsBeginPressProps={
    onPress:()=>{
     
    }
  }
  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
    // Customizable Area Start
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  getAssessYourselfTestQues = () => {
     const header = {
      "Content-Type": configJSON.appointmentApiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

 

    this.getAssessTestQuestionsListApiCallId = requestMessage.messageId;
 
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.assessYourself}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  getScoressessYourselfTestQues = () => {
     const header = {
      "Content-Type": configJSON.appointmentApiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

 
    this.getAssessScoreApiCallId = requestMessage.messageId;
    let httpBody = {
      assess_yourself_id: this.state.type_queId
    };
    let urlParams = new URLSearchParams(httpBody).toString();

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `assess_score?${urlParams}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.validationApiMethodType
    );
 
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  nxtPressProps={
    onPress:()=>{
     
   
      if(this.state.sequence_number==0){
        this.setState({type_queId:this.state.answer_id});
       
      
        this.assessYourselfChooseAnsGetNxtQues()
      
   
      }
      else {
       
         this.assessSelectAnswersForTypeQues();
      }
     }
  }
  assessYourselfChooseAnsGetNxtQues =()=>{
      
    if(this.state.answer_id==0){
      this.showAlert(
        configJSON.errorTitle,
        "No option is selected"
      );
       return false;
    }
   
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token:this.state.token,
    };
   
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.chooseMultipleAnsForItem = requestMessage.messageId;
   
       const httpBody = {
        assess_yourself_question_id: this.state.question_id,
        assess_yourself_answer_id:  this.state.answer_id,
      };
    this.setState({loading:true})
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.chooseAndGetNxtQueForAssYourself}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.exampleAPiMethod
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    }
   assessSelectAnswersForTypeQues=()=>{
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token:this.state.token,
    };
    if(this.state.sequence_number==0||this.state.question_id==0||this.state.answer_id==0){
      this.showAlert(
        configJSON.errorTitle,
        "No option is selected"
      );
      return false;
    }
 
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.answersforAssessYourselfTestQue = requestMessage.messageId;
    this.setState({loading:true})
   
       const httpBody = {
       sequence_number: this.state.sequence_number,
       question_id:this.state.question_id,
       answer_id:  this.state.answer_id,
      };
  
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.answerForAssYourslefTypeQue}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.exampleAPiMethod
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);

  }
  closeModalOrBackToHome=()=>{
    if(this.state.isFirst||this.state.test_Res){
      this.getAssessYourselfTestQues();
    }
    else  this.props.navigation.navigate('HomePage');
  }
  accessScoreHandApi=(responseJson:any)=>{
    if(responseJson.errors != undefined) {
      setTimeout(()=>{
        this.showAlert(
         configJSON.errorTitle,
          JSON.stringify(responseJson.errors),
        );
      },500)
      return false;
    }else{
      if(responseJson.score[0].color=="Red"){
        this.setState({loading:false,isModal:true,isFirst:false,modalSubtitle:"You completed the test and your score is ",test_Res:responseJson.score[0].result,u_Are:'This means -',last_score:90,show_value:responseJson.score[0].total_score,result:responseJson.score[0].anixety_title,max_lenght:responseJson?.score[0].max_score})

      } else if(responseJson.score[0].color == "Orange"){
        this.setState({loading:false,isModal:true,isFirst:false,modalSubtitle:"You completed the test and your score is ",test_Res:responseJson.score[0].result,u_Are:'This means -',last_score:65,show_value:responseJson.score[0].total_score,result:responseJson.score[0].anixety_title,max_lenght:responseJson?.score[0].max_score})
      }else if(responseJson.score[0].color == "Yellow"){
        this.setState({loading:false,isModal:true,isFirst:false,modalSubtitle:"You completed the test and your score is ",test_Res:responseJson.score[0].result,u_Are:'This means -',last_score:45,show_value:responseJson.score[0].total_score,result:responseJson.score[0].anixety_title,max_lenght:responseJson?.score[0].max_score})
      }else if(responseJson.score[0].color == "Light-green"){
        this.setState({loading:false,isModal:true,isFirst:false,modalSubtitle:"You completed the test and your score is ",test_Res:responseJson.score[0].result,u_Are:'This means -',last_score:25,show_value:responseJson.score[0].total_score,result:responseJson.score[0].anixety_title,max_lenght:responseJson?.score[0].max_score})
      }else if(responseJson.score[0].color == "Green"){
        this.setState({loading:false,isModal:true,isFirst:false,modalSubtitle:"You completed the test and your score is ",test_Res:responseJson.score[0].result,u_Are:'This means -',last_score:10,show_value:responseJson.score[0].total_score,result:responseJson.score[0].anixety_title,max_lenght:responseJson?.score[0].max_score})
      }
      else if(responseJson.score[0].color==null){
       
        this.setState({loading:false})
        this.props.navigation.navigate("HomePage");
      } 
      
    }
  }
  mulAnsForitmHandlingApires=(responseJson:any)=>{
    if(responseJson.errors != undefined) {
      setTimeout(()=>{
        this.showAlert(
         configJSON.errorTitle,
          JSON.stringify(responseJson.errors),
        );
      },500)
      return false;
    }else{
     this.setState({options:[].concat(responseJson.data),sequence_number:1,lastque_number:responseJson.data.attributes.upcoming_questions_and_answers.length,answer_id:0,question_id:0,isModal:responseJson.data?.attributes?.total_score?.length>0?true:false,loading:false,show_value:responseJson.data?.attributes?.total_score[0]?.total_score,result:responseJson.data?.attributes?.total_score[0]?.anixety_title,isFirst:true,max_lenght:responseJson.data?.attributes?.total_score[0]?.max_score})
      if(responseJson.data?.attributes?.total_score[0]?.color=="Red"){
        this.setState({last_score:90})
      } else if(responseJson.data?.attributes?.total_score[0]?.color=="Orange"){
        this.setState({last_score:65})
      }
      else if(responseJson.data?.attributes?.total_score[0]?.color=="Yellow"){
        this.setState({last_score:45})
      }
      else if(responseJson.data?.attributes?.total_score[0]?.color=="Light-green"){
        this.setState({last_score:25})
      }
      else if(responseJson.data?.attributes?.total_score[0]?.color=="Green"){
        this.setState({last_score:10})
      }
   
    }
  }
  // Customizable Area End
}
