// @ts-nocheck
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
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
  emp_access_code:any;
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
  address:string;
  compid: any;
  user_name:string;
  role: string;
  
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class AddNewComController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  drawerRef: any = null;
  static contextType?: Context<any>= AppContext;
  getuserDetailsApiCallId:string="";
 
  addNewCoachApiCallId:string="";
  addNewCompApiCallId:string="";
  getComapnyDetailsApiCallId:string="";
  updateComapnyDetailsApiCallId:string="";
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
      user_name:"",
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
      address:"",
      emp_access_code:"",
      compid: '',
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
      const errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
    
     
        this.setState({ loading: false });

        if (errorReponse ) {
          console.log(errorReponse);

        }

      if (apiRequestCallId != null) {
        this.handleApiResponse(apiRequestCallId,responseJson);
      }
    }
    // Customizable Area End
  }

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


  async componentDidMount() {

    super.componentDidMount();

    this.setState({role:this.props.navigation.getParam("usertype"),compid:this.props.navigation.getParam("id")})
    
    this.getFocusOn();
   
   
  }

  getToken = () => {
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg); 
  }

  getFocusOn=()=>{
    if (this.isPlatformWeb() === false) {
    this.props.navigation.addListener('didFocus', () => {
          console.log("Will focues ")
          this.getComapnyDetails();
          this.getUserDataList();
         });
  
    }
  }
 
  creteNewCompDetailsApiCall=async()=>{
    this.setState({loading:true})
    let data = {}
  let  endPoint;
  let method;
   if(this.state.compid){
     data = {
      id:this.state.compid,
      name: this.state.full_name,
      email:this.state.email,
      address: this.state.address
    }
    endPoint= `bx_block_companies/update_company`;
    method= "PUT";
  }
   else{
     data = {
      name: this.state.full_name,
      email:this.state.email,
      address: this.state.address
    }
    endPoint= 'bx_block_companies/companies';
    method= "POST";
   }
   if(endPoint!=""&&method!=""){
    
    this.addNewCompApiCallId = await this.apiCall({
      contentType: "application/json",
      method:method, 
      endPoint:endPoint,
      body: data,
     });
    }
  }
  creteNewCompDetails = async () => {
    const pattern =/^[a-z0-9._%-]+@[a-z0-9.-]+.[a-z]{2,4}$/;
    const emailReg = new RegExp(pattern);
  
    if (this.state.full_name === '') {
      alert('please enter Comapny Name')
      return
    }

    if (!emailReg.test(this.state.email.trim())) {
      this.showAlert('Alert', 'Please enter valid Email Address')
      return;
    }
    if (this.state.address === '') {
      alert('Please enter Address ')
    }
  
  
    else {
    this.creteNewCompDetailsApiCall();
    }
}


  apiCall = async (data: any) => {
    // Customizable Area Start
    const { contentType, method, endPoint, body, type } = data
    const header = {
      'Content-Type': contentType,
      token: this.context?.state?.token
      // token: 'eyJhbGciOiJIUzUxMiJ9.eyJpZCI6OSwiZXhwIjoxNjY1MTQ4ODY5LCJ0b2tlbl90eXBlIjoibG9naW4ifQ.MdEdNCSP5hR88tNt0_CTdX5TGBWtYP3RVL0U9DU50UsOxE3Wu3_zqaFi06YTX8BfrpnXuKVZ08HA18J_4O8gWA'

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
  getComapnyDetails =  () => {
    
    let raw = {
        id: this.state.compid
      };
      
     if(this.state.compid){
    let urlParams = new URLSearchParams(raw).toString();
     this.getComapnyDetailsApiCallId = this.networkRequest({
      endPoint: `bx_block_companies/get_company?${urlParams}`,
      method: "GET",
      newState: { loading: true }
    });
  }
  };
  getUserDataList = async () => {
    this.getuserDetailsApiCallId = this.networkRequest({
      endPoint: "profile_details",
      method: "GET",
      newState: { loading: true }
    });
  };

  handleApiResponse=(apiRequestCallId:string,responseJson:any)=>{
      // Profile Image
       if(apiRequestCallId === this.getuserDetailsApiCallId){
        if(responseJson?.data){
            this.setState({
              prifileimage:responseJson?.data.attributes?.image,
              user_name: responseJson?.data.attributes?.full_name,
            
            })
          }
        }
        if(apiRequestCallId === this.addNewCompApiCallId){
           if(responseJson?.data){
               if(this.state.compid){
                 this.props.navigation.navigate('DetailComView',{id:this.state.compid})
          
               }else{
                 this.props.navigation.navigate('CoachList',{usertype:"Companies"})
            }
          
          }
        }
        if(apiRequestCallId === this.getComapnyDetailsApiCallId){
        if(responseJson?.data){
        this.setState({
         full_name:responseJson?.data?.attributes?.name,
         email:responseJson?.data?.attributes?.email,
         address:responseJson?.data?.attributes?.address,
         access_code:responseJson?.data?.attributes?.hr_code,
         emp_access_code:responseJson?.data?.attributes?.employee_code,
         loading: false
        });
        }
        }
}

  // Customizable Area End
}
