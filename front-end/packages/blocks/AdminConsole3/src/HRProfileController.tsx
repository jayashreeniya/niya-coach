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
  prifileimage: any;
  full_name: string;
  hr_name: string;
  is_hr_name:boolean
  hr_email: any;
  is_hr_email:boolean
  is_phone_number:any;
  phone_number: any;
  hr_id: any;
  company_id: any;
  role: string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class HRProfileController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  drawerRef: any = null;
  static contextType?: Context<any>= AppContext;

  UpdateHRApiCallId: string = "";
  getuserDetailsApiCallId: string = "";
  getComapnyHRDetailsApiCallId: string = "";
  DelHRApiCallId: string = "";
  devicetokenApiCallId: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
     
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),

      
    ];
    // Customizable Area End  

    this.state = {
      // Customizable Area Start
      is_hr_email:false,
      is_phone_number:false,
      is_hr_name:false,
      loading: false,
      token: "",
      prifileimage: "",
      full_name: "",
      hr_name: "",
      hr_email: "",
      phone_number: "",
      hr_id: '',
      company_id: '',
      role:''
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
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
      let errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      if(errorReponse)
      {
        this.setState({loading:false})
      }
      else if(responseJson?.errors || (apiRequestCallId!=this.getuserDetailsApiCallId))
      {
        this.parseApiErrorResponse(responseJson);
      }
      if (apiRequestCallId != null && responseJson) {
       this.responseHandling(apiRequestCallId,responseJson)
        
      }
    }
    // Customizable Area End
  }


  // Customizable Area Start

responseHandling=(apiRequestCallId:any,responseJson:any)=>{
 
 if (apiRequestCallId === this.getuserDetailsApiCallId) {
  if (responseJson.message) {
    this.setState({ loading: false })
    return;
  } else if (responseJson?.data) {
    this.setState({
      prifileimage: responseJson?.data.attributes?.image,
      full_name: responseJson?.data.attributes?.full_name,
      loading: false

    })
  }
 }else{
  this.hrResponseHandling(apiRequestCallId,responseJson);
 }
}
// Customizable Area End

// Customizable Area Start
hrResponseHandling=(apiRequestCallId:any,responseJson:any)=>{

if (apiRequestCallId === this.getComapnyHRDetailsApiCallId) {
  this.setState({ loading: false })
  if (responseJson?.data) {
    this.setState({ hr_name: responseJson?.data?.full_name, hr_email: responseJson?.data?.email, phone_number: responseJson?.data?.mobile_no.slice(2), loading: false })
  }
}

if (apiRequestCallId === this.UpdateHRApiCallId) {
  this.setState({ loading: false })
   if (responseJson?.message) {
      this.props.navigation.navigate('HRListsScreen',{id:this.state.company_id});
  }
}

if (apiRequestCallId === this.DelHRApiCallId) {
  this.setState({ loading: false })
  if (responseJson?.message) {
     this.props.navigation.navigate('HRListsScreen', { id: this.state.company_id });
  }
}
}
// Customizable Area End

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
    if (body) {
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        body
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
  // Customizable Area End

  // Customizable Area Start
  getComapnyHRDetails = () => {

    const raw = {
      hr_id: this.state.hr_id
    };

    if (this.state.hr_id) {

      let urlParams = new URLSearchParams(raw).toString();
      this.getComapnyHRDetailsApiCallId = this.networkRequest({
        endPoint: `bx_block_admin/get_hr?${urlParams}`,
        method: "GET",
        newState: { loading: true }
      });
    }
  }
  // Customizable Area End

  // Customizable Area Start
  updateComHRDetApiCall=()=>{
    if (this.state.hr_id) {
      this.setState({ loading: true })
  
      let formdata1 = new FormData();

      formdata1.append("account[hr_id]", this.state.hr_id);

     if(this.state.is_hr_name){ 
      formdata1.append("account[full_name]", this.state.hr_name);
    }
     if(this.state.is_phone_number){
       formdata1.append("account[full_phone_number]", `${'91'}${this.state.phone_number}`);
      }
     if(this.state.is_hr_email){ 
      formdata1.append("account[email]", this.state.hr_email);
    }


      const header = {
        contentType: "multipart/form-data",
        token: this?.context?.state?.token
      };
      const requestMessage = new Message(
        getName(MessageEnum.RestAPIRequestMessage)
      );

      this.UpdateHRApiCallId = requestMessage.messageId;
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        'bx_block_admin/update_hr'
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestHeaderMessage),
        JSON.stringify(header)
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        formdata1
      );

      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestMethodMessage),
        'POST'
      );

      runEngine.sendMessage(requestMessage.id, requestMessage);

      return true;
    }
  }
// Customizable Area End

// Customizable Area Start
  updateCompHRDetails = () => {
    const pattern =/^[a-z0-9._%-]+@[a-z0-9.-]+.[a-z]{2,4}$/;
    const emailReg = new RegExp(pattern);
  
    if (this.state.hr_name === '') {
      alert('please enter HR Name')
    }

    if (!emailReg.test(this.state.hr_email.trim())) {
      this.showAlert('Alert', 'Please enter valid Email Address')
        }

    if (this.state.phone_number === '') {
      alert('please enter Phone Number')
    }
    else {
      this.updateComHRDetApiCall();
  
    }

  }
  // Customizable Area End

  // Customizable Area Start
  delCompHRDetails = () => {

    if (this.state.hr_id) {
      this.setState({ loading: true })
      this.DelHRApiCallId = this.networkRequest({
        method: 'DELETE',
        endPoint: `bx_block_admin/delete_hr?hr_id=${this.state.hr_id}`,
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
  getFocusOn=()=>{
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener('willFocus', () => {
          console.log("Will focues ")
          this.getUserDataList();
          this.getComapnyHRDetails()
    });
  
    }
  }
  // Customizable Area End

  // Customizable Area Start
  async componentDidMount() {
  
    super.componentDidMount();

    const role = this.props.navigation.getParam("usertype");
    if(role)
    {
      this.setState({role:role});
    }
   const id = this.props.navigation.getParam("id");
   if(id)
   {
    this.setState({hr_id:id});
   }
   const compId =this.props.navigation.getParam("comany_id");
   if(compId)
   {
      this.setState({company_id:compId});
   }
    this.getFocusOn();
   

  }
  // Customizable Area End

  // Customizable Area Start
  getToken = () => {
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
  }
 

  // Customizable Area End
}
