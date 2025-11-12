import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";
// Customizable Area Start
import { checkBtn, UncheckBtn } from "./assets";
import { setup, togglePlayer } from "../../../components/src/AudioPlayer";
import { Context } from "react";
import { AppContext } from "../../../components/src/context/AppContext";
import { set_user_data } from "../../../components/src/context/actions";
import { initState } from "../../../components/src/context/appContextReducer";
import Orientation from "react-native-orientation-locker";
import TrackPlayer from "react-native-track-player";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import * as IMG_CONST from './assets'
import { AppState, Alert, } from "react-native";


interface IosItemType     {
  id:string;
  type:string;
  attributes:{
    action_item:string;
    date:string;
    is_complete:boolean;
    time_slot:string;
  }
}

interface GoalItemType{
  id:number;
  date:string;
  focus_area_id:number;
  goal:string;
  is_complete:boolean;
  time_slot:string;
}

// Customizable Area End



export const configJSON = require("./config.js");

export interface Props {
  navigation: any;
  id: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  token: string;
  errorMsg: string;
  loading: boolean;
  appointmentData:any[];
  focusAreaData:any[];
  // Customizable Area Start
  isMoving: boolean,
  pointsDelta: number,
  points: number,
  showActionModal: boolean;
  selectActionDuration: boolean;
  actionData: any[];
  actionLoader: boolean;
  actionId: string;
  articleData: any[];
  audioData: any[];
  nowPlaying: string;
  videoData: any[];
  topStrenghts: any[];
  isGoalModal: boolean;
  isAddGoal: boolean;
  iscompeteGaol: boolean;
  isEditcompeteGaol: boolean;
  checked: any;
  goalstepmodal: any;
  editgoalstepmodal: any;
  goalnm: any;
  goalCompetionDate: any;
  goalCompetionTime: any
  enable: boolean;
  goalData: any[];
  completedGoalData: any[];
  goalLoader: boolean;
  goalitemId: string;
  competeGoalModal: boolean,
  editgoal: string;
  editgoalid: any;
  markcomplete: boolean;
  UserData: any[];
  prifileimage: any;
  full_name: string;
  percentage: number;
  whaleImgSrc: any;
  moodsList: any[];
  selectedMoodId: string;
  selectedMood: any;
  showMeetingModal: boolean;
  meeting: {
    id: string;
    token: string;
  };
  videoModal: boolean;
  videoUrl: string;
  isShow: boolean;
  showId: any;
  selectedCoach_id: any;
  complete: boolean;
  insightsLoader: boolean;
  suggestionsLoader: boolean;
  appointmentsLoader: boolean;
  paused: boolean;
  isshowEditActionModal:boolean;
  editActionItmId:any;
  editActionItm: string;
  from:string;
  cancelbookingLoader: boolean;
  scrollOn: boolean;
  action_time:any;
  appState: any;
  isCurrenGole:boolean;
  currentGoleTime:string;
  isCurrenAction:boolean;
  currentActionTime:string;
  currentActionDate:moment.Moment
  // Customizable Area End

}
interface SS {
  id: any;
}


export default class HomePageController extends BlockComponent<Props, S, SS> {
  // Customizable Area Start
  apiDashboardItemCallId: string = "";
 
  getfocusAreaApiCallId:string="";
  getAppointmentApicallId:string=""; 
  createActionApiCallId: string = "";
  getActionsApiCallId: string = "";
  completeActionApiCallId: string = "";
  devicetokenApiCallId: string = "";
  addGoalApiCallId: string = "";
  updateGoalApiCallId: string = "";
  deleteGoalApiCallId: string = "";
  getGoalApiCallId: string = "";
  getCompetedGoalApiCallId: string = "";
  getachievementApiCallId: string = "";
  drawer: any;
  getMoodsApiCallId: string = "";
  getScoresApiCallId: string = "";
  getInsightsApiCallId: string = "";
  getGoalBoardApiCallId: string = "";
  getSuggestionApiCallId: string = "";
  getvideocallApiCallId: string = "";
  audioPlayer: any = null;
  toastRef: any;
  cancelBookingApiCallId:string="";
  appstatesubscription:any;
  getDelAccApiCallId: string = "";
  // Customizable Area End
  constructor(props: Props) {
    super(props);

    this.receive = this.receive.bind(this);
    
    console.disableYellowBox = true;
    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage)
    ];

    this.state = {
      isMoving: false,
      pointsDelta: 0,
      points: 0,
      errorMsg: "",
      token: "",
      loading: false,
      appointmentData: [],
      focusAreaData: [],
      showActionModal: false,
      selectActionDuration: false,
      actionData: [],
      nowPlaying: "",
      actionId: "",
      actionLoader: false,
      articleData: [],
      audioData: [],
      videoData: [],
      topStrenghts: [],
      isGoalModal: false,
      checked: '',
      isAddGoal: false,
      iscompeteGaol: false,
      isEditcompeteGaol:false,
      goalstepmodal: 0,
      editgoalstepmodal:0,
      goalnm: "",
      goalCompetionDate: moment(),
      goalCompetionTime:moment("10:00", "hh:mm A"),
      goalData: [],
      completedGoalData: [],
      goalLoader: false,
      goalitemId: "",
      enable: false,
      competeGoalModal: false,
      editgoal: "",
      editgoalid: "",
      markcomplete: false,
      UserData: [],
      prifileimage: "",
      full_name: "",
      percentage: 100,
      whaleImgSrc: '',
      moodsList: [],
      selectedMoodId: '',
      selectedMood: {},
      showMeetingModal: false,
      meeting: {
        id: "",
        token: "eyJhbGciOiJIUzI1NiJ9.eyJhcGlrZXkiOiI0YzkwZWUwOS0xMjRmLTRjMjktYjkyZS00NzVlOTBlMDBiMjQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIiwiYWxsb3dfbW9kIiwiYXNrX2pvaW4iXX0.3URufcS0zoLE6Emo9BLUZqF6hvfoqWor6QJDvIJtwRQ"
      },
      videoModal: false,
      videoUrl: "",
      isShow: false,
      showId: "",
      selectedCoach_id: "",
      complete: false,
      insightsLoader: false,
      suggestionsLoader: false,
      appointmentsLoader: false,
      paused: true,
      isshowEditActionModal:false,
      editActionItmId:0,
      editActionItm:"",
      from:"",
      cancelbookingLoader:false,
      scrollOn:true,
      action_time:"",
      appState:AppState.currentState,
      isCurrenGole:false,
      currentGoleTime:'10:00 AM',
      isCurrenAction:false,
      currentActionTime:'10:00 AM',
      currentActionDate:moment()
    };
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    // Customizable Area Start
    Orientation.lockToPortrait();
    super.componentDidMount();
    this.setState({token:this.context.state.token},()=>{

    // this.getUpcomingAppointmentsData();
    // this.getDataDataList();
   
    // this.getGoalBoard(); 
    // this.getSuggestions();
    // this.getActions();
    // this.getMoodList();
   
  });
  AsyncStorage.removeItem("nameEdited");
  AsyncStorage.removeItem("wellBeing");

  this.getFocusOn();
  AppState.addEventListener('change', this._handleAppStateChange);
    // Customizable Area End
  }

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;
adjustWhaleSlider=(speed:number) => {
  this.setState({ percentage: speed }, () => {
  if (this.state.percentage >= 0 && this.state.percentage < 20) {
    let selected = this.state.moodsList.find((item: any) => item?.attributes?.motion_title == "terrible");
    this.setState({ selectedMoodId: selected?.id, whaleImgSrc: IMG_CONST.imgTerrible, selectedMood: selected });

  }
  else if (this.state.percentage >= 21 && this.state.percentage < 40) {
    let selected = this.state.moodsList.find((item: any) => item?.attributes?.motion_title == "bad");
    this.setState({ selectedMoodId: selected?.id, whaleImgSrc: IMG_CONST.imgBad, selectedMood: selected });

  }
  else if (this.state.percentage >= 41 && this.state.percentage < 60) {
    let selected = this.state.moodsList.find((item: any) => item?.attributes?.motion_title == "okayish");
    this.setState({ selectedMoodId: selected?.id, whaleImgSrc: IMG_CONST.imgOkeish, selectedMood: selected });
  }
  else if (this.state.percentage >= 61 && this.state.percentage < 80) {
    let selected = this.state.moodsList.find((item: any) => item?.attributes?.motion_title == "good");
    this.setState({ selectedMoodId: selected?.id, whaleImgSrc: IMG_CONST.imgGood, selectedMood: selected });
  }
  else if (this.state.percentage >= 81 && this.state.percentage <= 100) {
    let selected = this.state.moodsList.find((item: any) => item?.attributes?.motion_title == "great");
     this.setState({ selectedMoodId: selected?.id, whaleImgSrc: IMG_CONST.imgGreat, selectedMood: selected });
  }
  this.setState({scrollOn:true})
})
}

async componentWillUnmount() {
  AppState.removeEventListener('change', this._handleAppStateChange);
}

_handleAppStateChange = (nextAppState: any) => {
  if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    console.log('App has come to the foreground!')
  }
  this.setState({appState: nextAppState});
  console.log('Not in foreground anymore!')
  this.stopeAudioplay()
}

  startMeeting = (id: string, book_id: any) => {
    this.stopeAudioplay();
    this.beforeVideoCall(book_id);
    this.setState({
      meeting: {
        id,
        token: this.state.meeting.token
      },
      showMeetingModal: true
    });
  }
  beforeVideoCall = async (book_id: any) => {
    this.getvideocallApiCallId = this.CallApi({
      endPoint: `bx_block_calendar/booked_slots/video_call?booked_slot_id=${book_id}`,
      method: "GET",
    });
  }
   endMeeting = () => {
    this.setState({
      meeting: {
        id: "",
        token: this.state.meeting.token
      },
      showMeetingModal: false
    }, () => this.props.navigation.navigate("Ratting", { coachId: this.state.selectedCoach_id }));

  }

  getFocusOn = () => {
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener('didFocus', () => {
       this.setState({paused:true,nowPlaying:"",token:this.context.state.token,goalCompetionTime:moment("10:00", "hh:mm A"),from:this.props.navigation.state?.params?.from ? this.props.navigation.state.params.from : '' },()=>{
           this.getInsights();
           this.getSuggestions();
          // this.getDataDataList();
          // if(this.props.navigation.state?.params?.from=="booking"){
          //  this.getUpcomingAppointmentsData();
          // }

    // this.getUpcomingAppointmentsData();
    // this.getDataDataList();
   
    // this.getGoalBoard(); 
    // this.getActions();
    // this.getMoodList();
        });
       
       });
    }
  }

  blurHandler = () => {
    this.props.navigation.addListener("willBlur", () => {
      TrackPlayer.seekTo(0);
      TrackPlayer.pause();
      this.setState({ paused: true, nowPlaying: "" });
    });
  }

  getToken=()=>{
    const msg: Message = new Message(getName(MessageEnum.SessionRequestMessage));
    this.send(msg);
  }

  openDrawer() {
    this.drawer.open();
  }

  closeDrawer() {
    this.drawer.close();
  }
  // Customizable Area End

   // Customizable Area Start
 
  // Customizable Area End

  async receive(from: string, message: Message) {
    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      this.setState({ token: this.context.state.token, loading: true });
    }

    if (getName(MessageEnum.RestAPIResponceMessage) === message.id) {
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
      const errorReponse = message.getData(
        getName(MessageEnum.RestAPIResponceErrorMessage)
      );
      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      // setTimeout(() => {
      //   this.setState({ loading: false });
      // }, 100);
      this.setState({ loading: false });
      if (apiRequestCallId != null) {
        if (apiRequestCallId === this.getfocusAreaApiCallId) {
          this.getFocusAreaRes(responseJson, errorReponse);
        }
        else if (apiRequestCallId === this.getScoresApiCallId) {
          this.getInsightsApiRes(responseJson, true);
  
        }
        else if (apiRequestCallId === this.getInsightsApiCallId) {
          this.getInsightsApiRes(responseJson, false);
        }
        else if (apiRequestCallId === this.getActionsApiCallId) {
          this.getActionsApiCallIdRes(responseJson);
        }
        else if (apiRequestCallId === this.getGoalApiCallId) {
          this.setState({ goalLoader: false });
  
          this.getGoalRespData(responseJson, false);
        }
        else if (apiRequestCallId === this.getDelAccApiCallId) {
          this.getDelAccApiCallIdRes(responseJson)
        }
      
        else{
        this.getReciveHandler(apiRequestCallId,message,responseJson);
        }
      }
      if(responseJson?.errors) {
        this.setState({ actionLoader: false });
      }
     

    }
    // Customizable Area End
  }

  // Customizable Area Start

  wellBeingAssessPessProps = {
    onPress: () => {
      this.stopeAudioplay()
      this.props.navigation.navigate('WellbeingCategories');
    }
  }
 // Customizable Area End

 // Customizable Area Start
  asessYourselfPressProps = {
    onPress: () => {
      this.stopeAudioplay();
       this.props.navigation.navigate('AssessmentTest');
    }
  }
   // Customizable Area End

   // Customizable Area Start
  isFirstTimeUserAssesing() {
    const header = {
      "Content-Type": configJSON.validationApiContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getfocusAreaApiCallId = requestMessage.messageId;
    this.setState({ insightsLoader: true })
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.getfocusAreaApi}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.dashboarApiMethodTypePost
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  }
   // Customizable Area End


  getUpcomingAppointmentsData(): boolean {
    // Customizable Area Start
    this.setState({ appointmentsLoader: true });
     const header = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getAppointmentApicallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.getUpcomingAppointment
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
    
  // Customizable Area Start
  CallApi = ({
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
 
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    if (body) {
      requestMessage.addData(
        getName(MessageEnum.RestAPIRequestBodyMessage),
        JSON.stringify(body)
      );
    }
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      endPoint
    );
    const defaultHeaders = {
      "Content-Type": configJSON.dashboarContentType,
      token: this.state.token
    };
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(headers || defaultHeaders)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      method
    );
   
   
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return requestMessage.messageId;
  }
  // Customizable Area End

  // Customizable Area Start
  createAction = (body: Record<string, string>) => {
    console.log("created", body)
    this.createActionApiCallId = this.CallApi({
      endPoint: "bx_block_assessmenttest/action_items",
      method: "POST",
      body,
      newState: { actionLoader: true }
    });
  }
  // Customizable Area End

  // Customizable Area Start
  getActions = () => {
    this.getActionsApiCallId = this.CallApi({
      endPoint: "bx_block_assessmenttest/current_actions",
      method: "GET",
      newState: { actionLoader: true }
    });
  }
  // Customizable Area End

  // Customizable Area Start
  // Customizable Area End
  // Customizable Area Start
  // Customizable Area End
  // Customizable Area Start
  // Customizable Area End

    // Customizable Area Start
  completeAction = (body: any) => {
    this.completeActionApiCallId = this.CallApi({
      endPoint: `bx_block_assessmenttest/update_action`,
      method: "PUT",
      body: body,
      newState: { actionLoader: true }
    });
  }
    // Customizable Area End

   // Customizable Area Start
  toggleActionModal = () => {
    this.stopeAudioplay();
    this.setState(prev => ({
      showActionModal: !prev.showActionModal,
      selectActionDuration: false,
      isCurrenAction:false,
      action_time:''
    }));
  }
    // Customizable Area End

   // Customizable Area Start

  toggleEditActionModal = (id?:any) => {
    this.stopeAudioplay();
    this.setState(prev => ({
      isshowEditActionModal: !prev.isshowEditActionModal,
      selectActionDuration: false,
     }));
  }

  // Customizable Area End

   // Customizable Area Start
  toggleAudio = async (itm: any,paused:boolean) => {
    const songs = [{
      id: itm.id,
      url: itm.url || "",
      title: itm.title || "",
    }]
    if(paused){
      const track = await setup([]);
      this.setState({
        nowPlaying: itm.id,
        paused: paused
      });
    }else{
      const track = await setup(songs);
      const { state, State } = await togglePlayer();
       this.setState({
        nowPlaying: itm.id,
        paused: state !== State.Playing
      });
    
      }
   
 
  }

  // Customizable Area End

 // Customizable Area Start
  pauseAudio = () => {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.setState({ nowPlaying: "" });
    }
  }

  // Customizable Area End

   // Customizable Area Start
  stopAudio = () => {
    if (this.audioPlayer) {
      this.audioPlayer.release();
      this.audioPlayer = null;
    }
  }
   // Customizable Area End

  // Customizable Area Start
  closeVideo = () => {
    this.setState({ videoModal: false });
    Orientation.lockToPortrait();
  }
   // Customizable Area End

  // Customizable Area Start
  selectDuration = () => {
    
    this.setState({ selectActionDuration: true });
  }
    // Customizable Area End

    // Customizable Area Start
  toggleAddGoalModal = () => {
    this.stopeAudioplay();
    this.setState({
      isGoalModal: true,
       isCurrenGole:false,
       action_time:''
    });
  }
 // Customizable Area End

   // Customizable Area Start
  btnHideImageProps = {
    source: UncheckBtn,
  };
 // Customizable Area End

   // Customizable Area Start
  btnShowImageProps = {
    source
      : checkBtn,
  };
   // Customizable Area End

  // Customizable Area Start
  btChooseGaol = (id: any, question_id: any) => {
    let ids = [...this.state.checked];

    if (ids.includes(id)) {
      ids = ids.filter((_id) => _id !== id);

    } else {
      ids.push(id);
    }

    this.setState({ checked: ids });
  };

  // Customizable Area End

   // Customizable Area Start
  txtInputGoalNamePrpos = {
    onChangeText: (text: string) => {
      this.setState({ goalnm: text });

    }
  };

  // Customizable Area End

   // Customizable Area Start
  btnNxtModal = {
    onPress: () => {
      this.stopeAudioplay();
      if (this.state.checked == "") {
        this.showAlert("Alert", "Please choose a focus area.", "");
      }
      else if (this.state.goalstepmodal == 1 && this.state.goalnm == "") {
        this.showAlert("Alert", "Please add a goal.", "");
      }
      else if (this.state.goalstepmodal == 1 && this.state.goalnm.trim().length >50) {
        this.showAlert("Alert", "Please add a 50 char.", "");
      }
      else if (this.state.goalstepmodal == 1 && this.state.goalnm.trim() == "") {
        this.showAlert("Alert", "Please add a valid goal.", "");
        this.setState({goalnm: ''})
      } 
      else if (this.state.goalstepmodal == 2) {
          this.verifyGoalDate()
      }
      else{ 
        this.moveForward()
      }
    }
  }

  verifyGoalDate(){
    if(this.state.goalCompetionDate == ""){
      this.showAlert("Alert", "Please choose a goal completion date.", "");
    }
    else if(this.state.goalCompetionDate.isBefore(moment())){
      this.showAlert("Alert", "Please choose a future date.", "");
    }
  }

  moveForward(){
    this.setState({ isAddGoal: this.state.goalstepmodal == 0 ? true : false, goalstepmodal: this.state.goalstepmodal + 1, iscompeteGaol: this.state.goalstepmodal > 0 ? true : false ,goalnm:this.state.goalnm.trim()})
  }
  // Customizable Area End

   // Customizable Area Start
  btnSubmitModal = {
    onPress: () => {
      if (this.state.checked == "") {
        this.showAlert("Alert", "Please choose a focus area.", "");
      }
      else if (this.state.goalstepmodal == 1 && this.state.goalnm == "") {
        this.showAlert("Alert", "Please choose a focus area.", "");
      } else if (this.state.goalstepmodal == 2 && this.state.goalCompetionDate == "") {
        this.showAlert("Alert", "Please choose a goal completion date.", "");
      }
      else if (this.state.goalstepmodal == 2 && this.state.goalCompetionDate.isBefore(moment())) {
        this.showAlert("Alert", "Please choose a future date.", "");
      }
      else if (this.state.goalstepmodal == 2 && this.state.goalCompetionTime == "") {
        this.showAlert("Alert", "Please choose a goal completion Time.", "");
      }

      else {
        this.setState({ isAddGoal: false, goalstepmodal: 0, iscompeteGaol: false, isGoalModal: false, goalnm: "", goalCompetionDate: "", checked: ""}, () => { })
        this.addGoal({focus_area_id:this.state.checked,  goal: this.state.goalnm, date: this.state.goalCompetionDate, time_slot:this.state.action_time==""?this.state.goalCompetionTime.format('hh:mm A'):this.state.action_time });
      }
    }
  }
  // Customizable Area End

  // Customizable Area Start
  addGoal = (body: Record<string, string>) => {
    this.addGoalApiCallId = this.CallApi({
      endPoint: "bx_block_assessmenttest/goals",
      method: "POST",
      body,
      newState: { goalLoader: true }
    });
  }
   // Customizable Area End

    // Customizable Area Start
  updateGoal = (body: Record<any, any>) => {

    this.updateGoalApiCallId = this.CallApi({
      endPoint: `bx_block_assessmenttest/update_goal?id=${this.state.editgoalid}`,
      method: "PUT",
      body,
      newState: { goalLoader: true }
    });
  }
   // Customizable Area End

   // Customizable Area Start
  getGoaldata = () => {
    this.getGoalApiCallId = this.CallApi({
      endPoint: "bx_block_assessmenttest/current_goals",
      method: "GET",
      newState: { goalLoader: true }
    });
  }
   // Customizable Area End

   // Customizable Area Start
  getCompetedGoaldata = () => {
    this.getCompetedGoalApiCallId = this.CallApi({
      endPoint: "bx_block_assessmenttest/completed_goals",
      method: "GET",
      newState: { goalLoader: true }
    });
  }
   // Customizable Area End

  // Customizable Area Start
  deleteGoal = (body: Record<string, string>) => {
    this.deleteGoalApiCallId = this.CallApi({
      endPoint: `bx_block_assessmenttest/destroy_goal?id=${this.state.editgoalid}`,
      method: "DELETE",
      body,
      newState: { goalLoader: true }
    });
  }
     // Customizable Area End

   // Customizable Area Start
  markasCompetGoalModal = (goalnm: any, goalid: any) => {
     this.setState({ competeGoalModal: true }, () => {
      });
  }
   // Customizable Area End

    // Customizable Area Start
  txtInputEditGoalNamePrpos = {
    onChangeText: (text: string) => {
        this.setState({ editgoal: text })
      //@ts-ignore
      }
  };
    // Customizable Area End

   // Customizable Area Start
  btnEditNxtModal = {
    onPress: () => {
      this.stopeAudioplay();
      const regName = configJSON.regexCompat;
     if (this.state.editgoalstepmodal == 0 && this.state.editgoal == "") {
        this.showAlert("Alert", "Please add a goal.", "");
      }
      else if(this.state.editgoalstepmodal == 0 &&this.state.editgoal.trim().length>50){
        this.showAlert("Alert", "Please add  50 char .", "");
        this.setState({editgoal: ''})
      }
      else if (this.state.editgoalstepmodal == 0 && this.state.editgoal.trim() == "") {
        this.showAlert("Alert", "Please add a valid goal.", "");
      } 
      else if (this.state.editgoalstepmodal == 1 && this.state.goalCompetionDate == "") {
        this.showAlert("Alert", "Please choose a goal completion date.", "");
      } 
     
      else this.setState({ editgoalstepmodal: this.state.editgoalstepmodal + 1, isEditcompeteGaol:  true , editgoal:this.state.editgoal.trim() })
    }
  }
  // Customizable Area End

  // Customizable Area Start
  btnSaveCompeteGoalModal = {
    
    onPress: () => {
      if(this.state.goalCompetionDate.isBefore(moment())){
        this.showAlert(configJSON.Alert, configJSON.chooseFeatureDate, "");
        return
      }
      this.stopeAudioplay()
      this.updateGoal({ goal: this.state.editgoal,date:this.state.goalCompetionDate,time_slot:this.state.action_time==""?this.state.goalCompetionTime.format('hh:mm A'):this.state.action_time })
      this.setState({ competeGoalModal: false, loading: true, editgoal: "", editgoalid: "" ,editgoalstepmodal:0,isEditcompeteGaol:false});

    }

  }
  // Customizable Area End

  // Customizable Area Start
  btnDeleteGoal = {
    onPress: () => {
      this.setState({ competeGoalModal: false, loading: true, editgoal: "", editgoalid: "" })
      this.deleteGoal({});
    }
  }
  // Customizable Area End

  // Customizable Area Start
  btnMarkasCompeteGoal = {
    onPress: () => {
      this.updateGoal({ is_complete: true ,goal:this.state.editgoal})
      this.setState({ competeGoalModal: false, loading: true, editgoalid: "", editgoal: "", markcomplete: true });
    }

  }
    // Customizable Area End

    // Customizable Area Start
  logOut = async () => {
    AsyncStorage.removeItem("nameEdited");
    AsyncStorage.removeItem("wellBeing");
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("fcmToken");
          this.saveFcmTOken(this.state.token);
          this.setState({ enable: false ,articleData:[],audioData:[],videoData:[]})
      
          setTimeout(() => {
            this.context?.dispatch?.({ type: set_user_data, payload: initState });
          }, 500);
          this.props.navigation.navigate("EmailAccountLoginBlock")
        }
      }
    ])
  }
    // Customizable Area End

  // Customizable Area Start
  saveFcmTOken = async (token: any) => {
    let fcmtoken = await AsyncStorage.getItem('fcmToken');

    const attrs = {
      device_token: fcmtoken
    };
     

    this.devicetokenApiCallId = this.CallApi({
      endPoint: "bx_block_push_notifications/device_token",
      method: "POST",
      body: attrs,
      newState: { loading: true }
    });
  }
   // Customizable Area End

    // Customizable Area Start
  getDataDataList = async () => {
    this.getachievementApiCallId = this.CallApi({
      endPoint: "profile_details",
      method: "GET",
      newState: { loading: true }
    });
  }
    // Customizable Area End

  // Customizable Area Start
  getMoodList = async () => {
    this.getMoodsApiCallId = this.CallApi({
      endPoint: "motions",
      method: "GET"
    });
  }
  // Customizable Area End

  // Customizable Area Start
  getScores = async () => {
    this.getScoresApiCallId = this.CallApi({
      endPoint: "bx_block_wellbeing/user_strength",
      method: "GET",
      newState: { insightsLoader: true }
    });
  }
// Customizable Area End

// Customizable Area Start
  getInsights = async () => {
    this.getInsightsApiCallId = this.CallApi({
      endPoint: "bx_block_wellbeing/insights",
      method: "GET",
      newState: { insightsLoader: true }
    });
  }
  // Customizable Area End

   // Customizable Area Start
  getGoalBoard = async () => {
    this.getGoalBoardApiCallId = this.CallApi({
      endPoint: "bx_block_assessmenttest/goal_boards",
      method: "GET",
      newState: { goalLoader: true }
    });
  }
    // Customizable Area End

    // Customizable Area Start
  getSuggestions = async () => {
    const showLoader = (!this.state.audioData.length || !this.state.videoData.length || !this.state.articleData.length);
    this.getSuggestionApiCallId = this.CallApi({
      endPoint: "suggestion",
      method: "GET",
      newState: { suggestionsLoader: showLoader }
    });
  }
  onPressArticle=(type:string)=>{
    this.setState({
      nowPlaying: "",
      paused: true
    })
    TrackPlayer.pause();
    if(type=="articles"){
      this.state.articleData.length>0 ? this.props.navigation.navigate("AudioLibrary", { type: type }) : this.toastRef?.show?.("No items to show")
 
    }else  if(type=="audio"){
      this.state.audioData.length>0 ? this.props.navigation.navigate("AudioLibrary", { type: type }) : this.toastRef?.show?.("No items to show")
 
    }
    else  this.state.articleData.length>0 ? this.props.navigation.navigate("AudioLibrary", { type: type }) : this.toastRef?.show?.("No items to show")
   }
  
   OnpressCancelBooking=(id:string)=>{
    const attrs = {
      booked_slot_id: id
    };
    
    this.cancelBookingApiCallId = this.CallApi({
      endPoint: "bx_block_calendar/booked_slots/cancel_booking",
      method: "POST",
      body:attrs,
      newState: { appointmentsLoader: true }
    });
   }

    onRefresh =() => {
    this.setState({loading:true})
  
    this.getUpcomingAppointmentsData();
    this.getDataDataList();
    this.getInsights();
  
    this.getSuggestions();
    this.getActions();
    this.getMoodList();
  };
  onMeetingPress=(disabled:boolean,item:any)=>{
    if (disabled) return;
    this.setState({ selectedCoach_id: item?.item?.attributes?.coach_details?.id })
    if(item.item?.attributes?.meeting_code){
    this.startMeeting(item.item?.attributes?.meeting_code, item?.item?.id)
    }
    else{
      this.showAlert("Alert","Something went wrong. Please try again later","")
    }
  }
  onCancelPressbtn=(item:any,disabled:boolean)=>{
    if(item?.item?.id&&disabled){
      this.OnpressCancelBooking(item.item?.id)
      }
      else{
        this.showAlert("Alert","Booking can't be cancelled before the 5 minutes of meeting. ","")
      }
  }
  updatedeleteGoalApiRes=(responseJson:any)=>{
       this.setState({ editgoalid: "", editgoal: "", goalnm: "",action_time:"" });

          if (responseJson?.meta?.message) {
            this.showAlert("Alert", responseJson?.meta?.message.toString(), "");
        
          }
          else if (responseJson?.message) {
            this.showAlert("Alert", responseJson?.message.toString(), "");
        
          }
        this.getGoalBoard();
        this.setState({ goalLoader: false });
   
  }
  getMediaApiResponse = (responseJson: any) => {
    if (responseJson?.data) {
      this.setState({ suggestionsLoader: false, audioData: responseJson?.data });
      const songs = responseJson?.data?.map((r: any) => ({
        id: r.id,
        url: r?.attributes?.file_info?.[0]?.url || "",
        title: r?.attributes?.file_info?.[0]?.title || "",
      }));
      setup(songs);
    }
  }
  getSuggestionApiResponse=async(responseJson:any)=>{
    if (responseJson?.data) {
      const { docs, audios, videos } = responseJson?.data?.attributes;
       audios?.map((song: any) => ({
        id: song.id,
        url: song.url || "",
        title: song.title || "",
      }));
      await setup([]);
      this.setState({
        suggestionsLoader: false,
        articleData: docs,
        audioData: audios,
        videoData: videos
      });
    } else {
      this.setState({ suggestionsLoader: false });
    }
  }
  cancelBookingApiResponse=(responseJson:any)=>{
    if(responseJson?.data?.attributes?.cancelled_by?.message.message){
      this.showAlert("Alert", responseJson?.data?.attributes?.cancelled_by.message?.message, "");
      this.getUpcomingAppointmentsData();
      }
      else{
        this.setState({appointmentsLoader:false});
        this.showAlert("Alert", responseJson?.error, "");
     
      }
  }
  getGoalBoardApiRes=(responseJson:any)=>{
    if (responseJson.message) {
      this.setState({ goalLoader: false });
      } else if (responseJson?.data) {
        const { current_goals, completed_goals} = responseJson?.data?.attributes;
        this.setState({ goalLoader: false,loading: false, goalData: current_goals, completedGoalData:completed_goals });
      }
  }
  getInsightsApiRes=(responseJson:any,isscore:boolean)=>{
    if (responseJson.message) {
      this.setState({ insightsLoader: false });
    }else if (responseJson&&isscore) {
      this.setState({ topStrenghts: responseJson.length > 0 ? responseJson : [], insightsLoader: false });
    } else if (responseJson?.data&&!isscore) {
      const { top_strength, focus_areas} = responseJson?.data?.attributes;
       if(top_strength)
      {
        this.setState({ topStrenghts: top_strength.length > 0 ? top_strength : [], insightsLoader: false });
      }
      if(focus_areas)
      {
        this.setState({ focusAreaData: [].concat(focus_areas), insightsLoader: false })
      }
      
  }
  }
  getFocusAreaRes=(responseJson:any,errorReponse:any)=>{
    if (responseJson?.errors != undefined && responseJson?.data) {
      this.setState({
        errorMsg: errorReponse,
        insightsLoader: false
      });
    } else {
      this.setState({ focusAreaData: [].concat(responseJson), insightsLoader: false })
    }

  }

  getAppointDataLocal = async () => {
    const data = await AsyncStorage.getItem('appointmentData') || "[]"
    return JSON.parse(data)
  }

  getAppointmeResp= async (responseJson:any)=>{
    console.log('   #####____ getAppointmeResp : ', responseJson)
    if (responseJson?.errors != undefined && !responseJson?.data) {
      await AsyncStorage.setItem("appointmentData", JSON.stringify([]) );
      this.setState({
        appointmentsLoader: false,
        appointmentData:[]
      });
    } else {
      await AsyncStorage.setItem("appointmentData", JSON.stringify(responseJson?.data) );
      console.log('####__ getAppointmeResp -> else ', AsyncStorage.getItem('appointmentData'))
      this.setState({ appointmentData: responseJson?.data, appointmentsLoader: false });
    }
  }

  getProfileResp=(responseJson:any)=>{
    if (responseJson.message) {
      return;
    } else if (responseJson?.data) {
      let profilenm=responseJson.data.attributes.profile_name ? responseJson?.data.attributes?.profile_name:responseJson?.data?.attributes?.full_name;
      this.setState({
        prifileimage: responseJson?.data.attributes?.image,
        full_name: profilenm,
      })
    }
 

  }
  getMoodsRes=(responseJson:any)=>{
    if (responseJson.message) {
      return;
    } else if (responseJson?.data) {
      this.setState({
        moodsList: responseJson?.data
      });
      this.adjustWhaleSlider(this.state.percentage);
    }
  }
  getActionsApiCallIdRes=(responseJson:any)=>{
    console.log("ttttt ", responseJson )
    if (responseJson?.message) {
      this.setState({ actionLoader: false });
    } else if (responseJson?.data) {
      this.setState({ actionLoader: false, actionData: responseJson?.data });
    }
  }
  getDelAccApiCallIdRes=(responseJson: any)=>{
    if (responseJson && responseJson?.message && responseJson?.data) {
      Alert.alert("Success",responseJson?.message)
      this.logOut()
    } else if (responseJson?.data || responseJson?.errors){
      Alert.alert("Fail", "Could not process your request. Try later")
    }
  }
  getVideosArticlesApiCallRes=(responseJson:any,isarticle:boolean)=>{
    
    if (responseJson?.data&&!isarticle) {
      this.setState({ suggestionsLoader: false, videoData: responseJson.data });
    }else if(isarticle){
      if (responseJson?.data) {
        this.setState({ suggestionsLoader: false, articleData: responseJson.data });
      } else {
        this.setState({ suggestionsLoader: false });
      }
    }

  }
  getGoalRespData=(responseJson:any,is_complete:boolean)=>{
    
    if (responseJson?.data&&is_complete) {
      this.setState({ loading: false, completedGoalData: responseJson?.data });
    }
    else{
      if (responseJson?.data) {
        this.setState({ loading: false, goalData: responseJson?.data });
      }
    }
  }
  getReciveHandler = async (apiRequestCallId:any,message:Message,responseJson:any) => {
    

     if (apiRequestCallId === this.getAppointmentApicallId) {
        this.setState({ loading: false });
        this.getAppointmeResp(responseJson);
      }
  
      else if (apiRequestCallId === this.addGoalApiCallId) {
        this.updatedeleteGoalApiRes("");

      }
      else if (apiRequestCallId === this.getCompetedGoalApiCallId) {
        this.setState({ goalLoader: false });
        this.getGoalRespData(responseJson, true);


      }
      else if (apiRequestCallId === this.updateGoalApiCallId) {
        this.updatedeleteGoalApiRes(responseJson);

      }
      else if (apiRequestCallId === this.deleteGoalApiCallId) {
        this.updatedeleteGoalApiRes(responseJson);

      }

      else if (apiRequestCallId === this.createActionApiCallId) {
        this.setState({ actionLoader: false,action_time:""  });
        this.toggleActionModal();
        this.getActions();
      }
      else if (apiRequestCallId === this.completeActionApiCallId) {

        this.setState({ loading: false,action_time:""});
        this.toggleEditActionModal();
        setTimeout(() => {
          this.getActions();
        }, 1000)
      }
     
      // Profile Image
      else if (apiRequestCallId === this.getachievementApiCallId) {
        this.getProfileResp(responseJson);
      }
      else if (apiRequestCallId === this.getMoodsApiCallId) {
        this.getMoodsRes(responseJson);
      }
  
    
      else if (apiRequestCallId === this.getGoalBoardApiCallId) {
         this.getGoalBoardApiRes(responseJson);
      }
      else if (apiRequestCallId === this.getSuggestionApiCallId) {
        this.getSuggestionApiResponse(responseJson);
        try {this.getUpcomingAppointmentsData()} catch (error) {}
        try {this.getGoalBoard(); } catch (error) {}
        try {this.getActions(); } catch (error) {}
        try {this.getMoodList(); } catch (error) {}
        try {this.getDataDataList(); } catch (error) {}
      }

      else if (apiRequestCallId === this.cancelBookingApiCallId) {
        this.cancelBookingApiResponse(responseJson)

      }
     

    
  }
 stopeAudioplay=()=>{ TrackPlayer.seekTo(0);
  TrackPlayer.pause();
  this.setState({ paused: true, nowPlaying: "" });
}

  showDelAlert=()=>{
    AsyncStorage.removeItem("nameEdited");
    AsyncStorage.removeItem("wellBeing");
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
    this.getDelAccApiCallId = this.CallApi({
      endPoint: "/account_block/delete_account",
      method: "GET"
    });
  }

  getUrl=(item:{thumbnail:string})=>{
    if(item.thumbnail){
     return {uri:item?.thumbnail}
    }
    return IMG_CONST.articlesBlog
   }

   onPressIosRenderAction=(item:IosItemType) => { 
    this.setState({ editActionItmId: item.id, editActionItm: item.attributes.action_item,
  isCurrenAction:true, 
  currentActionTime:item.attributes.time_slot, 
  action_time:item.attributes.time_slot, 
  currentActionDate:moment(new Date(item.attributes.date)) }, 
  this.toggleEditActionModal) 
}

  onPressRenderGoleItem=(goal:GoalItemType)=>{
    this.setState({ editgoal: goal.goal, editgoalid: goal.id, isCurrenGole:true, currentGoleTime:goal.time_slot, action_time:goal.time_slot, goalCompetionDate:moment(new Date(goal.date))}, () => {
      this.markasCompetGoalModal(goal.goal, goal.id)
    })
  }

  onSelectDateTimevalue=()=>{
    this.setState({isCurrenAction:false, action_time:''})
  }
  onselectCurrengoleTimeDate =(time:moment.Moment)=>{
    this.setState({ goalCompetionTime: time , isCurrenGole:false, action_time:''});
  }
  handleDateCheck=()=>{
    return this.state.isCurrenAction ?this.state.currentActionDate: moment()
   }
   inputStyleValue = ()=>{
    return{ paddingVertical: this.isPlatformiOS()  ? 14 : 1 }
   }
  // Customizable Area End
  
}
