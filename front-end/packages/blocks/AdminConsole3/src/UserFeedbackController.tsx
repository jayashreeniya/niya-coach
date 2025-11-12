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
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  // Customizable Area Start
  prifileimage:any;
  full_name:string;
  loading:boolean;
  token:string;
  coachCount:number;
  empCount:number;
  compnyCount:number;
  searchString:string;
  DataList:[];
  userType:string;
  email:string;
  access_code:any;
  country_code:string;
  phone_number:any;
  isData: boolean;
  exp:any;
  data:any;
  categoriesArray: any;
  subCategory: string;
  selectedCategoryID: any;
  coach_full_name:string;
  coach_prifileimage:any;
  coach_email:any;
  enablePasswordField: boolean;
  password:string;
  reTypePassword: string;
  enableReTypePasswordField: boolean;
 
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class UserFeedbackController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  drawerRef: any = null;
  static contextType?: Context<any>= AppContext;
 
  getuserDetailsApiCallId:string="";
  getEmployeesApiCallId:string="";
  devicetokenApiCallId:string="";
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
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      // Customizable Area Start
      prifileimage:"",
      full_name:"",
      loading:false,
      token:"",
      coachCount:0,
      empCount:0,
      compnyCount:0,
      searchString:"",
      DataList:[],
      userType:"",
      email:"",
      access_code:"",
      country_code:"91",
      phone_number:"",
      isData: false,
      exp:'',
      data: [],
      categoriesArray: [],
      subCategory:"",
      selectedCategoryID: [],
      coach_full_name:"",
      coach_prifileimage:"",
      coach_email:"",
      password:"",
      enablePasswordField:false,
      reTypePassword: "",
      enableReTypePasswordField: false,
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    runEngine.debugLog("Message Recived", message);
    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
       this.setState({ token: this.context.state.token, loading: true }, () => {
        this.getUserDataList();
        this.getAllDataList();
      });
    
    }
  else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      let responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
      let errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
        this.setState({ loading: false });
        if(errorReponse)
        {
            this.showAlert("Error",errorReponse);
        }
        else if(responseJson?.errors || responseJson?.message)
      {
         this.handleError(responseJson);
      }
     if (responseJson) {
      // Profile Image
        if(apiRequestCallId === this.getuserDetailsApiCallId){
         this.handleUserDetResSuccess(responseJson)
        }
        if(apiRequestCallId === this.getEmployeesApiCallId){
            console.log(responseJson,"getEmployeesApiCallId responseJson");
           this.setState({DataList:responseJson?.data});  
        }                 
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  handleError=(responseJson:any)=>{
    this.showAlert(
      configJSON.errorTitle,
      responseJson?.errors ? responseJson?.errors[0] : responseJson?.message,
    );                    
  
  return false;
  }

handleUserDetResSuccess=(responseJson:any)=>{
  if(responseJson?.data){
    this.setState({
      prifileimage:responseJson?.data.attributes?.image,
      full_name: responseJson?.data.attributes?.full_name,
    
    })
  }
}
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
      token: this.context?.state?.token
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

  logOut = async () => {
    await AsyncStorage.removeItem("fcmToken");
    this.saveFcmTOken(this.context.state.token);
  
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
  getAllDataList = () => {
    const header = {
      "Content-Type": configJSON.appointmentApiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.getEmployeesApiCallId = requestMessage.messageId;
    
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `account_block/all_users_feedbacks`
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
  };

  getUserDataList = async () => {
    this.getuserDetailsApiCallId = this.networkRequest({
      endPoint: "profile_details",
      method: "GET",
      newState: { loading: true }
    });
  };
  
  
  async componentDidMount() {

    super.componentDidMount();
    
    this.getToken();
   

  }

  getToken = () => {
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg); 
  }
  

  // Customizable Area End
}
