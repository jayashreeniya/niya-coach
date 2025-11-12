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
  token:string;
  loading:boolean;
  coachID: number;
  coachRating: number;
  appRating: number;
  feedBack: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class RattingController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
   
  postRatingApiCallId: string="";
  
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
    coachID:0,
    coachRating:0,
    appRating:0,
        feedBack:''
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
      console.log(errorReponse,"errorReponse&&&&&rating");
     
      if(errorReponse )
      {
        this.setState({loading:false});
        this.showAlert(configJSON.errorTitle, errorReponse);
        return false;
      }
      else if(responseJson?.errors != undefined ){
        this.setState({loading:false});
        this.showAlert(configJSON.errorTitle,  responseJson?.errors[0]);
        return false;
      }
      
      if(apiRequestCallId === this.postRatingApiCallId)
      {
        if(responseJson?.message)
        {
          this.setState({loading:false})
          this.showAlert(configJSON.errorTitle, responseJson?.message);
          return false;
        }

        this.setState({loading:false});
        this.props.navigation.navigate('HomePage');
          console.log("Results Res>>>",JSON.stringify(responseJson));
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
    
  console.log("Coach parameter>>", this.props.navigation.state.params.coachId);
  this.setState({coachID:this.props.navigation.state.params.coachId})
       
        this.setState({ token: this.context.state.token},()=>{
            
           });
    

 
    // Customizable Area Start
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  submitPressProps={
    onPress:()=>{
      console.log("--------",this.state.coachRating,this.state.appRating);
      const body = {
        rating:{
            app_rating: this.state.appRating,
            coach_rating:this.state.coachRating,
            coach_id:this.state.coachID,
            feedback: this.state.feedBack
        }
    }
      if(this.state.appRating==0 || this.state.coachRating==0)
      {
        this.showAlert("Error","Please rate");
       
      }
      else{
        console.log("body>>",body);
        this.postRating(body);
      }
      
  
      
     
    }
  }

  bookacallPressProps={
    onPress:()=>{
      console.log("Book a Call clicked");
      
    this.props.navigation.navigate('Appointments');
      
     
    }
  }
 

  postRating(body:any): boolean {
    // Customizable Area Start
    this.setState({loading:true});
   
    const header = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.postRatingApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      "account_block/ratings"
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      header
    );

    requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "POST"
    );
    
    runEngine.sendMessage(requestMessage.id, requestMessage);
    // Customizable Area End
    return true;
  }
  

  // Customizable Area End
}
