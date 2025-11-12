import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import { runEngine } from "../../../framework/src/RunEngine";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";

// Customizable Area Start
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import { IBlock } from "../../../framework/src/IBlock";
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  // Customizable Area Start
  navigation: any;
  id: string;
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  loading: any;
  token: any;
  profileData: any;
  full_name:string,
  email: string,
  access_code: string,
  gender: string,
  phone_number: string,
  myProgressData: any;
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  navigation: any;
  // Customizable Area End
}

export default class JourneyDashBoardController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  userProfileApiCallId: any;
  getachievementApiCallId: any;
  getMyProgressApiCallId: string="";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.SessionResponseMessage)
    ];

    this.receive = this.receive.bind(this);
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    this.state = {
      loading: false,
      token: '',
      profileData:{},
      full_name:'',
      email:'',
      phone_number:'',
      access_code:'',
      gender:'',
      myProgressData: [{id: 6,name: "Team dynamics",percentage:20},{id: 5,name:"Prioritization", percentage:65},{id: 4,name:"Stratigic Planning",percentage:40},{id: 3,name:"Exercise Manage",percentage:75},{id: 2,name:"Time Manage",percentage:70}],
    }
    // Customizable Area End
  }


  async componentDidMount() {
    // Customizable Area Start
    super.componentDidMount();
     this.getToken();
    
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
  }

  //====================== receive function ================================
  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      this.setState({ token: this.context.state.token }, () => {
        this.getProfileData()
        this.getMyProgress();
      });
    }

    console.log("@@@ API MESSAGE Badge   =================", message);
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      )

      let responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      )
      let errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      )

      if (responseJson && !responseJson.errors) {
       if (apiRequestCallId === this.getachievementApiCallId){
          this.getSuccessCallBack(responseJson);
        }
        else if(apiRequestCallId === this.getMyProgressApiCallId)
        {
          console.log("My Progress Res>>", responseJson);
          this.setState({loading:false,myProgressData: responseJson?.data?.attributes?.focus_areas})
        }

      }
      else if (responseJson && responseJson.errors) {       
          this.getFailureCallBack(responseJson);     
      }
      else if (errorReponse) {
        console.log('errorReponse', errorReponse)
      }
    }
    // Customizable Area End
  }

  //================ success and failure call back ================
  getSuccessCallBack = async (responseJson: any) => {
    console.log("@@@ GateDataSuccessCallBack======", responseJson)
    let profilenm=responseJson.data.attributes.profile_name ? responseJson?.data.attributes?.profile_name:responseJson?.data?.attributes?.full_name;
    
    this.setState({
      full_name: profilenm,
      email: responseJson?.data.attributes?.email,
      access_code: responseJson?.data.attributes?.access_code,
      gender: responseJson?.data.attributes?.gender,
      phone_number: responseJson?.data.attributes?.phone_number,
      loading: false
    })
  };

  getFailureCallBack = (error: any) => {
    console.log("@@@ GateDataFailureCallBackk======", error)
    this.setState({loading: false})
  };
  // Customizable Area End

  //================== API Function Call ==================
  apiCall = async (data: any) => {
    // Customizable Area Start
    const { contentType, method, endPoint, body, type } = data
    const header = {
      'Content-Type': contentType,
      token: this.state.token
    }
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    )
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    )
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    )
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    )
    body && type != 'formData' ?
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      )

      : requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        body
      );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return requestMessage.messageId;
    // Customizable Area End
  };

  // Customizable Area Start
  static contextType: Context<any> | undefined = AppContext;

  getProfileData = async () => {
    this.setState({loading: true})
    this.getachievementApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      endPoint: 'profile_details'
    });
  };

  getMyProgress = async () => {
    this.setState({loading:true});
    this.getMyProgressApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      endPoint: 'bx_block_assessmenttest/my_progress'
    });
  }
  // Customizable Area End

}
