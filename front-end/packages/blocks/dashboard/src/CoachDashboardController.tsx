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
  activeTab: number;
  appointments: any[];
  pastAppointments: any[];
  profile: Record<string, any>;
  showMeetingModal: boolean;
  meetingId: string;
  meetingToken: string;
  // Customizable Area End
}
interface SS {
  id: any;
}

export default class CoachDashboardController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  apiDashboardItemCallId: string = "";
  dashboardApiCallId: string = "";
  apiGetQueryStrinurl: string = "";
  getUpcomingAppointmentsApiCallId: string = "";
  getPastAppointmentsApiCallId: string = "";
  getProfileDataApiCallId: string = "";
  devicetokenApiCallId: string = "";
  drawerRef: any = null;
  getvideocallApiCallId: string="";
  getDelAccApiCallId: string="";
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
      activeTab: 1,
      appointments: [],
      pastAppointments: [],
      profile: {},
      showMeetingModal: false,
      meetingId: "",
      meetingToken: "eyJhbGciOiJIUzI1NiJ9.eyJhcGlrZXkiOiI0YzkwZWUwOS0xMjRmLTRjMjktYjkyZS00NzVlOTBlMDBiMjQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIiwiYWxsb3dfbW9kIiwiYXNrX2pvaW4iXX0.3URufcS0zoLE6Emo9BLUZqF6hvfoqWor6QJDvIJtwRQ"
    };
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener('willFocus', () => {
        this.getToken();
      });
    }
    // Customizable Area Start
    // Customizable Area End
  }
  
  getToken=()=>{
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
  }

  getDashboardData(): boolean {
    // Customizable Area Start
    const header = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.apiDashboardItemCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.dashboardGetUrl
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );

    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.dashboarApiMethodType
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    // Customizable Area End
    return true;
  }

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      this.setState({ token: this.context.state.token, loading: true }, () => {
        this.getUpcomingAppointments();
        this.getProfileData();
      });
    }

    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const responseJson = message.getData(getName(MessageEnum.RestAPIResponceSuccessMessage));
      const apiRequestCallId = message.getData(getName(MessageEnum.RestAPIResponceDataMessage));
     
      if (responseJson && !responseJson.errors && responseJson?.data) {
        if(apiRequestCallId === this.getPastAppointmentsApiCallId){
            this.setState({ pastAppointments: responseJson?.data, loading: false });
        }
        else if(apiRequestCallId === this.getUpcomingAppointmentsApiCallId){
        
            this.setState({ appointments: responseJson?.data, loading: false });
 
        }
        else if(apiRequestCallId === this.getProfileDataApiCallId){
         
            this.setState({ profile: responseJson?.data?.attributes || {}, loading: false });
    
        }
        else if(apiRequestCallId === this.getDelAccApiCallId){
         
          this.getDelAccApiCallIdRes(responseJson);
  
      }
      }
      this.setState({ loading: false });
    }
    // Customizable Area End
  }

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;
 
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

  getUpcomingAppointments = () => {
    this.getUpcomingAppointmentsApiCallId = this.networkRequest({
      method: "GET",
      endPoint: "bx_block_calendar/booked_slots/coach_upcoming_appointments",
      newState: { loading: true }
    });
  }

  getPastAppointments = () => {
    this.getPastAppointmentsApiCallId = this.networkRequest({
      method: "GET",
      endPoint: "bx_block_calendar/booked_slots/coach_past_appointments",
      newState: { loading: true }
    });
  }

  getProfileData = () => {
    this.getProfileDataApiCallId = this.networkRequest({
      endPoint: "profile_details",
      method: "GET",
      newState: { loading: true }
    });
  }

  switchTab = (id: number) => {
    this.setState({ activeTab: id }, () => {
      if(id === 1){
        this.getUpcomingAppointments();
      } else {
        this.getPastAppointments();
      }
    });
  }

  startMeeting = (id: string, start_id: any) => {
    if(id==null){
      this.showAlert("Alert","Something went wrong. Please try again later")
      return
    }
    this.beforeVideoCall(start_id);
    this.setState({
      meetingId: id,
      showMeetingModal: true
    });
  }

  endMeeting = () => {
    this.setState({
      meetingId: "",
      showMeetingModal: false
    });
  }

  logOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: this.confirmLogout
      }
    ])
    
  }

  confirmLogout = async () => {
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
  apiResponseHandling=()=>{
    
  }

  beforeVideoCall = async (book_id: any) => {
    this.getvideocallApiCallId = this.networkRequest({
      endPoint: `bx_block_calendar/booked_slots/video_call?booked_slot_id=${book_id}`,
      method: "GET",
    });
  }

  getDelAccApiCallIdRes=(responseJson: any)=>{
    if (responseJson?.message && responseJson?.data) {
      Alert.alert("Success",responseJson?.message)
      this.logOut()
    } else if (responseJson?.data || responseJson?.errors) {
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
