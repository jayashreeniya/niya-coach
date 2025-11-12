import moment from "moment";
import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName,
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
import{headerImgBg,backImg} from './assets'
let d = new Date();
let m = d.getMonth(); //current month
let y = d.getFullYear(); //current year
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

export interface S {
  // Customizable Area Start
  available_date: any;
  date:any;
  selected_date:any;
  start_time: any;
  end_time: any;
  id: any;
  token: string;
  appointmentsList: any;
  isRefreshing: boolean;
  isconfirmModal:boolean;
  isconfirmPress:boolean;
  modalTitle:string;
  modalSubtitle:string;
  shownisconfirmmsg:boolean;
  SliderPad:any;
  TIME:any;
  width:any;
  selected:any;
  totaldaysInMonth:any;
  seleCoachData:any;
  converted_time:any;
  service_provider_id:""
  // Customizable Area End
}

export interface SS {
  id: any;
  // Customizable Area Start
  // Customizable Area End
}

interface ContextState {
  state: {
    token: string;
  };
}

export default class CoachTabController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  addAppointmentApiCallId: any;
  getAppointmentsListApiCallId: any;
  deleteAllAppointmentsApiCallId: any;
  // Customizable Area End

  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    this.subScribedMessages = [
      // Customizable Area Start
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionResponseMessage),
      // Customizable Area End
    ];

    this.isStringNullOrBlank = this.isStringNullOrBlank.bind(this);
    let endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + 30);
    this.state = {
      // Customizable Area Start
      id: 0,
      start_time:"06:00" ,//new Date(),
      end_time: "06:59",//endTime,
      date:new Date(),
      available_date:moment(new Date()).format("DD/MM/YYYY"),//moment(new Date()).format("MM DD YYYY"),//moment(new Date()).format("MMM YYYY DD"),
      selected_date:moment(new Date()).format("DD/MM/YYYY"),
    
      appointmentsList:[],
      token: "",
      isRefreshing: false,
      isconfirmModal:false,
      isconfirmPress:false,
      shownisconfirmmsg:false,
      modalTitle:'Appointment confirmation',
      modalSubtitle:`Do you want to confirm this appointment with `,
      SliderPad:12,
      TIME: {  min: 0,  max: 24 },
      width:20,
      selected:[6],
      totaldaysInMonth:new Date(y,m+1,0),
      seleCoachData:"",
      converted_time:"6:00 AM",
      service_provider_id:""
      
      // Customizable Area End
    };

    // Customizable Area Start
    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }

  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
    // Customizable Area Start
    // Customizable Area End
  }

  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };

  receive = async (from: string, message: Message) => {
    // Customizable Area Start
    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.addAppointmentApiCallId != null &&
      this.addAppointmentApiCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      let responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
   

       if (responseJson && !responseJson.errors && responseJson.data) {
        this.getAppointmentList(this.state.token);
        this.setState({shownisconfirmmsg:true,isconfirmPress: true,modalTitle: 'Appointment confirmed', modalSubtitle:`Confirmed appointment with coach \n${responseJson.data.attributes.coach_details.full_name} on ${moment(responseJson.data.attributes.start_time,'DD/MM/YYYY HH').format('DD MMM YYYY hh A ')}`  })
    
     setTimeout(() => {
      this.setState({ shownisconfirmmsg:false,isconfirmPress: false,isconfirmModal:false,  modalTitle:'Appointment confirmation',  modalSubtitle:`Do you want to confirm this appointment with ${this.state.seleCoachData.full_name}?`,
     })
     }, 3000);
      
      } else {
   
        let errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );
      
        this.parseApiErrorResponse(responseJson);
        this.setState({ shownisconfirmmsg:false,isconfirmPress: false,isconfirmModal:false, modalTitle:'Appointment confirmation',  modalSubtitle:`Do you want to confirm this appointment with ${this.state.seleCoachData.full_name}?`});
        this.parseApiCatchErrorResponse(errorReponse);
      }
    } else if (getName(MessageEnum.SessionResponseMessage) === message.id) {
   
     this.setState({ token: (this.context as ContextState).state.token });
      this.getAppointmentList((this.context as ContextState).state.token);
      }
    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.getAppointmentsListApiCallId != null &&
      this.getAppointmentsListApiCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
          let responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );
   
       
      if (responseJson && !responseJson.errors && responseJson.data) {
        console.log(responseJson,"if responseJson")
        this.setState({
              appointmentsList: responseJson.data
            });
       
      } else {
        console.log(responseJson," else responseJson")
         this.setState({ appointmentsList: [] });

        let errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );

        this.parseApiCatchErrorResponse(errorReponse);
      }
    }
    // Customizable Area End
  };

  // Customizable Area Start
  static contextType?: Context<any>= AppContext;

  isStringNullOrBlank(str: string) {
    return str === null || str.length === 0;
  }

  addAppointment(): boolean {
    console.log("========================^&^&^^^&#######this.state.available_date",this.state.selected_date,"this.state.start_time",this.state.start_time,"this.state.end_time",this.state.end_time,"this.state.seleCoachData.id",this.state.seleCoachData.id,"this.state.end_time==",this.state.end_time== "")
    console.log(moment(this.state.start_time,"HH").format("hh:mm A"),">>??>?",moment(this.state.end_time,"HH:mm").format('hh:mm A'))
   
    if (
      this.isStringNullOrBlank(this.state.selected_date) ||
      this.isStringNullOrBlank(this.state.start_time) ||
      this.isStringNullOrBlank(this.state.end_time)
    ) {
      this.showAlert(
        configJSON.errorTitle,
        configJSON.errorAllFieldsAreMandatory,
        ""
      );
      return false;
    }

    const header = {
      "Content-Type": configJSON.appointmentApiContentType,
      token: this.state.token,
    };

    
    const attrs = {
      start_time:this.state.start_time,
      end_time:this.state.end_time== ""?"09:59" :this.state.end_time,
      service_provider_id:this.state.seleCoachData.id,
      booking_date:this.state.selected_date
    };


    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

    this.addAppointmentApiCallId = requestMessage.messageId;

    const httpBody = {
      ...attrs,
    };
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.appointmentAPiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestBodyMessage),
      JSON.stringify(httpBody)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.addAppointmentAPiMethod
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    return true;
  }

  getAppointmentList = (token: any) => {
    console.log("converted times",this.state.converted_time)
    console.log("=====getAppointmentList",this.state.start_time,"converted time ",this.state.end_time)
    console.log(moment(this.state.start_time,"HH").format("hh:mm A"),">>??>?",moment(this.state.end_time,"HH:mm").format('hh:mm A'))
    const header = {
      "Content-Type": configJSON.appointmentApiContentType,
      token: token,
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );

 
    const attrs = {
      booking_date:this.state.selected_date,
      start_time:moment(this.state.start_time,"HH").format("hh:mm A")
    }
    this.getAppointmentsListApiCallId = requestMessage.messageId;
    let urlParams = new URLSearchParams(attrs).toString();

    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      `${configJSON.viewCoachAvailability}?${urlParams}`
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.getAppointmentListAPiMethod
    );

    runEngine.sendMessage(requestMessage.id, requestMessage);
  };

  navigateToAppointments = () => {
    this.props.navigation.navigate("Appointments");
  };
  // Customizable Area Start

  schdeuleCallProps={
    onPress:()=>{
      this.setState({isconfirmModal:true})
    }
  }
  headerbgImgProps={
    source:headerImgBg
  }
  backImgProps={
    source:backImg
  }
 

  backbtnPressProps = {
    onPress: () => {
      console.log("Pressed ")
        this.props.navigation.goBack(null);
        },
  };
showConfirmModalMsg={
  onPress:()=>{
    this.addAppointment()
   
    }

}
onLayout = (event:any) => {
  this.setState({width:event.nativeEvent.layout.width - this.state.SliderPad * 2})
  };
 onValuesChangeFinish = (values:any) => {
  let seletedtime=0+values;
  console.log(values,values.length,"@@@@@@@@@@@@@@@@@=====",seletedtime);
 

 
  if(values<13){
    this.setState({converted_time:values+":00 AM"});
    this.setState({selected:values,start_time:values+":00 AM",end_time:values+":"+59,converted_time:values+":00 AM"},()=>{
      this.getAppointmentList(this.state.token);
    })
  }else{
    let time=values-12
    this.setState({converted_time:time+":00 PM"});
    this.setState({selected:values,start_time:values+":00 PM",end_time:values+":"+59,converted_time:values+":00 AM"},()=>{
      this.getAppointmentList(this.state.token);
    })
  }
};

DateChange=(availableDate: any)=>{
  console.log(availableDate,"availabe strip",moment(availableDate).format('DD/MM/YYYY'))
  this.setState({selected_date:moment(availableDate).format('DD/MM/YYYY')},()=>{
    this.getAppointmentList(this.state.token)
 
  })
 
}


  // Customizable Area End
}
