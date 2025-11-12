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
import { Alert } from "react-native";
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
  token: any;
  isTalkabout: any;
  isData: boolean;
  isMessage: any;
  isResModal:boolean;
  modalSubtitle:string;
  loading:boolean
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  navigation: any;
  // Customizable Area End
}

export default class ContactUsController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  contactUsApiCallId: any;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.NavigationPayLoadMessage),
      getName(MessageEnum.CountryCodeMessage),
      getName(MessageEnum.SessionResponseMessage)
    ];

    this.receive = this.receive.bind(this);
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    this.state = {
      token: '',
      isTalkabout: "",
      isData: false,
      isMessage: "",
      isResModal:false,
      modalSubtitle:"",
      loading:false
    };
    // Customizable Area End
  }


  async componentDidMount() {
    // Customizable Area Start
    super.componentDidMount();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener('willFocus', () => {
        this.setState({token:this.context?.state?.token});
      });
    }
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
  }

  //====================== receive function ================================
  async receive(from: string, message: Message) {
    // Customizable Area Start
    
   if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      )

      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      )
      const errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      )
      this.setState({loading:false})
      
      if (responseJson && !responseJson.errors) {
        if (apiRequestCallId === this.contactUsApiCallId) {
          this.contactUsSuccessCallBack(responseJson);
        } 

      }
      else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.contactUsApiCallId) {
          this.contactUsFailureCallBack(responseJson)
        } 

      } else if (errorReponse) {
        console.log('errorReponse', errorReponse)
      }
    }
    // Customizable Area End
  }

  //================ success and failure call back ================
  contactUsSuccessCallBack = async (responseJson: any) => {
    this.setState({isResModal:true,modalSubtitle: responseJson.meta.message,})
    console.log("@@@ contact us success call back======", responseJson)
 
  };

  contactUsFailureCallBack = (error: any) => {
    console.log("@@@ contact us FailureCallBackk======", error)
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
    console.log('hgdscfyhavdydfye', requestMessage)
    return requestMessage.messageId;
    // Customizable Area End
  };

  contactUs = async () => {
    this.setState({loading:true})
    if(this.state.isMessage==""){
      Alert.alert(
        "Error",
        "Please Enter Your Message  ",
        [
            { text: "OK"}
        ]
    );
     // Customizable Area Start
    this.setState({loading:false})
     // Customizable Area End
    return
    }

  // Customizable Area Start
  // Customizable Area End
    let body = {
      data: {
          description : this.state.isMessage
      }
  }
    this.contactUsApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "POST",
      endPoint: 'bx_block_contact_us/contacts',
      body: body
    });
  }

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;

  // Customizable Area End

}
