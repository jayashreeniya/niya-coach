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
// Customizable Area End

export const configJSON = require("./config");
type ApiRequestParams = {
    endPoint: string;
    headers?: Record<string, string>;
    body?: Record<string, any>;
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
  options:any[];
  token:string;
  loading:boolean;
  answer_id:any;
  question_id:any;
  motionId: string;
  questionResponse: any[];
  isFirstQuestionAnswered: boolean;
  selectedMood: any;
  selectedGameInfo: any;
  selectedGameName: string;
  showTxtConfirmModal: boolean;
  showGConfirmModal: boolean;
  whatwereyouupto: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class EmoJourney1Controller extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
   ansFirstQuestionApiCallId:string="";
   getQuestionsApiCallId: string="";
   getMoodsApiCallId: string="";
   getStartGamesApiCallId: string="";
   postCommentApiCallId: string="";
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
    answer_id:0,
    question_id:0,
    motionId:'',
    questionResponse: [],
    isFirstQuestionAnswered: false,
    selectedMood: {},
    selectedGameInfo: {},
    selectedGameName: '',
    showGConfirmModal: false,
    showTxtConfirmModal: false,
    whatwereyouupto: ''
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);

    // Customizable Area Start
    
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id ) {
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
        return;
      }
      else if(responseJson?.errors || (responseJson?.message && apiRequestCallId!=this.getStartGamesApiCallId))
      {
         console.log(errorReponse,responseJson);
        return false;
      }


      if (apiRequestCallId && responseJson) {
        setTimeout(() => {
          this.setState({loading:false});
        }, 1000);
     
      if(apiRequestCallId === this.getQuestionsApiCallId)
      {
        this.setState({loading:false});
         
               let fquestion = responseJson.data?.attributes?.motion_question_answer[0];
              this.setState({question_id: fquestion, questionResponse: responseJson.data?.attributes?.motion_question_answer},()=>{
                console.log("Question Selected>>",this.state.question_id);
              });
            
          
      }
      else if(apiRequestCallId === this.ansFirstQuestionApiCallId)
      {
        this.handleAnsQuestionSuccess(responseJson);
            
      }
      else if(apiRequestCallId===this.getMoodsApiCallId)
      {
        this.handleGetMoodsSuccess(responseJson);

      }
      else if(apiRequestCallId===this.getStartGamesApiCallId)
      {
        this.setState({loading:false,showGConfirmModal: false,showTxtConfirmModal:false});
        console.log("Games Start API response>>",responseJson);
        this.props.navigation.navigate("GameScreen", { game: this.state.selectedGameName });
      }
      else if(apiRequestCallId=== this.postCommentApiCallId)
      {
        console.log("postCommentApi Res>>",responseJson);
        this.setState({loading:false,showGConfirmModal: true,showTxtConfirmModal:false,whatwereyouupto:''});
      }
     
      } 
    }
    // Customizable Area End
  }

  // Customizable Area Start
  static contextType: Context<any> | undefined = AppContext;

  cornerImgProps={
    source:headerRightImg
  }
  headerbgImgProps={
    source: headerbg
  }
  letsBeginPressProps={
    onPress:()=>{
      console.log("pressed")
    }
  }
  async componentDidMount() {
    super.componentDidMount();
     this.setState({motionId: this.props.navigation.state.params.motionId},()=> {
        this.setState({ token: this.context.state.token,loading:true },()=>{
           let frmdata = new FormData();
            frmdata.append("motion",this.state.motionId);
            this.getQuestions(frmdata);
            this.getMoods();
           });
    }); 

   
    // Customizable Area Start
    // Customizable Area End
  }

  handleErrors=(responseJson:any)=>{
    if(responseJson?.errors != undefined || responseJson?.message)
        {
            this.showAlert(
                  configJSON.errorTitle,
                  responseJson?.errors ?JSON.stringify(responseJson?.errors[0]): JSON.stringify(responseJson?.message),
                );
             
        }
        return false;
  }

  handleAnsQuestionSuccess=(responseJson:any)=>{
    this.setState({loading:false});
       
     const { meta } = responseJson;
    if(!this.state.isFirstQuestionAnswered)
    {
      this.setState({selectedGameInfo:meta?.game_choosen, selectedGameName: meta?.game_choosen?.game_choosen},()=>{
        });

      this.setState({ isFirstQuestionAnswered: true});
    }
    else if(this.state.isFirstQuestionAnswered)
    {
        if(this.state.selectedMood && (this.state.selectedMood?.attributes?.motion_title=="great"|| this.state.selectedMood?.attributes?.motion_title=="good"))
        {
            this.props.navigation.navigate("Weareglad");
        }
        else{
           this.setState({showGConfirmModal:false, showTxtConfirmModal: true});
        }
        
    }
  }

  handleGetMoodsSuccess=(responseJson:any)=>{
    this.setState({loading:false});
    if(responseJson?.data)
    {
        let selected = responseJson?.data.find((item:any)=> item.id==this.state.motionId);
        this.setState({options:responseJson?.data,selectedMood:selected});
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
    
        motion_question_id: Number(this.state.question_id),
        motion_answer_id: Number(this.state.answer_id)
       
    }
      if(this.state.answer_id=="" || this.state.question_id=="")
      {
        this.showAlert("Error","Please select an answer");
        return false;
      }
      
      this.ansFirstQuestion(body);
       
    }
  }
 
  getMoods = () => {
    this.getMoodsApiCallId = this.makeApiRequest({
      endPoint: "motions",
      method: "GET"
    });
  }

  getStartGames = () => {
    this.setState({loading:true});
    this.getStartGamesApiCallId = this.makeApiRequest({
      endPoint: "bx_block_assessmenttest/start_game",
      method: "GET"
    });
  }

  postComment = ()=> {
    if(this.state.whatwereyouupto.trimStart()!=this.state.whatwereyouupto){
      this.showAlert("Inavlid input","Please provide a valid input")
      return
  }   
    this.setState({loading:true});
    this.postCommentApiCallId = this.makeApiRequest({
      endPoint: "bx_block_assessmenttest/activity",
      method: "POST",
      body: { focus_text_box: this.state.whatwereyouupto }
    });
  }


  makeApiRequest = ({ endPoint, method, headers, body }: ApiRequestParams) => {
    this.setState({ loading: true });
    const defaultHeaders = {
      "Content-Type": "application/json",
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers || defaultHeaders)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    );
    if (body) {
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      );
    }
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return requestMessage.messageId;
  }
  getQuestions(body:any): boolean {
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
      "select_motion"
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
        body 
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
      "select_motion_answers"
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

  // Customizable Area End
}
