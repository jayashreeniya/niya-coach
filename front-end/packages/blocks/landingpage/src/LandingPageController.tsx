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
import { backImg, headerImgBg } from "./assets";
import {  State } from 'react-native-gesture-handler';
import Twilio from "../../../components/src/Twilio";
import { Keyboard,Linking, Platform } from "react-native";
import { selectDocument } from "../../../components/src/DocumentPicker";
export interface DocFileData{
    index:number,
    author:string,
    date_updated:string,
    media:{
          category:string,
          size:number,
          filename:string,
          content_type:string,
          sid:string
       }[],
    date_created:string,
}
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
  activebtn:string;
  pastCoachData:any[];
  currentCoachData:any[];
  loading: boolean;
  docLoading: boolean,
  token: string;
  cureentCoachDetails:any[],
  isShowcureentCoachDetails:boolean,
  upcomingAppointment:any[],
  activeTab: number;
  index:number;
  routes:any[];
  lastTap:any;
  cliked:boolean;
  currentCoachId:any;
  currentCoachName:string;
  showId:any
  newMessage: string;
  twilioToken: string;
  messages: any[];
  documents: any[];
  conversationId: string;
  conversationName: string;
  chatServiceId: string;
  sender: string;
  receiver: string;
  coachprifileimage:any;
  showPreview: boolean;
  previewUrl: string;
  previewType: string;
  result: any;
  platfromValue:string;
  // Customizable Area End
}

interface SS {
  id: any;
}

export default class LandingPageController extends BlockComponent<
  Props,
  S,
  SS
> {
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.SessionResponseMessage),
      getName(MessageEnum.RestAPIResponceMessage),

    ];

    this.state = {
      activebtn:'Current Coach',
      pastCoachData:[],
      currentCoachData:[],
      loading:false,
      docLoading: false,
      token:"",
      cureentCoachDetails:[],
      isShowcureentCoachDetails:false,
      upcomingAppointment:[],
      activeTab: 1,
      index: 0,
      routes: [
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' },
      ],
      lastTap:null,
      cliked:false,
      currentCoachId:0,
      currentCoachName:"",
      showId:"",
      newMessage: "",
      messages: [],
      documents: [],
      sender: "",
      receiver: "",
      twilioToken: "",
      conversationId: "",
      conversationName: "",
      chatServiceId: "",
      coachprifileimage:"",
      showPreview: false,
      previewUrl: "",
      previewType: "",
      result: [],
      platfromValue:""
    };

    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    runEngine.debugLog("Message Recived", message);
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
       console.log("getting tokens ")
      this.setState({ token: this.context.state.token ,loading:true,}, () => {
        this.getCurrentCoach();
        this.getPastCoach();
      
      });
    }
    else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
    
      
      if (apiRequestCallId != null) {

      
        if (apiRequestCallId === this.getPastCoachApiCallId) {

          this.setState({ loading: false });
          if (responseJson.errors != undefined && responseJson.data) {
           console.log(responseJson,"errr");
          } else {
            this.setState({ pastCoachData: responseJson.data })

          }

        }
        if (apiRequestCallId === this.getAppointmentsApiCallId) {
         
          this.setState({ loading: false });
          if (responseJson.errors != undefined && responseJson.data) {
           console.log(responseJson,"errr");
          } else {
            this.setState({ upcomingAppointment: [].concat(responseJson.data) })

          }

        }

        if (apiRequestCallId === this.getPastApiCallId) {
         
          this.setState({ loading: false });
          if (responseJson.errors != undefined && responseJson.data) {
           console.log(responseJson,"errr");
          } else {
            this.setState({ upcomingAppointment: [].concat(responseJson.data) })

          }

        }
        if (apiRequestCallId === this.getCurrentCoachApiCallId) {

          this.setState({ loading: false });
          if (responseJson.errors != undefined && responseJson.data) {
           console.log(responseJson,"errr");
          } else {
            this.setState({ currentCoachData: responseJson.data, })

          }

        }
        else if(apiRequestCallId === this.getChatDetailsApiCallId){
          this.setState({loading:false});
          if(responseJson){
            this.setState({
              conversationId: responseJson.conversation_sid,
              conversationName: responseJson.friendly_name,
              sender: responseJson.participant1.participant_sid1,
              receiver: responseJson.participant2.participant_sid2,
              twilioToken: responseJson.participant1.access_token,
              chatServiceId: responseJson.chat_service_id
            }, () =>{ this.getConversation();
              this.conversationEventLoop();
            });
          } 
        }
        
      
       
      }
    }

    // Customizable Area End
  }

  // Customizable Area Start
  twilio: Twilio = new Twilio();
  getAppointmentsApiCallId: string = "";
  getCurrentCoachApiCallId: string = "";
  getPastCoachApiCallId: string = "";
  getPastApiCallId:string="";
  getChatDetailsApiCallId:string="";
  conversationEvent: any;
  static contextType?: Context<any>= AppContext;
  goToHome() {
    const msg: Message = new Message(
      getName(MessageEnum.NavigationHomeScreenMessage)
    );
    msg.addData(getName(MessageEnum.NavigationPropsMessage), this.props);
    this.send(msg);
  }
  headerbgImgProps={
    source:headerImgBg
  }
  backImgProps={
    source:backImg
  }
  backbtnPressProps = {
    onPress: () => {
  
     this.setState({ isShowcureentCoachDetails:false})
      
    },
  };
  getPastCoach = () => {
   
      this.getPastCoachApiCallId = this.networkRequest({
        endPoint: `bx_block_calendar/booked_slots/past_coach`,
        method: "GET",
        newState: { loading: true }
      });
 
  }
  getCurrentCoach = () => {
      this.getCurrentCoachApiCallId = this.networkRequest({
        endPoint: `bx_block_calendar/booked_slots/current_coach`,
        method: "GET",
        newState: { loading: true }
      });
 
  }
  getUpcomingAppointment = (id:any) => {
    console.log("^^^^getUpcomingAppointment ",id,"  this.getUpcomingAppointment(id);",this.state.currentCoachId);
      let params=new URLSearchParams();
      params.append("service_provider_id",id)
      this.getAppointmentsApiCallId = this.networkRequest({
        endPoint: `bx_block_calendar/booked_slots/coach_with_upcoming_appointments?${params}`,
        method: 'GET',
        newState: { loading: true }
      });
 
  }
  getPastAppointment = (id:any) => {
    console.log("^^^^getPastAppointment ",id,"  this.getUpcomingAppointment(id);",this.state.currentCoachId);
      let params=new URLSearchParams();
      params.append("service_provider_id",id)
      this.getPastApiCallId = this.networkRequest({
        endPoint: `bx_block_calendar/booked_slots/coach_with_past_appointments?${params}`,
        method: 'GET',
        newState: { loading: true }
      });
 
  }
  async componentDidMount() {
    super.componentDidMount();
    this.getFocusOn();
    this.setState({platfromValue : Platform.OS})
   
  }
  async componentWillUnmount(): Promise<void> {
   
    if(this.conversationEvent){
      clearInterval(this.conversationEvent);
    }
  }

  getToken = () => {
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
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
  switchTab = (id: number) => {
    this.setState({ activeTab: id });
  }

  toggleLike = () => {

      console.log(this.state.currentCoachId,"id","this.state.upcomingAppointment",this.state.upcomingAppointment);
      this.props.navigation.navigate('CoachTab',{coachAppointmentData:this.state.upcomingAppointment,name:this.state.currentCoachName,id:this.state.currentCoachId,coachprifileimage:this.state.coachprifileimage,callback:()=>{
        console.log("This is the callback function %^%^%");
        this.setState({isShowcureentCoachDetails:true})
      }});
   
  };

  handleDoubleTap = () => {
    console.log("Doubke tapped ",this.state.lastTap);
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (this.state.lastTap && (now - this.state.lastTap) < DOUBLE_PRESS_DELAY) {
      console.log("Doubke tapped ")
 
      this.toggleLike();
    } else {
      this.state.lastTap = now;
    }
    
  }
   onDoubleTapEvent = (event:any) => {
    console.log(event,"**event");
    if (event.nativeEvent.state === State.ACTIVE) {
      this.toggleLike();
    }
  };
 

  getFocusOn=()=>{
    if (this.isPlatformWeb() === false) {
    
     
        this.props.navigation.addListener('willFocus', () => {
          if(this.props.navigation.state?.params?.from=="chat"){
            console.log("((((((*******Will focues ",this.props.navigation)
            this.setState({isShowcureentCoachDetails:true})
          }
          else 
             this.getToken();
         });
  
    }
  }
 
  getChatDetails = (id:any) => {
    console.log("getChatDetails",id);
     if(id){
      this.getChatDetailsApiCallId = this.networkRequest({
        endPoint: `conversation?service_id=${id}`,
        method: "GET",
        newState: { loading: true }
      });
    }
  }

  getConversation = async () => {
     this.twilio.setConversationId(this.state.conversationId, this.state.chatServiceId);
    const messages = await this.twilio.getMessages();
    console.log("Messages: ", messages);
    if(messages?.success){
      this.setState({
        messages: messages.messages.reverse(),
        loading: false
      });
      const documents = messages.messages.filter((m: any) => m.media !== null);

        const result= await Promise.all(documents.map(async(file: DocFileData, i: number)=> {

          const text = (file?.media?.[0]?.content_type?.split?.("/")?.[0] === "image")? "IMAGE": "PDF";
          const fromMe = file.author === this.state.sender;
          const date_created = file?.date_created
          const title= file?.media[0]?.filename;
          const url=await this.getFileUrl(file?.media?.[0]?.sid, text)
          return { url, text, fromMe, file, date_created,  title }
          
        }))
        this.setState({ result: result , docLoading: false, documents: documents})

    } else {
      this.setState({ loading: false, docLoading: false });
    }
  }

  

  sendMessage = async (sid?: string ) => {
    if(!sid && (!this.state.newMessage)) return;
    Keyboard.dismiss();
    const body: Record<string, string> = {
      "Author": this.state.sender,
      "Body": this.state.newMessage
    }
    if(sid){
      body.MediaSid = sid;
      this.setState({ loading: true });
    }
    const createUrlEncodedBody = (plainBodyObject: Object): string => {
      const encodedBody: string = Object.entries(plainBodyObject)
        .map(([key, value]) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(value)
        })
        .join('&')
      return encodedBody
    }
    
    const message = await this.twilio.sendMessage(createUrlEncodedBody(body));
    if(message?.success){
      this.setState({ newMessage: "" });
      this.getConversation();
    }
    this.setState({ loading: false });
  }

  nextPage = async () => {
    const messages = await this.twilio.nextPage();
    if(messages.success){
      this.setState(prev => ({
        messages: [...prev.messages, ...messages.messages]
      }));
    }
  }

  previousPage = async () => {
    const messages = await this.twilio.previousPage();
    if(messages.success){
      this.setState(prev => ({
        messages: [...messages.messages, ...prev.messages]
      }));
    }
  }

  selectFile = async () => {
    const doc = await selectDocument();
    if(doc){
      const data = await this.twilio.fileUpload(doc);
      if(data.sid){
        this.sendMessage(data.sid);
        this.setState({docLoading: true})
      }
    }
  }

  getFileUrl = async (sid: string, type: "IMAGE" | "PDF") => {
    let url: any = ""
    if(!sid) return;
   
    const data = await this.twilio.getFile(sid);
    if(data.success){
      console.log('Passed val===', JSON.stringify(data));
      url = data?.data?.url
    }
    return url
  }

  getFile = async (sid: string, type: "IMAGE" | "PDF") => {
    if(!sid) return;
    this.setState({ loading: true });
    const data = await this.twilio.getFile(sid);
    if(data.success){
      this.setState({
        previewUrl: data?.data?.url || "",
        showPreview: type === "IMAGE",
        loading: false,
        previewType: type
      });
      if(type === "PDF"){
        Linking.openURL(data?.data?.url).catch(e => console.log(e));
      }
    }
  }

  getPreview = (url: any, type: any)=>{
    if(type=="IMAGE"){
      this.setState({
        previewUrl: url || "",
        showPreview: type === "IMAGE"
      });
    }
    else{
      Linking.openURL(url).catch(e => console.log(e));
    }
  }

  togglePreview = () => {
    this.setState(prev => ({
      showPreview: !prev.showPreview
    }));
  }
  conversationEventLoop = () => {
    this.conversationEvent = setInterval(this.getConversation, 5000);
  }

  onPressCoachDeatails=(item:any,id:any,full_name:string,image:any)=>{
    this.setState({ cureentCoachDetails: item, isShowcureentCoachDetails: true, loading: true, currentCoachId: id, currentCoachName: full_name, showId: "" ,coachprifileimage:image,activeTab:1},()=>{
      if (this.state.activebtn == "Current Coach") {
        this.getUpcomingAppointment(id);
        this.getChatDetails(id);  
        this.getConversation();
      }
      else {
        this.getPastAppointment(id);
        this.getChatDetails(id);  
        this.getConversation();
      }
    })}
 
  // Customizable Area End
}
