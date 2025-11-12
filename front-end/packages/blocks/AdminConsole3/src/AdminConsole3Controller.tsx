// @ts-nocheck
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible, PasswordVisible } from "./assets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set_user_data } from "../../../components/src/context/actions";
import { initState } from "../../../components/src/context/appContextReducer";
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import { Alert } from "react-native";

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
  subCategory: string;
  coach_full_name:string;
  coach_prifileimage:any;
  coach_email:any;
 ugList:any[];
 companyList:any[];
 coachList:any[];
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class AdminConsole3Controller extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  drawerRef: any = null;
  static contextType?: Context<any>= AppContext; 
  getuserDetailsApiCallId:string="";
  getCountApiCallId:string="";
  getEmployeesApiCallId:string="";
  getCoachExpertiseApiCallId:string="";
  addNewCoachApiCallId:string="";
  devicetokenApiCallId:string="";
  getDelAccApiCallId:string="";
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
       subCategory:"",
      coach_full_name:"",
      coach_prifileimage:"",
      coach_email:"",
      ugList:[],
      companyList:[],
      coachList:[]
       // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    runEngine.debugLog("Message Recived", message);

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
      if (apiRequestCallId != null) {
      // Profile Image
        if(apiRequestCallId === this.getuserDetailsApiCallId){
          this.handleUserDetailsApiResponseJson(responseJson);
        }
        if(apiRequestCallId === this.getCountApiCallId){
          this.handleCountApiResponseJson(responseJson);
         }
         if(apiRequestCallId === this.getEmployeesApiCallId){
          this.handleResponseJson(responseJson);
         }
         if(apiRequestCallId === this.getDelAccApiCallId){
          this.getDelAccApiCallIdRes(responseJson)
         }
      
      }
    }
    // Customizable Area End
  }

  txtInputWebProps = {
    onChangeText: (text: string) => {
      this.setState({ txtInputValue: text });
    },
    secureTextEntry: false,
  };

  txtInputMobileProps = {
    ...this.txtInputWebProps,
    autoCompleteType: "email",
    keyboardType: "email-address",
  };

  txtInputProps = this.isPlatformWeb()
    ? this.txtInputWebProps
    : this.txtInputMobileProps;

  btnShowHideProps = {
    onPress: () => {
      this.setState({ enableField: !this.state.enableField });
      this.txtInputProps.secureTextEntry = !this.state.enableField;
      this.btnShowHideImageProps.source = this.txtInputProps.secureTextEntry
        ? imgPasswordVisible
        : imgPasswordInVisible;
    },
  };

  btnShowHideImageProps = {
    source: this.txtInputProps.secureTextEntry
      ? imgPasswordVisible
      : imgPasswordInVisible,
  };

  btnExampleProps = {
    onPress: () => this.doButtonPressed(),
  };

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
  getUserDataList = async () => {
    this.getuserDetailsApiCallId = this.networkRequest({
      endPoint: "profile_details",
      method: "GET",
      newState: { loading: true }
    });
  };

  getAdminDashCount = async () => {
     this.getCountApiCallId = this.networkRequest({
      endPoint: "bx_block_companies/get_all_details",
      method: "GET",
      newState: { loading: true }
    });
  };

  getAllDataList = () => {
    console.log("get all Data list gets called----@@@");
    this.setState({loading:true});
    const header = {
      "Content-Type": configJSON.appointmentApiContentType,
      token: this.context?.state?.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

  
    const attrs = {
     name:this.state.searchString,
     }
    this.getEmployeesApiCallId = requestMessage.messageId;
    let urlParams = new URLSearchParams(attrs).toString();
       if(this.state.userType=="Coaches"){
      requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `bx_block_companies/get_coaches?${urlParams}`
      );

    }else if(this.state.userType=="Companies"){
      requestMessage.addData(
        getName(MessageEnum.RestAPIResponceEndPointMessage),
        `bx_block_companies/companies?${urlParams}`
      );
     
    }else if(this.state.userType=="User Groups"){
  
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `bx_block_companies/get_employees?${urlParams}`
    );
 
  }
    
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

  
  async componentDidMount() {

    super.componentDidMount();
    // const usrType = this.props.navigation.getParam("usertype");
    // if(usrType)
    // {
    //   this.setState({userType:usrType});
    // }
    this.getFocusOn();
   

  }

  getToken = () => {
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg); 
  }
  getFocusOn=()=>{
    console.log("-------get focus on");
    if (this.isPlatformWeb() === false) {
        this.props.navigation.addListener('willFocus', () => {
        console.log("Will focues Admin Dashboard ")
        this.setState({ token: this.context.state.token, loading: true }, () => {
        this.getAdminDashCount();
        this.getUserDataList();
          
      });
      });
  
    }
  }
  onChangeTextClick =  () => {
    console.log("======", );
   
    this.setState(
      {
      
        DataList: [],
       
        loading: true
      },
      () => {
        this.getAllDataList();
      }
    );
  };
 
  apiCall = async (data: any) => {
    // Customizable Area Start
    const { contentType, method, endPoint, body, type } = data
    const header = {
      'Content-Type': contentType,
      token: this.state.token
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
 
  NavigateBaseOnUserType={
    onPress:()=>{
      console.log(this.state.userType=="Coaches","_+_+++_")
   
      if(this.state.userType=="Coaches"){
      this.props.navigation.navigate('AddNewCoach',{usertype:'Coaches'})
    }else  if(this.state.userType=="Companies"){
      this.props.navigation.navigate('AddNewComp',{usertype:'Companies'})
  
    }
    }
  }
  
  imgEnablePasswordFieldProps = {
    source:PasswordVisible
  };
  imgEnableRePasswordFieldProps = {
    source: PasswordVisible
  };

  handleUserDetailsApiResponseJson=(responseJson: any)=>{
    if(responseJson?.data){
      this.setState({
        prifileimage:responseJson?.data.attributes?.image,
        full_name: responseJson?.data.attributes?.full_name,
      
      })
    }
  }

  handleCountApiResponseJson=(responseJson: any)=>{
    if(responseJson?.data){
      this.setState({
        coachCount:responseJson?.data?.coaches,
        empCount: responseJson?.data?.employees,
        compnyCount:responseJson?.data?.companies
      
      })
    }
  }

  handleResponseJson=(responseJson: any)=>{
    if(responseJson?.data){
      if(this.state.userType=="Coaches")
      {
       this.setState({
         DataList:responseJson?.data,
         coachList: responseJson?.data,
         loading:false
      
       })
      }
      else if(this.state.userType=="Companies")
      {
        this.setState({
          DataList:responseJson?.data,
          companyList: responseJson?.data,
          loading:false
       
        })
      }
      else{
        this.setState({
          DataList:responseJson?.data,
          ugList: responseJson?.data,
          loading:false
       
        })
      }
     }
  }

  getDelAccApiCallIdRes=(responseJson: any)=>{
    if (responseJson && responseJson?.message && responseJson?.data) {
      Alert.alert("Success",responseJson?.message)
      this.logOut()
    } else if (responseJson?.data || responseJson?.errors) {
      Alert.alert("Failed","Could not process your request. Try later")
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
