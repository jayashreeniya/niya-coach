// @ts-nocheck
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set_user_data } from "../../../components/src/context/actions";
import { initState } from "../../../components/src/context/appContextReducer";
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
  // Customizable Area Start
  loading: boolean;
  token: string;
  CompDataList: any[];
  prifileimage: any;
  full_name: string;
companyId: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class HRListController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  drawerRef: any = null;
  static contextType?: Context<any> = AppContext;
  getComapnyDetailsApiCallId: string = "";
  getuserDetailsApiCallId: string = "";
  devicetokenApiCallId: string = "";
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
      getName(MessageEnum.SessionSaveMessage),

      // Customizable Area End
    ];

    this.state = {
      // Customizable Area Start
      loading: false,
      token: "",
      CompDataList: [],
      prifileimage: "",
      full_name: "",
      companyId:''

      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
    
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
      const errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      if (errorReponse) {
        this.setState({ loading: false })
        return;
      }

      if (apiRequestCallId != null) {
        if (apiRequestCallId === this.getuserDetailsApiCallId) {
            this.setState({
              prifileimage: responseJson?.data.attributes?.image,
              full_name: responseJson?.data.attributes?.full_name,
              loading: false

            })
          
        }
        else if (apiRequestCallId === this.getComapnyDetailsApiCallId) {
          this.setState({ loading: false })
          
            this.setState({ CompDataList: responseJson?.data, loading: false })

          
        }
        // Customizable Area End
      }
    }
  }


  // Customizable Area Start

  networkRequest = ({
    endPoint,
    method,
    headers,
    body,
    newState
  }: {
    endPoint: string;
    headers?: Record<string, string>;
    body?: Record<string, any>;
    method: "GET" | "POST" | "PUT" | "DELETE";
    newState?: Partial<S>;
  }) => {
    if (typeof newState === "object") {
      this.setState(prev => ({ ...prev, ...newState }));
    }
    const defaultHeaders = {
      "Content-Type": configJSON.dashboarContentType,
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
  // Customizable Area End

   // Customizable Area Start
  logOut = async () => {
    await AsyncStorage.removeItem("fcmToken");
    this.saveFcmTOken(this.context.state.token);

    setTimeout(() => {
      this.context?.dispatch?.({ type: set_user_data, payload: initState });
    }, 500);
  }
  // Customizable Area End

   // Customizable Area Start
  saveFcmTOken = async (token: any) => {

    let fcmtoken = await AsyncStorage.getItem('fcmToken');
    console.log("fcm token", fcmtoken)

    const attrs = {
      device_token: fcmtoken
    };


    this.devicetokenApiCallId = this.networkRequest({
      endPoint: "bx_block_push_notifications/device_token",
      method: "POST",
      body: attrs,
      newState: { loading: true }
    });
  }
// Customizable Area End
   // Customizable Area Start
  getComapnyDetails = () => {

    let raw = {
      company_id: this.state.companyId
    };

    if (this.state.companyId) {

      let urlParams = new URLSearchParams(raw).toString();
      this.getComapnyDetailsApiCallId = this.networkRequest({
        endPoint: `bx_block_companies/get_hrs?${urlParams}`,
        method: "GET",
        newState: { loading: true }
      });
    }
  }
  // Customizable Area End

   // Customizable Area Start
  getUserDataList = async () => {
    this.getuserDetailsApiCallId = this.networkRequest({
      endPoint: "profile_details",
      method: "GET",
      newState: { loading: true }
    });
  };
// Customizable Area End

 // Customizable Area Start
  async componentDidMount() {

    super.componentDidMount();
    const id = this.props.navigation.getParam("id");
    if(id)
    {
      this.setState({companyId:id});
    }
    this.getFocusOn()
   

  }
  // Customizable Area End

   // Customizable Area Start
  getToken = () => {
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
  }
  // Customizable Area End
   // Customizable Area Start
  getFocusOn = () => {
      this.props.navigation.addListener('willFocus', () => {
        console.log("Will focues ")
         this.setState({ token: this.context.state.token, loading: true }, () => {
          this.getUserDataList();
          this.getComapnyDetails();

        });
      });    
  }

  // Customizable Area End
}
