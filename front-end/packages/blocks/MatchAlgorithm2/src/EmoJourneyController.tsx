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
  data: any;
  
  // Customizable Area End
}

interface SS {
  // Customizable Area Start
  navigation: any;
  // Customizable Area End
}

export default class EmoJourneyController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getJourneyApiCallId: any;
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
      data:[]
    }
    // Customizable Area End
  }


  async componentDidMount() {
    // Customizable Area Start
    super.componentDidMount();
     this.getToken();
     this.props.navigation.addListener('willFocus', () => {
      this.setState({ token: this.context.state.token }, () => {
        this.getJourneyData();
      });
     })
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
        this.getJourneyData();
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
        if (apiRequestCallId === this.getJourneyApiCallId) {
          console.log("Journey Data>>>", JSON.stringify(responseJson));
          this.setState({loading:false,data:responseJson?.status});
        } 

      }
      else if (responseJson && responseJson.errors) {
        if (apiRequestCallId === this.getJourneyApiCallId) {
          console.log("api error>>",responseJson.errors);
        } 

      } else if (errorReponse) {
        console.log('errorReponse', errorReponse)
      }
    }
    // Customizable Area End
  }

 

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
  static contextType?: Context<any>= AppContext;

  // ============== Journey Data ============
  getJourneyData = async () => {
    this.setState({loading: true})
    this.getJourneyApiCallId = await this.apiCall({
      contentType: "application/json",
      method: "GET",
      endPoint: 'emo_journey_status'
    });
  };

  
  // Customizable Area End

}
