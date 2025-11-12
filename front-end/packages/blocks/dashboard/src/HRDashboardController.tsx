import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set_user_data } from "../../../components/src/context/actions";
import { initState } from "../../../components/src/context/appContextReducer";
import { Alert } from "react-native";
// Customizable Area End

export const configJSON = require("./config.js");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}
interface S {
  // Customizable Area Start
  dashboardData: any;
  token: string;
  errorMsg: string;
  loading: boolean;
  data:any[];
  profile: Record<string, any>;
 
  // Customizable Area End
}
interface SS {
  id: any;
}

export default class CoachDashboardController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  apiDashboardItemCallId: string = "";
  dashboardApiCallId: string = "";
  getProfileDataApiCallId: string = "";
  devicetokenApiCallId: string = "";
  getDelAccApiCallId: string = "";
  drawerRef: any = null;
  // Customizable Area End
  
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);
    console.disableYellowBox = true;
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage)
    ];

    this.state = {
      dashboardData: [],
      errorMsg: "",
      token: "",
      loading: false,
      data:[],
      profile: {},
     };
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    super.componentDidMount();
    // this.getToken();
    // if (this.isPlatformWeb() === false) {
    //   this.props.navigation.addListener('willFocus', () => {
    //     this.getToken();
    //   });
    // }
    // Customizable Area Start
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener('willFocus', () => {
        this.setState({ token: this.context.state.token, loading: true }, () => {
          this.getHRDashboardDetails();
          this.getProfileData();
    
        });
      })
    }
  
 
    // Customizable Area End
  }
  
  getToken=()=>{
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
  }



  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const responseJson = message.getData(getName(MessageEnum.RestAPIResponceSuccessMessage));
      let errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      const apiRequestCallId = message.getData(getName(MessageEnum.RestAPIResponceDataMessage));
      
      if(errorReponse)
      {
        this.setState({loading:false})
        return;
      }
      else if(responseJson?.errors || (responseJson?.message ))
      {
        console.log(responseJson);
      }
      if (apiRequestCallId && responseJson) {
        setTimeout(() => {
          this.setState({loading:false});
        }, 1000);
        if(apiRequestCallId === this.dashboardApiCallId){
        
            this.setState({ data: responseJson?.data, loading: false });
       
        }
      else if(apiRequestCallId === this.getProfileDataApiCallId){
       
            this.setState({ profile: responseJson.data?.attributes || {}, loading: false });
   
        }
        else if(apiRequestCallId === this.getDelAccApiCallId){
       
          this.getDelAccApiCallIdRes(responseJson)
 
      }
      }
    }  
   
      this.setState({ loading: false });
     // Customizable Area End
    }
 
  

  // Customizable Area Start
  static contextType?: Context<any> = AppContext;


  networkRequest = ({
    endPoint,
    method,
    headers,
    body,
    newState
  }:{
    endPoint: string;
    headers?: Record<string, string>;
    body?: Record<string, any>;
    method: "GET" | "POST" | "PUT" | "DELETE";
    newState?: Partial<S>;
  }) => {
    if(typeof newState === "object"){
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
    if(body){
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      );
    }
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return requestMessage.messageId;
  }


  getHRDashboardDetails = () => {
     let raw = {
      token: this.state.token
    };
    let urlParams = new URLSearchParams(raw).toString();
    this.dashboardApiCallId = this.networkRequest({
      method: "GET",
      endPoint: `account_block/accounts/get_hr_details?${urlParams}`,
      newState: { loading: true }
    });
  }

  getProfileData = () => {
    console.log("getProfileData^&^&^&^&&^&^&^&",);
    this.getProfileDataApiCallId = this.networkRequest({
      endPoint: "profile_details",
      method: "GET",
      newState: { loading: true }
    });
  }



 

  logOut = async () => {
    await AsyncStorage.removeItem("fcmToken");
    this.saveFcmTOken(this.state.token);
   
    setTimeout(() => {
      this.context?.dispatch?.({ type: set_user_data, payload: initState });
    }, 500);
  }

  saveFcmTOken=async(token:any)=> {
   
    let fcmtoken=await AsyncStorage.getItem('fcmToken');
    console.log("fcm token",fcmtoken)
   
    const attrs = {
      device_token:fcmtoken
    };

   
    this.devicetokenApiCallId = this.networkRequest({
      endPoint: "bx_block_push_notifications/device_token",
      method: "POST",
      body:attrs,
      newState: { loading: true }
    });
  }

  getDelAccApiCallIdRes=(responseJson: any)=>{
    if (responseJson?.message && responseJson?.data) {
      Alert.alert("Success",responseJson?.message)
      this.logOut()
    } else if (responseJson?.data) {
      Alert.alert("Fail","Could not process your request. Try later")
    }
  }

  showDelAlert=()=>{
    Alert.alert('Confirm', 'Are you sure you wish to delete your account?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'default',
      },
      {text: 'Yes', onPress: () => {
        this.proceedToDel()
      },style: 'destructive'},
    ]);
  }

  proceedToDel=()=>{
    console.log('OK Pressed');
    this.getDelAccApiCallId = this.networkRequest({
      endPoint: "/account_block/delete_account",
      method: "GET"
    });
  }
  // Customizable Area End

}
