import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import { imgPasswordInVisible, imgPasswordVisible } from "./assets";
import{headerImgBg,backImg} from '../../appointmentmanagement/src/assets'
import moment from "moment";
import { AppContext } from "../../../components/src/context/AppContext";
export type TimeSlotData = TimeSlotType[];
export interface TimeSlotType {
  sno: string
  to:string
  from:string
  booked_status:boolean
  
}



export type NavObject=TypeNav
export interface TypeNav{
  addListener:Function
  goBack:Function
}
export type BookingList = Bookings[]

export interface Bookings {
  bookingid: string
  type: string
  attributes: { start_time: string }
}






// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: NavObject;
  screenId: string;
  // Customizable Area Start
  // Customizable Area End
}

interface S {
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  // Customizable Area Start
  appointmentsList:BookingList;
  available_date: string;
  selected_date:string;
  token:string;
  width:number;
  date:Date;
  timeslots:TimeSlotData
  // Customizable Area End
}

interface SS {
  screenId: number;
  // Customizable Area Start
  // Customizable Area End
}

export default class ShareCalendarController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getAppointmentsListApiCallId: string="";
  getTimeslotsApiCallId: string = "";
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

     this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
    
      // Customizable Area End
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      // Customizable Area Start
      appointmentsList: [],
      available_date:moment(new Date()).format("DD/MM/YYYY"),
      width:20,
      selected_date:moment(new Date()).format("DD/MM/YYYY"),
      token:"",
      date:new Date(),
      timeslots:[]
      // Customizable Area End
    };
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);

    // Customizable Area Start
    // Customizable Area End
  }

  async receive(from: string, message: Message) {
   
    // Customizable Area Start
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
   
      this.setState({ token: this.context.state.token },()=>{
        this.getAppointmentList(this.context.state.token);
   
      });
       }
     else  if (
       getName(MessageEnum.RestAPIResponceMessage) === message.id 
     ) {
      const responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
      const apiRequestCallId = message.getData(
        getName(MessageEnum.RestAPIResponceDataMessage)
      );
  
      if(apiRequestCallId === this.getAppointmentsListApiCallId){
       if (responseJson.data) {
        this.processData(responseJson.data);      
       } 
     }
     else  if (apiRequestCallId===this.getTimeslotsApiCallId) {
     
   if (responseJson.time_slots) {
       this.setState({timeslots:responseJson.time_slots},()=>{
              this.calDateChange(this.state.selected_date);
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

    btnExampleProps = {
      onPress: () => this.doButtonPressed(),
    };

  btnShowHideImageProps = {
    source: this.txtInputProps.secureTextEntry
      ? imgPasswordVisible
      : imgPasswordInVisible,
  };

 

  doButtonPressed() {
    let msgData = new Message(getName(MessageEnum.AccoutLoginSuccess));
    msgData.addData(
      getName(MessageEnum.AuthTokenDataMessage),
      this.state.txtInputValue
    );
    this.send(msgData);
  }


  setInputValue = (text: string) => {
    this.setState({ txtInputValue: text });
  };

  setEnableField = () => {
    this.setState({ enableField: !this.state.enableField });
  };

  // Customizable Area Start

  headerbgImg = {
    source: headerImgBg
  }
  backbtnImgProps = {
    source: backImg
  }
  backBtnPress = {
    onPress: () => {
        this.props.navigation.goBack(null);
    },
  };

  calDateChange=(availableDate: string)=>{
     this.setState({selected_date:moment(availableDate).format('DD/MM/YYYY').toString()},()=>{
      this.getAppointmentList(this.state.token)
   
    })
   
  }
  getAppointmentList = (token: string) => {
    
     const header = {
      "Content-Type": configJSON.appointmentApiContentType,
      token: this.state.token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

 
    const attrs = {
      booking_date:this.state.selected_date,
       }
    this.getAppointmentsListApiCallId = requestMessage.messageId;
    let urlParams = new URLSearchParams(attrs).toString();
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `bx_block_calendar/booked_slots?${urlParams}`
    );
   
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      "GET"
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  async componentDidMount() {
   
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
     });
    }
 
  }

  static contextType?= AppContext;


  getToken = () => {
   this.setState({token:this.context.state.token}, ()=> {
    this.getTimeslots();
   })
  };
getTimeslots=()=> {
  const header = {
    "Content-Type": configJSON.appointmentApiContentType,
    token: this.state.token,
  };
  const requestMessage = new Message(
    getName(MessageEnum.RestAPIRequestMessage)
  );
 this.getTimeslotsApiCallId = requestMessage.messageId;
 
  requestMessage.addData(
    getName(MessageEnum.RestAPIRequestHeaderMessage),
    JSON.stringify(header)
  );
  requestMessage.addData(
    getName(MessageEnum.RestAPIResponceEndPointMessage),
    `bx_block_calendar/booked_slots/all_slots`
  );
 
  requestMessage.addData(
    getName(MessageEnum.RestAPIRequestMethodMessage),
    "GET"
  );

  runEngine.sendMessage(requestMessage.id, requestMessage);
}

processData=(data:Bookings[])=>{
  let  prods:TimeSlotData=[];
  data.forEach((itmdata:Bookings)=>{
    let {start_time } = itmdata?.attributes
  
    this.state.timeslots.forEach(function(itmslot) {
    if(itmslot.from===moment(start_time,"DD/MM/YYYY HH").format("hh:mm A").toString()){
      itmslot.booked_status=true
    }
  prods.push(itmslot)
   
  });
 
  })       
   this.setState({
         appointmentsList: data,
         timeslots:prods
       });  
}
  // Customizable Area End
}
