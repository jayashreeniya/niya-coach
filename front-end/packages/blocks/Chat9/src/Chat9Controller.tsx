// @ts-nocheck
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
// import { Client, Conversation } from "@twilio/conversations";
import { Alert, Keyboard, Linking, Platform } from "react-native";
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import Twilio from "../../../components/src/Twilio";
import { selectDocument } from "../../../components/src/DocumentPicker";

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
  token: string;
  activeTab: number;
  showActionModal: boolean;
  appointments: any[];
  loading: boolean;
  newMessage: string;
  twilioToken: string;
  twilioStatus: string;
  loggedInToTwilio: boolean;
  messagesReady: boolean;
  messages: any[];
  documents: any[];
  conversationId: string;
  conversationName: string;
  chatServiceId: string;
  sender: string;
  receiver: string;
  showPreview: boolean;
  previewUrl: string;
  previewType: string;
  userId: number;
  load: boolean;
  result: any;
  platfromValue:string;
  // Customizable Area End
}

interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

export default class Chat9Controller extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getAppointmentsApiCallId: string = "";
  recommendActionApiCallId: string = "";
  getChatDetailsApiCallId: string = "";
  twilio: Twilio = new Twilio();
  static contextType?: Context<any>= AppContext;
  conversationEvent: any;
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
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      // Customizable Area Start
      token: "",
      activeTab: 1,
      showActionModal: false,
      appointments: [],
      loading: false,
      twilioToken: "",
      twilioStatus: "",
      loggedInToTwilio: false,
      messagesReady: false,
      conversationId: "",
      conversationName: "",
      chatServiceId: "",
      sender: "",
      receiver: "",
      newMessage: "",
      messages: [],
      documents: [],
      showPreview: false,
      previewUrl: "",
      previewType: "",
      userId:0,
      load: false,
      result: [],
      platfromValue:""
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    runEngine.debugLog("Message Recived", message);
    
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      let token = message.getData(getName(MessageEnum.SessionResponseToken));
      this.setState({ token: this.context.state.token }, () => {
        this.getAppointments();
      });
    }
    else if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
    

      if(apiRequestCallId === this.getAppointmentsApiCallId){
        if(responseJson && responseJson.data){
          this.setState({
            appointments: responseJson.data,
            loading: false
          });
        }
      }
      else if(apiRequestCallId === this.recommendActionApiCallId){
        this.setState({load: false})
        if(responseJson && responseJson.account_id){
          this.setState({ showActionModal: false });
          Alert.alert("", "Action item is recommended successfully");
        } else {
          Alert.alert("", "Failed to recommend action item");
        }
      }
      else if(apiRequestCallId === this.getChatDetailsApiCallId){
       
        if(responseJson){
          this.setState({
            conversationId: responseJson.conversation_sid,
            conversationName: responseJson.friendly_name,
            sender: responseJson.participant1.participant_sid1,
            receiver: responseJson.participant2.participant_sid2,
            // twilioToken: responseJson.participant1.access_token,
            twilioToken: responseJson.participant2.access_token,
            chatServiceId: responseJson.chat_service_id
          }, () => {
            this.getConversation();
            this.conversationEventLoop()
          });
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
  async componentDidMount(): Promise<void> {
    super.componentDidMount();
    this.setState({platfromValue : Platform.OS})
    this.setState({token:this.context.state.token});
    const id = this.props.navigation.getParam("id");
    
    if(id)
    {
      this.setState({userId:id},()=>{
       
        this.getChatDetails();
      });
    }
    this.getToken();
   
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
      "Content-Type": "application/json",
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

  getAppointments = () => {
    const userId = this.state.userId;
    if(userId){
      this.getAppointmentsApiCallId = this.networkRequest({
        endPoint: `bx_block_calendar/booked_slots/user_appointments?service_user_id=${userId}`,
        method: "GET",
        newState: { loading: true }
      });
    }
  }

  recommendAction = (body: Record<string, any>) => {
    this.recommendActionApiCallId = this.networkRequest({
      endPoint: "bx_block_calendar/booked_slots/user_action_item",
      method: "POST",
      body,
      newState: { loading: true }
    });
  }

  getChatDetails = () => {
    
    const userId = this.state.userId;
    if(userId){
      this.getChatDetailsApiCallId = this.networkRequest({
        endPoint: `conversation?service_id=${userId}`,
        method: "GET",
        newState: { loading: true }
      });
    }
  }

  toggleActionModal = () => {
    this.setState(prev => ({
      showActionModal: !prev.showActionModal
    }));
  }

  togglePreview = () => {
    this.setState(prev => ({
      showPreview: !prev.showPreview
    }));
  }

  conversationEventLoop = () => {
    this.conversationEvent = setInterval(this.getConversation, 5000);
  }

  getConversation = async () => {
  

    this.twilio.setConversationId(this.state.conversationId, this.state.chatServiceId);
    const messages = await this.twilio.getMessages();
   
    if(messages?.success){
      const sortedMessages = messages.messages.reverse();
    
      this.setState({
        messages: sortedMessages,
        loading: false
      });
      const documents = messages.messages.filter((m: any) => m.media !== null);
      
      this.setState({ documents }, ()=>{
        let result = []
        documents.map(async(file, i)=> {
          
          const text = (file?.media?.[0]?.content_type?.split?.("/")?.[0] === "image")? "IMAGE": "PDF";
          const fromMe = file.author === this.state.sender;
          const date_created = file?.date_created;
          const title= file?.media[0]?.filename;

          result.push({
            url: await this.getFile(file?.media?.[0]?.sid, text),
            text: text,
            fromMe: fromMe,
            file: file,
            title: title,
            date_created: date_created
          })

          
        })
        
        setTimeout(() => { 
          this.setState({ result: result })
        }, 500);
      });
    } else {
      this.setState({ loading: false });
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
      }
    }
  }

  getFile = async (sid: string, type: "IMAGE" | "PDF") => {
    let url: string = ""
    if(!sid) return;
   
    const data = await this.twilio.getFile(sid);
    if(data.success){
     
      url = data?.data?.url
    }
    return url
  }

  getPreview = (url: any, type: any)=>{
    if(type=="IMAGE"){
      this.setState({
        previewUrl: url || "",
        showPreview: type === "IMAGE"
      });
    }
    else{
      Linking.openURL(url).catch(e => alert(e));
    }
  }
  // Customizable Area End
}
